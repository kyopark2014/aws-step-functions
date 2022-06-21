# Wait for Callback

어떤 task는 사람의 승인(human approval)이 필요 할 수 있고, 또는 lagacy system에서 호출될 때 실행되어지도록 하려면, 요청이 올때까지 기다려야 할 수 있습니다. [Wait for a Callback with the Task Token](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)와 같이 Token이 도착할때까지 workflow를 기다리게 할 수 있습니다. 여기서는 [Workshop Module 4 - Wait for a Callback with the Task Token](https://catalog.workshops.aws/stepfunctions/en-US/module-4)를 참조하여 Wait for Callbackdmf 구현하는 방법에 대해 소개합니다. 상세한것은 [Optimized integrations for Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)을 참조하십시요. 

- [Wait for a job to complete (.sync).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-sync)

- [Wait for a task token (.waitForTaskToken).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)

## Workflow

[CloudFormation을 이용하여 Step Function으로 Callback 구현](https://github.com/kyopark2014/aws-step-functions/blob/main/Wait-for-Callback/callback-cloudformation.md)에서 상세 동작에 대해 설명하고 있습니다. 이때 생성된 Workflow는 아래와 같습니다.

![image](https://user-images.githubusercontent.com/52392004/174722275-16a404e4-4f0d-4a1e-b750-e8489dec90f0.png)

"Start Task And Wait For Callback"의 경우에 SQS로서 Message를 받을때까지 기다리다가, 메시지를 받아서 token이 있으면, "Notify Success"를 호출합니다. 실패하면 "Notify Failure"을 호출합니다.

```java
    "Start Task And Wait For Callback": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
      "Parameters": {
        "QueueUrl": "https://sqs.ap-northeast-2.amazonaws.com/123456789012/module4-SQSQueue-THCygijktbGh",
        "MessageBody": {
          "MessageTitle": "Task started by Step Functions. Waiting for callback with task token.",
          "TaskToken.$": "$$.Task.Token"
        }
      },
      "Next": "Notify Success",
      "Catch": [
        {
          "ErrorEquals": [
            "States.ALL"
          ],
          "Next": "Notify Failure"
        }
      ]
    },
```

"Notify Success"와 "Notify Failure"은 실패/성공 메시지를 SNS로 전송합니다. 




## Task Token Example

[Task Token Example](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)와 같이 Credit check한 결과가 SQS에 도착할때까지 기다리다가, 도착하면, token을 step function으로 전달합니다. 

![image](https://user-images.githubusercontent.com/52392004/174439709-2508369f-264c-4989-bd2d-26cee7e5f96b.png)
