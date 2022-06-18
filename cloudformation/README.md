# CloudFormation으로 Step Functions 만들기

[Workshop Module1](https://catalog.workshops.aws/stepfunctions/en-US/module-1)을 참조하였습니다. 

1) [module_1.yml](https://github.com/kyopark2014/aws-step-functions/blob/main/cloudformation/module1.yml) 파일을 다운로드 합니다. 

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

![noname](https://user-images.githubusercontent.com/52392004/174423714-62bed9e4-5d31-43f8-bcc1-8de016670a6f.png)

