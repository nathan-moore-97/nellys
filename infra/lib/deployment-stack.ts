import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class DeploymentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC
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
        const apiSG = new ec2.SecurityGroup(this, "ApiSecurityGroup", {
            vpc,
            description: "Security Group For API Instances",
            allowAllOutbound: true,
        });


        const reactSG = new ec2.SecurityGroup(this, "ClientSecurityGroup", {
            vpc,
            description: "Security group for frontend react app",
            allowAllOutbound: true,
        });

        apiSG.connections.allowFrom(reactSG, ec2.Port.tcp(3000));

        reactSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTP);
        reactSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTPS);

        reactSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "Allow SSH access");
        apiSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "Allow SSH access");

        // VM for Frontend
        const reactInstance = new ec2.Instance(this, "ReactInstance", {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
            securityGroup: reactSG,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
        });

        // API
        const apiInstance = new ec2.Instance(this, "APIInstance", {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
            securityGroup: apiSG,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            blockDevices: [{
                deviceName: "/dev/xvdb",
                volume: ec2.BlockDeviceVolume.ebs(8, {
                    encrypted: false,
                    deleteOnTermination: false,
                })
            }]
        });

        reactInstance.addUserData(
            'sudo yum install -y git nginx',
            'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash',
            'source ~/.bashrc',
            'nvm install --lts',
            'git clone https://github.com/nathan-moore-97/nellys',
            'cd nellys/client/ && npm install && npm run build',
            'sudo mkdir -p /var/www/nellys-app',
            'sudo cp -r dist/* /var/www/nellys-app/',
            'cd ../infra',
            // 'sudo cp nginx/nginx.conf /etc/nginx/',
            'sudo systemctl start nginx'
        );

        apiInstance.addUserData(
            // 'sudo yum install -y git',
            // 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash',
            // 'source ~/.bashrc',
            // 'nvm install --lts',
            // 'git clone https://github.com/nathan-moore-97/nellys',
            // 'cd your-repo/backend && npm install',
            // 'sudo mkdir -p /data/sqlite',
            // 'sudo mkfs -t ext4 /dev/nvme1n1', // Modern NVMe naming
            // 'sudo mount /dev/nvme1n1 /data/sqlite',
            // 'echo "/dev/nvme1n1 /data/sqlite ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab',
            // 'echo "DB_PATH=/data/sqlite/db.sqlite" >> .env',
            // 'npm install -g pm2',
            // 'pm2 start npm --name "api" -- start',
            // 'pm2 save'
        );

        new cdk.CfnOutput(this, "ReactAppUrl", {
            value: `http://${reactInstance.instancePublicIp}`,
        });

        new cdk.CfnOutput(this, "ApiUrl", {
            value: `http://${apiInstance.instancePublicIp}`
        });


    }
}
