'use strict';

const dotenv = require('dotenv');
const AWS = require('aws-sdk');

AWS.config.update({ 
  accessKeyId: dotenv.config().parsed.AWS_ACCESS_KEY_ID, 
  secretAccessKey: dotenv.config().parsed.AWS_SECRET_ACCESS_KEY
});

const codeDeploy = new AWS.CodeDeploy();
const autoscaling = new AWS.AutoScaling();

module.exports.codeDeployCleaner = (event, context, callback) => {
  const result = dotenv.config();
 
  if (result.error) {
    throw result.error;
  }

  if (event.Records == null) {
    return;
  }

  const snsMessage = JSON.parse(event.Records[0].Sns.Message);
  
  if (snsMessage.applicationName == undefined || snsMessage.deploymentGroupName == undefined) {
    return;
  }

  let cleanerInfo = {
    applicationName: snsMessage.applicationName,
    region: snsMessage.region,
    deploymentId: snsMessage.deploymentId,
    deploymentGroupName: snsMessage.deploymentGroupName,
    status: snsMessage.status
  };

  let params = {
    applicationName: cleanerInfo.applicationName,
    deploymentGroupName: cleanerInfo.deploymentGroupName
  };

  codeDeploy.getDeploymentGroup(params, function(err, data) {
    if (err)
      console.log(err, err.stack);
    else {
      switch (data.deploymentGroupInfo.deploymentStyle.deploymentType) {
        case 'BLUE_GREEN':
          cleanerInfo.autoScalingGroupName = `CodeDeploy_${cleanerInfo.deploymentGroupName}_${cleanerInfo.deploymentId}`;
          break;
        default:
          throw 'Unsupported Deployment Type';
      }

      if (cleanerInfo.status == 'FAILED') {
        console.log(`AutoScalingGroup '${cleanerInfo.autoScalingGroupName}' may be destroyed!`);

        let params = {
          AutoScalingGroupName: cleanerInfo.autoScalingGroupName,
          ForceDelete: true
        };

        autoscaling.deleteAutoScalingGroup(params, function(err, data) {
          if (err)
            console.log(err, err.stack);
          else {
            console.log(`AutoScalingGroup '${cleanerInfo.autoScalingGroupName}' was destroyed successfully!`);
          }
        });
      }
    }
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Serverless - AWS CodeDeploy Cleaner'
    }),
  };

  callback(null, response);
};
