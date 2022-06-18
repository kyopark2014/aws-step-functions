# CDK - Step Functions

## Pass state

[PASS STATE](https://github.com/kyopark2014/aws-step-functions/blob/main/cdk-stepfunctions/pass-state.md)에서는 "MyStateMachine"라는 step function을 생성하고, 실행시 "hello world"처럼 문자열을 리턴합니다. 


## API Gateway REST API with Synchronous Express State Machine

[API Gateway REST API with Synchronous Express State Machine backend integration](https://catalog.workshops.aws/stepfunctions/en-US/module-9/step-4#use-aws-cdk-to-create-an-api-gateway-rest-api-with-synchronous-express-state-machine-backend-integration)에 따라 CDK로 Step Function을 생성합니다.

1) git repository를 다운로드 합니다.


```c
$ git clone https://github.com/kyopark2014/aws-step-functions
```

이대 [cdk-stepfunctions-stack.ts](https://github.com/kyopark2014/aws-step-functions/blob/main/cdk-stepfunctions/lib/cdk-stepfunctions-stack.ts)의 내용은 아래와 같습니다. 

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CdkStepfunctionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const startState = new stepfunctions.Pass(this, 'PassState', {
      result: { value: 'Hello back to you!' },
    })
    
    const stateMachine = new stepfunctions.StateMachine(this, 'MyStateMachine', {
      definition: startState,
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    });

    const api = new apigateway.StepFunctionsRestApi(this, 'StepFunctionsRestApi', { 
      stateMachine: stateMachine 
    });
  }
}
```

MyStateMachine 이름으로 Step Function을 생성하고, API Gateway에서 Step Function을 직접 호출하도록 되어 있습니다. 


2) CDK로 인프라를 생성합니다. 

```c
$ cd cdk-stepfunctions
$ cdk deploy 
```

이후 아래와 같이 api gateway가 생성된것을 확인 할 수 있습니다. 


![image](https://user-images.githubusercontent.com/52392004/174426911-eaa7728c-3644-4418-b797-bbcfaf3e11dc.png)


