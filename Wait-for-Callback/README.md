# Wait for Callback

여기서는 [Workshop Module 4 - Wait for a Callback with the Task Token](https://catalog.workshops.aws/stepfunctions/en-US/module-4)를 참조하여 Wait for Callbackdmf 구현하는 방법에 대해 소개합니다.

어떤 task는 사람의 승인(human approval)이 필요할 수 있고, 또는 lagacy system에서 호출될때 실행되어지도록 하려면, 응답을 바로 받지 못하고 기다려야 할 수 있습니다. 이와 같이 task는 "SendTaskSuccess" 또는 "SendTaskFailure"로 token을 받을때까지 기다립니다. 상세한것은 [Optimized integrations for Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)을 참조하십시요. 

- [Wait for a job to complete (.sync).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-sync)

- [Wait for a task token (.waitForTaskToken).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)

## Workflow

[CloudFormation을 이용하여 Step Function으로 Callback 구현](https://github.com/kyopark2014/aws-step-functions/blob/main/Wait-for-Callback/callback-cloudformation.md)에서 상세 동작에 대해 설명하고 있습니다. 이때 생성된 Workflow는 아래와 같습니다.

![image](https://user-images.githubusercontent.com/52392004/174722275-16a404e4-4f0d-4a1e-b750-e8489dec90f0.png)


1) 아래와 같이 "WaitforCallbackStateMachine"에서 State machine이 "Wait for Callback"으로 SQS에 메시지를 전송합니다. 

2) 이때 SQS는 메시지와 Token을 Lambda 함수에 전달합니다. 

![image](https://user-images.githubusercontent.com/52392004/174439241-118d6aef-f5f1-4995-bbb4-276e2ff4587e.png)





## Task Token Example

[Task Token Example](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)와 같이 Credit check한 결과가 SQS에 도착할때까지 기다리다가, 도착하면, token을 step function으로 전달합니다. 

![image](https://user-images.githubusercontent.com/52392004/174439709-2508369f-264c-4989-bd2d-26cee7e5f96b.png)
