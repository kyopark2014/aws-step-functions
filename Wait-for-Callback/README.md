# Wait for Callback

여기서는 [Module 4 - Wait for a Callback with the Task Token](https://catalog.workshops.aws/stepfunctions/en-US/module-4)에 대해 소개합니다.


## Initial Workflow

1) 아래와 같이 "WaitforCallbackStateMachine"에서 State machine이 "Wait for Callback"으로 SQS에 메시지를 전송합니다. 

2) 이때 SQS는 메시지와 Token을 Lambda 함수에 전달합니다. 

![image](https://user-images.githubusercontent.com/52392004/174436710-a5c3beee-a468-4f6c-beca-82f3268c841d.png)


![image](https://user-images.githubusercontent.com/52392004/174436885-8d71ae5d-f506-4ded-8e85-57fbea6b8b49.png)


