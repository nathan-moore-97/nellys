
import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';

import * as dotenv from 'dotenv';

dotenv.config({
    path: '../client/.env',
});

export class DeploymentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

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

        backendSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3000));
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

        // DNS
        const hostedZone = new route53.HostedZone(this, 'HostedZone', {
            zoneName: 'nellysdev.org',
            comment: 'nellysdev.org Hosted zone'
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
            `echo VITE_API_URL=http://${backendInstance.instancePublicIp}:3000 >> .env`,
            'npm install && npm run build',
            'sudo mkdir -p /var/www/nellys-app',
            'sudo cp -r dist/* /var/www/nellys-app/',
            'cd ../infra',
            'sudo cp nginx/nginx.conf /etc/nginx/',
            'sudo systemctl start nginx'
        );

        backendInstance.addUserData(
            // Install Git
            'sudo yum install -y git',
            
            // Install NVM and Node.js
            'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash',
            'export NVM_DIR="$HOME/.nvm"',
            '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"',
            'nvm install --lts',
            
            // Clone repo and install dependencies
            'git clone https://github.com/nathan-moore-97/nellys',
            'cd nellys/api && npm install',
            
            // Start API (consider using a process manager like PM2 instead of &)
            'npm run start &',
            
            // Install and configure Nginx
            'sudo yum install -y nginx',
            'sudo cp /nellys/infra/nginx/api.conf /etc/nginx/nginx.conf',
            'sudo nginx -t', // Test config before starting
            'sudo systemctl enable nginx', // Enable on boot
            'sudo systemctl start nginx'
        );

        new cdk.CfnOutput(this, "Frontend", {
            value: `http://${frontendInstance.instancePublicDnsName} (${frontendInstance.instancePublicIp})`,
        });

        new cdk.CfnOutput(this, "Backend", {
            value: `http://${backendInstance.instancePublicDnsName} (${backendInstance.instancePublicIp})`,
        });
    }
}
