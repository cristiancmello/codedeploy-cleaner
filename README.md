# CodeDeploy Cleaner

AWS CodeDeploy Cleaner with Serverless. A solution to remove instances 
created by failed processes from **Blue/Green** schema.

## How it works?

<p align="center">
    <img style="width:80%" src="https://raw.githubusercontent.com/cristiancmello/assets/master/codedeploy-cleaner/codedeploy-cleaner-arch-diagram.png"/>
</p>

## First steps

### Set CodeDeploy Role to send messages to an AWS SNS topic

#### Policy JSON

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "autoscaling:*",
                "tag:GetTags",
                "tag:GetResources",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeInstanceHealth",
                "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
                "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:RegisterTargets",
                "elasticloadbalancing:DeregisterTargets",
                "ec2:Describe*",
                "sns:*"
            ],
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
```

#### Trust Relationship

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "sns.amazonaws.com",
          "codedeploy.us-east-1.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Installation (Deploy)

#### Set env file

```sh
cp env.example .env
```

##### AWS Credentials

* Allow all service operations:
  * **AWS EC2 AutoScaling**;
  * **AWS CodeDeploy**.

#### Install dependencies

```sh
yarn  # or npm install
```

#### Deployment

```sh
sls deploy
```

### Create a AWS SNS Topic

* Call `app-devops-topic` (example).

#### Create subscription

* Choose a lambda function deployed. As this project provides the lambda function for this, choose `codeDeployCleaner`.

### Create a trigger for the deployment group

* In **AWS CodeDeploy** > **Deployment groups**, select a group with Deployment Type as **Blue/Green**;
* In **Advanced**, access **Create Trigger**. Call `app-trigger`;
* In **Events**, select **Deployment Status (all)** and **Instance Status (all)**;
* In **Amazon SNS Topics**, select the created topic `app-devops-topic`;


