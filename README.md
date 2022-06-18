# AWS Step Functions

여기에서는 Step Functions 사용 방법 및 CDK deployment에 대해 설명합니다. 

## Step Functions 란?

Business Logic을 구현하기 위하여, 어떤 서비스가 어떤 Request 시작하면, 필연적으로 재시도, 실패시 예외처리가 필요합니다. 또한 어떤 business logic은 여러 step을 거쳐서 동작하므로 이를 여러개의 모듈 또는 lambda로 구현하는것은 꽤 번거로운 작업입니다. 이러한 workflow를 모듈화하여 visual하게 처리하고, 관리가 필요없는 serverless로 제공한다면, 복잡하게 서비스를 생성하는 것보다 개발기간을 단축하고, 버그나 수정 필요시 빠르게 대응할 수 있습니다.

AWS Step Functions은 low-code visual workflow service입니다. 즉, 최소한의 코드로 workflow를 생성하여 상기의 복잡한 작업을 수행 할 수 있습니다. 또한, AWS의 각종 데이터베이스, ML 서비스들과 쉽게 integration이 가능하므로 빠르게 원하는 work를 수행할 수 있습니다.


## 활용 케이스 

[Step Function Case Study](https://github.com/kyopark2014/aws-step-functions/blob/main/case-study.md)에서는 Step Fucntions 활용방안에 대해 설명합니다. 

## Workshop

[The AWS Step Functions Workshop](https://catalog.workshops.aws/stepfunctions/en-US/)을 이용해 Workshop을 해볼수 있습니다. 


## Others

#### Amazon States Language (ASL)

To-DO

#### States

- Task: Execute work
- Choice: Add branching logic
- Wait Add a timed delay
- Parallel:  Execute branches in parallel
- Map: Process each of an input array's items with a state machine
- Success: Signal a successful execution and stop
- Fail: Signal a failed execution and stop
- Pass: Pass input to output

#### Express Workflow

[Express Workflow](https://github.com/kyopark2014/aws-step-functions/blob/main/express.md)에서는 express로 workflow 구성하는것에 대해 설명합니다. 


## References

[aws-stepfunctions-examples](https://github.com/aws-samples/aws-stepfunctions-examples)

[AWS Step Functions을 통한 마이크로서비스 오케스트레이션 - 강세용:: AWS 현대적 애플리케이션 개발](https://www.youtube.com/watch?v=sRXvADi4hmw)
