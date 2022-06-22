# Wait for Callback

어떤 task는 사람의 승인(human approval)이나 lagacy system에서 응답이 올때까지 기다려야 할 수 있습니다. [Wait for a Callback with the Task Token](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token) 패턴을 이용하면, 실행중인 workflow를 기다리게 할 수 있습니다. 여기서는 [Workshop Module 4 - Wait for a Callback with the Task Token](https://catalog.workshops.aws/stepfunctions/en-US/module-4)를 참조하여 Wait for Callback을 구현하는 방법에 대해 소개합니다. 상세한것은 [Optimized integrations for Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)을 참조하십시요. 

## "Wait for callback"을 enable하는 방법

아래에서는 SQS에서 "Wait for callback"을 enable 하고 있습니다. 마찬가지로 SNS, Lambda, S3, DynamoDB등에서 "Wait for callback"을 enable 하고, Task.Token으로 workflow를 관리 할 수 있습니다. 

1) Workflow studio에서 아래와 같이 option을 enable 할 수 있습니다. 

![noname](https://user-images.githubusercontent.com/52392004/174919275-ff212383-7dfc-4c3a-948b-ee0ec74eeaa6.png)


2) SQS resource 정의시에 ".waitForTaskToken"을 추가하는 방법으로 enable 할 수 있습니다.

- [Wait for a task token (.waitForTaskToken).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)

- [Wait for a job to complete (.sync).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-sync)


## Step function 실행시 Context Object의 Task.Token

[Context Object](https://docs.aws.amazon.com/step-functions/latest/dg/input-output-contextobject.html)는 아래와 같은 형태로 구성됩니다. 

```java
{
    "Execution": {
        "Id": "arn:aws:states:us-east-1:123456789012:execution:stateMachineName:executionName",
        "Input": {
           "key": "value"
        },
        "Name": "executionName",
        "RoleArn": "arn:aws:iam::123456789012:role...",
        "StartTime": "2019-03-26T20:14:13.192Z"
    },
    "State": {
        "EnteredTime": "2019-03-26T20:14:13.192Z",
        "Name": "Test",
        "RetryCount": 3
    },
    "StateMachine": {
        "Id": "arn:aws:states:us-east-1:123456789012:stateMachine:stateMachineName",
        "Name": "name"
    },
    "Task": {
        "Token": "h7XRiCdLtd/83p1E0dMccoxlzFhglsdkzpK9mBVKZsp7d9yrT1W"
    }
}
```

## Task 실행 결과의 리턴

external process(사람의 승인 등)가 끝났을때 결과를 리턴하거나 멈춰졌던 workflow를 재실행 하기 위하여, [SendTaskSuccess](https://docs.aws.amazon.com/step-functions/latest/apireference/API_SendTaskSuccess.html)와 [SendTaskFailure](https://docs.aws.amazon.com/step-functions/latest/apireference/API_SendTaskFailure.html)를 이용합니다.

### SendTaskSuccess 호출방법

[성공시 결과를 리턴](https://docs.aws.amazon.com/step-functions/latest/apireference/API_SendTaskSuccess.html)하는 방법은 아래와 같습니다. 

```java
var params = {
  output: 'STRING_VALUE', /* required */
  taskToken: 'STRING_VALUE' /* required */
};
stepfunctions.sendTaskSuccess(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
```

### sendTaskFailure 호출방법 

[실패시 결과를 리턴](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html#sendTaskFailure-property)하는 방법은 아래와 같습니다. 

```java
var params = {
  taskToken: 'STRING_VALUE', /* required */
  cause: 'STRING_VALUE',
  error: 'STRING_VALUE'
};
stepfunctions.sendTaskFailure(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
```

## Workflow

SQS에서 "Wait-for-Callback"을 enable 할 경우에 아래와 같은 workflow를 생성 할 수 있습니다. 

![image](https://user-images.githubusercontent.com/52392004/174722275-16a404e4-4f0d-4a1e-b750-e8489dec90f0.png)

"Start Task And Wait For Callback"에서 SQS로 Task.Token을 보내면, Lambda가 Trigger되어서 어떤 Job을 수행하고, Lambda가 Step Function으로 결과를 리턴하면, 결과에 따라서 "Notify Success" or "Notify failure"가 호출합니다. 여기서는 실패하면 "Notify Success"와 "Notify Failure"에서 SNS로 메시지를 전송하고 있습니다. 

상세한 [CloudFormation을 이용하여 Step Function으로 Callback 구현](https://github.com/kyopark2014/aws-step-functions/blob/main/Wait-for-Callback/callback-cloudformation.md)에서 상세 동작에 대해 설명하고 있습니다. 이때 생성된 Workflow는 아래와 같습니다.
      "Resource": "arn:aws:states:::sqs:sendMessage.waitForTaskToken",ㄴㅐ용
      "Resource": "arn:aws:states:::sqs:sendMessage.waitForTaskToken",




## Task Token Example

[Task Token Example](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)와 같이 Credit check한 결과가 SQS에 도착할때까지 기다리다가, 도착하면, token을 step function으로 전달합니다. 

![image](https://user-images.githubusercontent.com/52392004/174439709-2508369f-264c-4989-bd2d-26cee7e5f96b.png)
