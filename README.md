# CodeDeploy Cleaner

AWS CodeDeploy Cleaner with Serverless.

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

* Choose a lambda function deployed. As this project provides the lambda function for this, choose `x`.




