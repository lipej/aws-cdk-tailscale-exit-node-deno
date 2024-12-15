import * as cdk from "npm:aws-cdk-lib";
import {
  Instance,
  InstanceType,
  IpAddresses,
  MachineImage,
  SubnetType,
  UserData,
  Vpc,
} from "npm:aws-cdk-lib/aws-ec2";
import { Construct } from "npm:constructs";

export interface ExitNodeProps extends cdk.StackProps {
  tailscaleAuthKey: string;
  exitNodeName: string;
}

export class TailscaleExitnodesCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExitNodeProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "TheVPC", {
      ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "tailscale",
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    const publicSubnets = vpc.selectSubnets({
      subnetType: SubnetType.PUBLIC,
    });

    // Get the latest ubuntu 22.04 machine image
    const machineImage = MachineImage.fromSsmParameter(
      "/aws/service/canonical/ubuntu/server/jammy/stable/current/amd64/hvm/ebs-gp2/ami-id"
    );

    const userData = UserData.forLinux();
    userData.addCommands(
      "echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf",
      "echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf",
      "sysctl -p /etc/sysctl.conf",

      "curl -fsSL https://tailscale.com/install.sh | sh",
      `tailscale up --authkey ${props.tailscaleAuthKey} --advertise-exit-node --hostname=${props.exitNodeName}`
    );

    const instance = new Instance(this, "exitNode", {
      instanceType: new InstanceType("t2.micro"),
      vpc: vpc,
      instanceName: props.exitNodeName,
      vpcSubnets: publicSubnets,
      machineImage: machineImage,
      userData: userData,
    });

    console.log({ instance });
  }
}
