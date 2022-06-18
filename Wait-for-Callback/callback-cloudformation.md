# CloudFormation을 이용하여 Step Function으로 Callback 구현

## CloudFormation

[Module 4 - Wait for a Callback with the Task Token](https://github.com/kyopark2014/aws-step-functions/blob/main/cloudformation/module_4.yml)에서는 Lambda, SQS, SNS, Step Function을 생성합니다. 

## 생성된 SQS 

아래와 같이 Step Function Callback을 위해 SQS와 SQS (DLQ)가 생성됩니다. SQS는 메시지를 받으면, Lambda를 Trigger 하도록 되어 있습니다. 

![image](https://user-images.githubusercontent.com/52392004/174437479-ac721dc9-e13d-4004-bf68-277e8a37f4eb.png)


## Step Function

WaitForCallbackStateMachine를 그래프로 표현하면 아래와 같습니다. 

![image](https://user-images.githubusercontent.com/52392004/174436885-8d71ae5d-f506-4ded-8e85-57fbea6b8b49.png)

여기서 WaitForCallbackStateMachine은 아래와 같은 Amazon States Language (ASL)로 표현됩니다. 

[Start]하면 SQS Task인 [Start Task And Wait For Callback]에서 시작합니다. 이것은 메시지와 Token을 받을때까지 대기하다가 메시지를 받으면 "Notify Success" State로 이동합니다. 

이때, SNS로 "Callback received"라는 메시지를 전송됩니다. 

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


## Result

Lambda의 로그는 아래와 같습니다.

![image](https://user-images.githubusercontent.com/52392004/174438005-430c958b-c96d-4230-9ce5-1203876a36ec.png)
