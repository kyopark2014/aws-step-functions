# CloudFormation으로 Step Functions 만들기

## Step Functions 생성 

[Workshop Module1](https://catalog.workshops.aws/stepfunctions/en-US/module-1)을 참조하였습니다. 

1) [module_1.yml](https://github.com/kyopark2014/aws-step-functions/blob/main/cloudformation/module_1.yml) 파일을 다운로드 합니다. 

"module_1.yml"에서는 아래와 같이 "StatesExecutionRole"을 생성합니다. 

```java
  StatesExecutionRole:
    Type: 'AWS::IAM::Role'
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: 'Allow'
            Principal:
              Service: states.amazonaws.com
            Action: 'sts:AssumeRole'
      Path: '/'
```

아래와 같이 "TimerStateMachine"을 생성하는데 "Type"이 "Wait"이므로 "timer_seconds"동안 대기하는 "Wait for Timer"를 생성하게 됩니다.

```java
TimerStateMachine:
    Type: 'AWS::StepFunctions::StateMachine'
    Properties:
      DefinitionString: |-
        {
          "Comment": "An example of the Amazon States Language for scheduling a task.",
          "StartAt": "Wait for Timer",
          "States": {
            "Wait for Timer": {
              "Type": "Wait",
              "SecondsPath": "$.timer_seconds",
              "Next": "Success"
            },
            "Success": {
              "Type": "Succeed"
            }
          }
        }
      RoleArn: !GetAtt [StatesExecutionRole, Arn]
```


2) CloudFormation Console로 이동합니다. 

https://ap-northeast-2.console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/create/template

3) [Create stack]에서 [Template is ready] - [Upload a template file] - [Choose file]을 선택한 후에, 다운로드한 "module_1.yml"파일을 선택합니다. 이후 [Next[를 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/174423439-73577d0e-d07d-4d2a-a8a8-ffd8af0f64f8.png)

4) [Stack name]에 "stepFunction1"이라고 입력 후에 [Next]를 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/174423580-33510a68-c9c2-4d7e-8be2-7dd4674c5974.png)

5) [Configure stack options]은 기본값을 그대로 유지하고 [Next]를 선택합니다. 

6) [Review stepFunction1]에서 [Create stack]을 선택하여 생성을 시작합니다. 생성이 완료되면 아래와 같이 "CREATE_COMLETE"로 status가 변경됩니다. 

![noname](https://user-images.githubusercontent.com/52392004/174423681-a34eb137-51a5-4882-ba60-65f2f75eff7e.png)

7) [Step Functions의 Console](https://ap-northeast-2.console.aws.amazon.com/states/home?region=ap-northeast-2#/statemachines)로 이동하여 상태를 확인 합니다. 

![noname](https://user-images.githubusercontent.com/52392004/174423763-764674ea-637c-432b-9597-3c9c81e6c237.png)

8) [Edit]를 선택하면 아래와 같이 생성된 Step Function을 확인 할 수 있습니다. 

![noname](https://user-images.githubusercontent.com/52392004/174423807-e1daaa4f-586c-433d-b34e-07732b68bb57.png)


## 실행해 보기

1) [Step Functions Console](https://ap-northeast-2.console.aws.amazon.com/states/home?region=ap-northeast-2#/statemachines)에서 생성한 Step Function을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/174423980-60aa3af0-83e9-41e6-8351-8034cfd7b945.png)

2) [Start execution]을 선택한 후에 아래의 json을 복사해서 [input]에 붙여 넣기를 합니다. 이후 [Start execution]을 선택합니다. 

입력할 값은 아래와 같습니다.

```java
{ "timer_seconds": 5 }
```

입력후 화면은 아래와 같습니다. 

![noname](https://user-images.githubusercontent.com/52392004/174424084-b4c2e234-28bc-46fe-841e-56cbc47d9e28.png)

아래와 같이 5초후에 "Success"로 상태가 변경되었습니다. 

![noname](https://user-images.githubusercontent.com/52392004/174424242-96713460-ebb3-4869-b346-26d388d75985.png)

IAM의 Role에서 "StatesExecutionRole"을 검색하면 아래와 같은 Role이 생성되어 있음을 확인 할 수 있습니다.

![image](https://user-images.githubusercontent.com/52392004/174424360-cdd0fbf7-5321-4d55-a987-9043aa326a16.png)

