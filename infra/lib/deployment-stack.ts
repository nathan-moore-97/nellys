
import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';

import * as dotenv from 'dotenv';

export class DeploymentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const createBucket = this.node.tryGetContext('createBucket') || false;

        // VPC
        const vpc = new ec2.Vpc(this, 'NellysDevVPC', {
            maxAzs: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "PublicSubnet",
                    subnetType: ec2.SubnetType.PUBLIC,
                },
            ]
        });

        // Security Groups
        const backendSG = new ec2.SecurityGroup(this, "ApiSecurityGroup", {
            vpc,
            description: "Security Group For API Instances",
            allowAllOutbound: true,
        });


        const frontendSG = new ec2.SecurityGroup(this, "ClientSecurityGroup", {
            vpc,
            description: "Security group for frontend react app",
            allowAllOutbound: true,
        });

        frontendSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP);
        frontendSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));

        backendSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP);
        backendSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));

        // Compute Instances
        const frontendInstance = new ec2.Instance(this, "FrontendInstance", {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
            securityGroup: frontendSG,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
        });

        const backendInstance = new ec2.Instance(this, "BackendInstance", {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
            securityGroup: backendSG,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            blockDevices: [{
                deviceName: "/dev/xvdb",
                volume: ec2.BlockDeviceVolume.ebs(8, {
                    encrypted: false,
                    deleteOnTermination: false,
                })
            }]
        });

        let galleryBucket;

        if (createBucket) {
            galleryBucket = new s3.Bucket(this, 'GalleryBucket', {
                bucketName: `nellysdev-gallery-${this.account}`,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                encryption: s3.BucketEncryption.S3_MANAGED,
                // Delete everything in the gallery and destroy the bucket.
                // This is mainly to keep costs low in development while
                // I am not intending to leave the infrastructure running
                // for any length of time. 
                // autoDeleteObjects: true,
                // removalPolicy: cdk.RemovalPolicy.DESTROY,
                removalPolicy: cdk.RemovalPolicy.RETAIN,
            });
        } else {
            galleryBucket = s3.Bucket.fromBucketName(this, 'GalleryBucket', `nellysdev-gallery-${this.account}`);
        }

        galleryBucket.grantRead(backendInstance.role!);

        // DNS - Corrected hosted zone creation
        const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
            zoneName: 'nellysdev.org',
            comment: 'Hosted zone for nellysdev.org website',
        });

        new route53.ARecord(this, 'FrontendARecord', {
            zone: hostedZone,
            target: route53.RecordTarget.fromIpAddresses(frontendInstance.instancePublicIp),
            recordName: 'nellysdev.org',
            ttl: cdk.Duration.minutes(5),
        });

        new route53.ARecord(this, 'BackendARecord', {
            zone: hostedZone,
            target: route53.RecordTarget.fromValues(backendInstance.instancePublicIp),
            recordName: 'api.nellysdev.org',
            ttl: cdk.Duration.minutes(5),
        });

        // https://stackoverflow.com/questions/54415841/nodejs-not-installed-successfully-in-aws-ec2-inside-user-data

        dotenv.config({
            path: '../client/.env',
        });

        frontendInstance.addUserData(
            'sudo yum install -y git nginx',
            'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash',
            `export NVM_DIR="$HOME/.nvm"`,
            `[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`,
            'nvm install --lts',
            'git clone https://github.com/nathan-moore-97/nellys',
            'cd nellys/client/',
            `echo VITE_GMAPS_API_KEY=${process.env.VITE_GMAPS_API_KEY} >> .env`,
            `echo VITE_GMAPS_PLACE_ID=${process.env.VITE_GMAPS_PLACE_ID} >> .env`,
            `echo VITE_API_URL=http://${backendInstance.instancePublicIp} >> .env`,
            'npm install && npm run build',
            'sudo mkdir -p /var/www/nellys-app',
            'sudo cp -r dist/* /var/www/nellys-app/',
            'cd ../infra',
            'sudo cp nginx/nginx.conf /etc/nginx/',
            'sudo systemctl start nginx'
        );

        dotenv.config({
            path: '../api/.env',
        });

        backendInstance.addUserData(
            'sudo yum install -y git nginx',
            'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash',
            'export NVM_DIR="$HOME/.nvm"',
            '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"',
            'nvm install --lts',
            'git clone https://github.com/nathan-moore-97/nellys',
            'cd nellys/api && npm install',
            `echo EMAIL_SERVICE=${process.env.EMAIL_SERVICE} >> .env`,
            `echo EMAIL_HOST=${process.env.EMAIL_HOST} >> .env`,
            `echo EMAIL_USERNAME=${process.env.EMAIL_USERNAME} >> .env`,
            `echo EMAIL_APP_PASSWORD=${process.env.EMAIL_APP_PASSWORD} >> .env`,
            `echo NEWSLETTER_ADMIN_EMAIL=${process.env.NEWSLETTER_ADMIN_EMAIL} >> .env`,
            `echo GALLERY_BUCKET_NAME=${process.env.GALLERY_BUCKET_NAME} >> .env`, 
            `echo JWT_SECRET=${process.env.JWT_SECRET} >> .env`,
            `echo JWT_REFRESH_SECRET=${process.env.JWT_REFRESH_SECRET} >> .env`,
            `echo JWT_REGISTRATION_SECRET=${process.env.JWT_REGISTRATION_SECRET} >> .env`,
            `echo WEB_APP_ROOT_URL=http://nellysdev.org >> .env`,
            `echo ENVIORNMENT=dev >> .env`,
            'npm run start &',
            'sudo cp /nellys/infra/nginx/api.conf /etc/nginx/nginx.conf',
            'sudo nginx -t', 
            'sudo systemctl enable nginx', 
            'sudo systemctl start nginx'
        );

        new cdk.CfnOutput(this, "Frontend", {
            value: `http://${frontendInstance.instancePublicDnsName} (${frontendInstance.instancePublicIp})`,
        });

        new cdk.CfnOutput(this, "Backend", {
            value: `http://${backendInstance.instancePublicDnsName} (${backendInstance.instancePublicIp})`,
        });

        new cdk.CfnOutput(this, "Bucket", {
            value: galleryBucket.bucketName,
        });
    }
}
