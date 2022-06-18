# CloudFormation을 이용하여 Step Function으로 Callback 구현

## CloudFormation

[Module 4 - Wait for a Callback with the Task Token](https://github.com/kyopark2014/aws-step-functions/blob/main/cloudformation/module_4.yml)에서는 Lambda, SQS, SNS, Step Function을 생성합니다. 


## Step Function

WaitForCallbackStateMachine는 Amazon States Language (ASL)로 아래와 같이 선언됩니다. 

```java
{
  "Comment": "An example of the Amazon States Language for starting a task and waiting for a callback.",
  "StartAt": "Start Task And Wait For Callback",
  "States": {
    "Start Task And Wait For Callback": {
      "Type": "Task",
      "Resource": "arn:${AWS::Partition}:states:::sqs:sendMessage.waitForTaskToken",
      "Parameters": {
        "QueueUrl": "${sqsQueueUrl}",
        "MessageBody": {
          "MessageTitle": "Task started by Step Functions. Waiting for callback with task token.",
          "TaskToken.$": "$$.Task.Token"
        }
      },
      "Next": "Notify Success",
      "Catch": [
      {
        "ErrorEquals": [ "States.ALL" ],
        "Next": "Notify Failure"
      }
      ]
    },
    "Notify Success": {
      "Type": "Task",
      "Resource": "arn:${AWS::Partition}:states:::sns:publish",
      "Parameters": {
        "Message": "Callback received. Task started by Step Functions succeeded.",
        "TopicArn": "${SimpleLambdaFunctionArn}"
      },
      "End": true
    },
    "Notify Failure": {
      "Type": "Task",
      "Resource": "arn:${AWS::Partition}:states:::sns:publish",
      "Parameters": {
        "Message": "Task started by Step Functions failed.",
        "TopicArn": "${SimpleLambdaFunctionArn}"
      },
      "End": true
    }
  }
}
```


## Lambda 

SQS는 Lambda를 Trigger 합니다. 

![image](https://user-images.githubusercontent.com/52392004/174436686-688f8aaa-0717-452d-8fae-762e1dbad5b9.png)


```java
console.log('Loading function');

var AWS = require('aws-sdk');
var stepfunctions = new AWS.StepFunctions({apiVersion: '2016-11-23'});

exports.lambda_handler = async(event, context, callback) => {

    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        const taskToken = messageBody.TaskToken;

        const params = {
            output: "\"Callback task completed successfully.\"",
            taskToken: taskToken
        };

        /**
        * uncomment the lines below and redeploy the Lambda function
        */
        // console.log(`Calling Step Functions to complete callback task with params ${JSON.stringify(params)}`);
        // let response = await stepfunctions.sendTaskSuccess(params).promise();
    }
};
```


