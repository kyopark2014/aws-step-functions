# Wait for Callback

여기서는 [Module 4 - Wait for a Callback with the Task Token](https://catalog.workshops.aws/stepfunctions/en-US/module-4)에 대해 소개합니다.

어떤 task는 사람의 승인(human approval)이나 lagacy system의 호출하여야 해서 바로 응답을 받지 못할 수 있습니다. 이와 같이 task는 "SendTaskSuccess" 또는 "SendTaskFailure"가 token을 받을때까지 기다립니다. 상세한것은 [Optimized integrations for Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/connect-supported-services.html)을 참조하십시요. 

- [Wait for a job to complete (.sync).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-sync)

- [Wait for a task token (.waitForTaskToken).](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token)

## Workflow

1) 아래와 같이 "WaitforCallbackStateMachine"에서 State machine이 "Wait for Callback"으로 SQS에 메시지를 전송합니다. 

2) 이때 SQS는 메시지와 Token을 Lambda 함수에 전달합니다. 

![image](https://user-images.githubusercontent.com/52392004/174439241-118d6aef-f5f1-4995-bbb4-276e2ff4587e.png)


## 실행결과 

[CloudFormation을 이용하여 Step Function으로 Callback 구현](https://github.com/kyopark2014/aws-step-functions/blob/main/Wait-for-Callback/callback-cloudformation.md)에서 상세 동작에 대해 설명합니다. 
