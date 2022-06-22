# CloudFormation을 이용하여 Step Function으로 Callback 구현


## Wait-for-Callback 기본 동작

Step Function이 실행되면, SQS로 Task.Token를 포함한 메시지를 전송합니다. SQS는 아래와 같이 Lambda를 trigger하는데, 이때 Lambda는 사람의 승인(Human approval)과 같은 동작을 수행하고, 그 결과를 Task.Token을 이용하여 SendTaskSuccess 또는 SendTaskFailure로 다시 step function에 결과를 리턴하게 됩니다. 

![image](https://user-images.githubusercontent.com/52392004/174915383-b01e4a85-e1ba-4e2e-a41f-6fa1e8327276.png)


## CloudFormation

[CloudFormation으로 Step Functions 만들기](https://github.com/kyopark2014/aws-step-functions/blob/main/cloudformation/README.md)을 참조하여 [Module_4.yml](https://github.com/kyopark2014/aws-step-functions/blob/main/cloudformation/module_4.yml)로 아래와 같이 Lambda, SQS, SNS, Step Function을 생성합니다. 

## SQS 

아래와 같이 Step Function Callback을 위해 SQS와 SQS (DLQ)가 생성됩니다. SQS는 메시지를 받으면, Lambda를 Trigger 하도록 되어 있습니다. 

![image](https://user-images.githubusercontent.com/52392004/174437479-ac721dc9-e13d-4004-bf68-277e8a37f4eb.png)


## Step Function

WaitForCallbackStateMachine를 그래프로 표현하면 아래와 같습니다. 

![image](https://user-images.githubusercontent.com/52392004/174436885-8d71ae5d-f506-4ded-8e85-57fbea6b8b49.png)

여기서 WaitForCallbackStateMachine은 아래와 같은 [Amazon States Language (ASL)](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html)로 표현됩니다. 

[Start]하면 SQS Task인 "Start Task And Wait For Callback"에서 시작합니다. 이때 Lambda로부터 SendTaskSuccess를 받으면 "Notify Success" State로 이동하고, SNS로 "Callback received.."라는 메시지를 전송합니다. 

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

"Start Task And Wait For Callback"에서는 아래와 같이 Task.Token을 포함한 메시지를 SQS로 push합니다. 

```java
{
  "MessageTitle": "Task started by Step Functions. Waiting for callback with task token.",
  "TaskToken.$": "$$.Task.Token"
}
```

## Lambda 

CloudFormation에 의해 생성된 Lambda는 SQS에 메시지가 수신이 되면 trigger 되도록 설정되어 있습니다.

![image](https://user-images.githubusercontent.com/52392004/174436686-688f8aaa-0717-452d-8fae-762e1dbad5b9.png)

좀 더 자세히 로그를 볼수 있도록 CloudFormation 소스인 [Module_4.yml](https://github.com/kyopark2014/aws-step-functions/blob/main/cloudformation/module_4.yml)에서 Lambda code를 아래와 같이 좀더 많은 로그를 볼 수 있도록 수정하였습니다. 

event를 받으면 Record에서 token을 꺼내서 message와 함게 parameter로 성공리포트를 sendTaskSucces를 이용해 Step Functions에 전달합니다. 

```java
console.log('Loading function');

var AWS = require('aws-sdk');
var stepfunctions = new AWS.StepFunctions({apiVersion: '2016-11-23'});

exports.lambda_handler = async(event, context, callback) => {
    console.log("event: %j", event)

    for (let i=0;i<event.Records.length;i++) {
        let record = event.Records[i];
        
        const messageBody = JSON.parse(record.body);
        const taskToken = messageBody.TaskToken;

        const params = {
            output: "\"Callback task completed successfully.\"",
            taskToken: taskToken
        };

        console.log(`Calling Step Functions to complete callback task with params ${JSON.stringify(params)}`);
        try {
            let response = await stepfunctions.sendTaskSuccess(params).promise();
            console.log("response: %j", response);
        } catch(err) {
            console.log('err:'+err);
        }
    }
};

```


## Result

Lambda의 로그는 아래와 같습니다.

![noname](https://user-images.githubusercontent.com/52392004/174439870-9f9d10d5-797f-4a57-87e5-cc5f6d0ad1be.png)




Lambda에 수신된 메시지 body는 아래와 같이 "MessageTitle"과 TaskToken입니다.

"MessageTitle":"Task started by Step Functions. Waiting for callback with task token."

"TaskToken":"AAAAKgAAAAIAAAAAAAAAAYOmu3CinXAhxdjd6WrE3AdAPQnh2//jmggk+KVSS0VklluVkdEV3x8TCipcGchQQiVSZ9At/Ll7B16sifCnP8lUzDjOH944YViLs2q9qt1s1GxiuNAaJdGbbEyNaa3zGTK7niomWunE0xN9v/2eiaJdEaa4D4PawKSe0Dh13YUGn0+bF0S8qVcKAJTvFs1tky3CsxZm93yAIpvM+AmSviy67OanhJJGnj5/+yDKEy0TF/onYQKJGBmukHEBfn2/rLqGisX4Zdd1MQ9qvdEB1KEPhw9eyxvRq+vlat3cuLDsJVLYHKAdUN73rJokcpNTqpH/slW3QGEyzMYS0Khs5hBKlEqD4uTrMKxj+NK7PizNqx67+v80yC2VtXEnVAp5SYi7WaWKgBi6vIRrfmbXN+2yLQIKsWppRTkAC2Don6ovv/4KytH1h3Mn+VYPm6bOsyEOx/Zm6n+P6Yk0Jzxzhca+Npx5vTZn9RrrCcRq20mxkfqwkTFCaWcrNbgJAuU52VikUQmQVLinz1CYx3n/IZuLnVt7TycR1XwQqFPICs8GuF7mHYNHyFgItLEg63h+XEi2tCSNQXEi8sx3fX+NzL7H/TuCBtfx5jhf9N+4Wq44xZe8Nl1aeMNCH/OzTqAydZbk9OJwhIMO4Bqh0ct+jxKRDtZ5q+jFS+ptYwDYTy65"
