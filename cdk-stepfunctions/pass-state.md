## PASS STATE

[Review the Step Functions state machine definition](https://catalog.workshops.aws/stepfunctions/en-US/module-9/step-4#use-aws-cdk-to-create-an-api-gateway-rest-api-with-synchronous-express-state-machine-backend-integration)에 따라 CDK로 "hello world" step function을 생성하고자 합니다. 

### 코드 준비 

"cdk-stepfunctions-stack.ts" 파일을 아래와 같이 준비하고 "cdk deploy"를 진행합니다. 

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';

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
  }
}
```

### 실행 결과 

아래와 같이 "MyStateMachine" 이름을 가지는 Step Function이 생성되었습니다. 

![noname](https://user-images.githubusercontent.com/52392004/174426329-f448940c-e065-4019-8d4b-db1da292507f.png)


이때, 생성된 Step Function의 내용은 아래와 같습니다. 

![image](https://user-images.githubusercontent.com/52392004/174426363-6a5ccf4b-2978-442c-b778-4a0855b0a0b6.png)


