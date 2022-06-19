# AWS Step Functions

여기에서는 Step Functions 사용 방법 및 CDK deployment에 대해 설명합니다. 

## Step Functions 란?

Business Logic을 구현하기 위하여, 어떤 서비스가 어떤 Request 시작하면, 필연적으로 재시도, 실패시 예외처리가 필요합니다. 또한 어떤 business logic은 여러 step을 거쳐서 동작하므로 이를 여러개의 모듈 또는 lambda로 구현하는것은 꽤 번거로운 작업입니다. 이러한 workflow를 모듈화하여 visual하게 처리하고, 관리가 필요없는 serverless로 제공한다면, 복잡하게 서비스를 생성하는 것보다 개발기간을 단축하고, 버그나 수정 필요시 빠르게 대응할 수 있습니다.

AWS Step Functions은 low-code visual workflow service입니다. 즉, 최소한의 코드로 workflow를 생성하여 상기의 복잡한 작업을 수행 할 수 있습니다. 또한, AWS의 각종 데이터베이스, ML 서비스들과 쉽게 integration이 가능하므로 빠르게 원하는 work를 수행할 수 있습니다.


## 활용 케이스 

[Step Function Case Study](https://github.com/kyopark2014/aws-step-functions/blob/main/case-study.md)에서는 Step Fucntions 활용방안에 대해 설명합니다. 


## 인프라 생성하기 

[CloudFormation으로 Step Functions 만들기](https://github.com/kyopark2014/aws-step-functions/tree/main/cloudformation)를 따라서 CloudFormation으로 인프라 생성이 가능합니다.

[CDK - Step Functions](https://github.com/kyopark2014/aws-step-functions/blob/main/cdk-stepfunctions/README.md)에서는 AWS CDK로 Step Function과 API Gateway를 생성하여 https API로 Step Function을 호출할 수 있음을 보여줍니다. 

## Step Functions으로 DynamoDB에 쓰기

[Step Functions - DynamoDB](https://github.com/kyopark2014/aws-step-functions/tree/main/transactionProcessor)는 Step Functions로 DynamoDB를 쓰는 예제입니다. 

## Summary


### States

- [Task](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html): Execute work. This represents an operation to execute, it's integrable directly with a Lambda Invoke, or you can specify parameters that call a specific AWS service

- [Choice](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-choice-state.html): Add branching logic. It is possible to configure a condition that permits the user to change execution flow based on the output of the previous state

- [Wait](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-wait-state.html): Add a timed delay. It's possible to suspend the machine execution for a specific time
  
- [Parallel](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-parallel-state.html):  Execute branches in parallel. This permits the execution of a state set that will be executed in parallel, using a single input value.

- [Map](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-map-state.html): Process each of an input array's items with a state machine. This permits the execution of a state set, using an array of input for each state.

- [Success](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-succeed-state.html): Signal a successful execution and stop. When a machine execution finishes with success

- [Fail](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-fail-state.html): Signal a failed execution and stop. When a machine execution finishes with some errors

- [Pass](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-pass-state.html): Pass input to output. This state passes its input to its output, without performing work. Pass states are useful when constructing and debugging state machines.

### Integration syntax

```c
arn:aws:states:::aws-sdk:serviceName:apiAction.[serviceIntegrationPattern]
```

예제는 아래와 같습니다. 

```c
arn:aws:sates:::aws-sdk:ec2:describeInstances
```

### Express Workflow

[Express Workflow](https://github.com/kyopark2014/aws-step-functions/blob/main/express.md)에서는 express로 workflow 구성하는것에 대해 설명합니다. 


### Synchronous

[Execute synchronous task](https://catalog.workshops.aws/stepfunctions/en-US/module-3/step-4)와 같이 Resouce arn에 ".sync"를 붙여서, synchronous task를 생성 할 수 있습니다.

![image](https://user-images.githubusercontent.com/52392004/174425179-1e6f12b5-207e-41f1-b74e-56c5e5322fdd.png)

### Workshop

[The AWS Step Functions Workshop](https://catalog.workshops.aws/stepfunctions/en-US/)을 이용해 Workshop을 해볼수 있습니다. 

### Amazon States Language (ASL)

[Step Function에서는 ASL](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html)을 이용하여 workflow를 생성합니다. 



## References

[aws-stepfunctions-examples](https://github.com/aws-samples/aws-stepfunctions-examples)

[AWS Step Functions을 통한 마이크로서비스 오케스트레이션 - 강세용:: AWS 현대적 애플리케이션 개발](https://www.youtube.com/watch?v=sRXvADi4hmw)

[Step Function with AWS CDK in action: our points of view about it using Typescript](https://www.proud2becloud.com/step-function-with-aws-cdk-in-action-our-points-of-view-about-it-using-typescript/)
