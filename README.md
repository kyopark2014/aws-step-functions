# AWS Step Functions

여기에서는 Step Functions 사용 방법 및 CDK deployment에 대해 설명합니다. 

## Step Functions 란?

Business Logic을 구현하기 위하여, 어떤 서비스가 어떤 Request 시작하면, 필연적으로 재시도, 실패시 예외처리가 필요합니다. 또한 어떤 business logic은 여러 step을 거쳐서 동작하므로 이를 여러개의 모듈 또는 lambda로 구현하는것은 꽤 번거로운 작업입니다. 이러한 workflow를 모듈화하여 visual하게 처리하고, 관리가 필요없는 serverless로 제공한다면, 복잡하게 서비스를 생성하는 것보다 개발기간을 단축하고, 버그나 수정 필요시 빠르게 대응할 수 있습니다.

AWS Step Functions은 low-code visual workflow service입니다. 즉, 최소한의 코드로 workflow를 생성하여 상기의 복잡한 작업을 수행 할 수 있습니다. 또한, AWS의 각종 데이터베이스, ML 서비스들과 쉽게 integration이 가능하므로 빠르게 원하는 work를 수행할 수 있습니다.


## 활용 케이스 

### Build a data processing pipeline for streaming data

[How Freebird Scaled Data Processing with AWS Step Functions](https://aws.amazon.com/ko/blogs/startups/how-freebird-scaled-data-processing-with-aws-step-functions/)에서는 아래와 같이 여러개의 webhook api로 들어오는 request를 API Gateway와 Kinesis Data Streams로 받은 후에 workflow에서 validation check를 비롯한 각종 처리를 수행합니다. 

![image](https://user-images.githubusercontent.com/52392004/174412018-2d8f3273-131f-4b11-81a1-4bb44087b2e5.png)

### Automate steps of an ETL process

[복잡한 ETL 작업을 자동으로 처리](https://aws.amazon.com/ko/step-functions/use-cases/#Data_Processing_and_ETL_Orchestration)할 수 있습니다. 

![image](https://user-images.githubusercontent.com/52392004/174412512-7c9dcc92-8636-4932-b32b-5b27a400bb21.png)


## References

[aws-stepfunctions-examples](https://github.com/aws-samples/aws-stepfunctions-examples)

