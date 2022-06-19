# CDK를 이용하여 Lambda를 포함한 Step Function 생성

여기에서는 [AWS TypeScript CDK and Step Functions](https://aws.plainenglish.io/aws-typescript-cdk-and-step-functions-bbc173333aed)를 활용하여 cdk로 step functions을 구현한 예제를 설명합니다. 

전체적인 Architecture는 아래와 같습니다. 사용자는 API Gateway를 이용해 RESTful API로 Step Functions에 요청을하게 됩니다. Step Functions에는 3개의 Lambda를 가지고 처리후 응답을 전달합니다. 

<img width="863" alt="image" src="https://user-images.githubusercontent.com/52392004/174484145-a49d2c9b-3fd4-45c0-b89d-6c6acee5b168.png">


## 설치 방법

아래와 같이 git repository를 다운로드 하여 [AWS CDK](https://github.com/kyopark2014/technical-summary/blob/main/cdk-introduction.md)로 인프라를 생성합니다. 

```c
$ git clone https://github.com/kyopark2014/aws-step-functions
$ cd cdk-statemachine
$ cdk deploy
```

## Step Functions

CDK로 생성된 Step Functions의 구성은 아래와 같습니다. 

```java
{
  "StartAt": "Generate random number invocation",
  "States": {
    "Generate random number invocation": {
      "Next": "Wait 1 Second",
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 6,
          "BackoffRate": 2
        }
      ],
      "Type": "Task",
      "OutputPath": "$.Payload",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:ap-northeast-2:123456789012:function:CdkStatemachineStack-GenerateRandomNumber0A92E047-oo2BzOCQECVy",
        "Payload.$": "$"
      }
    },
    "Wait 1 Second": {
      "Type": "Wait",
      "Seconds": 1,
      "Next": "Job Complete?"
    },
    "Job Complete?": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.generatedRandomNumber",
          "NumericGreaterThanPath": "$.numberToCheck",
          "Next": "Get Number is greater than invocation"
        },
        {
          "Variable": "$.generatedRandomNumber",
          "NumericLessThanEqualsPath": "$.numberToCheck",
          "Next": "Get Number is less than or equal invocation"
        }
      ],
      "Default": "Get Number is less than or equal invocation"
    },
    "Get Number is less than or equal invocation": {
      "End": true,
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 6,
          "BackoffRate": 2
        }
      ],
      "Type": "Task",
      "InputPath": "$",
      "OutputPath": "$",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:ap-northeast-2:123456789012:function:CdkStatemachineStack-NumberLessThan313431AA-VBEhV5kIcDiH",
        "Payload.$": "$"
      }
    },
    "Get Number is greater than invocation": {
      "End": true,
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException"
          ],
          "IntervalSeconds": 2,
          "MaxAttempts": 6,
          "BackoffRate": 2
        }
      ],
      "Type": "Task",
      "InputPath": "$",
      "OutputPath": "$",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:ap-northeast-2:123456789012:function:CdkStatemachineStack-NumberGreaterThan013346E9-699JcMtb9PW2",
        "Payload.$": "$"
      }
    }
  },
  "TimeoutSeconds": 300
}
```

이때의 step function graph는 아래와 같습니다.

![image](https://user-images.githubusercontent.com/52392004/174481191-1d46baaa-7fa5-4e0f-91a1-857fbe9885bc.png)


## 실행결과

### Step Functions에서 실행 

CDK로 설치후 아래와 같은 State machine이 생성됩니다.

![image](https://user-images.githubusercontent.com/52392004/174482322-ac19214a-537a-4802-90ac-066eaec7c8f0.png)

[randomNumberStateMachine]에서 [Start Execution]을 합니다. 이후 Input에 아래 값을 붙여넣기 하고 [Start execution]을 선택합니다. 

```java
{
  "maxNumber": 10,
  "numberToCheck": 7
}
```

입력후 화면은 아래와 같습니다. 

![noname](https://user-images.githubusercontent.com/52392004/174482548-3d6f9402-0259-47a0-872d-85d82db0966a.png)

실행하면 아래처럼 실행됩니다. 

![image](https://user-images.githubusercontent.com/52392004/174482257-d8e6928e-ecb9-4e6f-9a45-6f88359fe126.png)

이때, Lambda에 전달된 값은 아래와 같습니다 .

```java
{
  "resourceType": "lambda",
  "resource": "invoke",
  "region": "ap-northeast-2",
  "parameters": {
    "FunctionName": "arn:aws:lambda:ap-northeast-2:123456789012:function:CdkStatemachineStack-NumberLessThan313431AA-VBEhV5kIcDiH",
    "Payload": {
      "generatedRandomNumber": 2,
      "maxNumber": 10,
      "numberToCheck": 7
    }
  },
  "timeoutInSeconds": null,
  "heartbeatInSeconds": null
}
```

### Curl로 시험하기

API Gateway를 이용하여 Step Functions을 호출하였으므로 아래와 같이 Curl로 결과를 확인 할 수 있습니다. 

```c
$ curl -X POST https://samplerfgg.execute-api.ap-northeast-2.amazonaws.com/prod/ \
 -d '{"maxNumber":10, "numberToCheck":7}' \
 -H 'Content-Type: application/json'
{
   "ExecutedVersion":"$LATEST",
   "Payload":{
      "msg":"lessOrEqual"
   },
   "SdkHttpMetadata":{
      "AllHttpHeaders":{
         "X-Amz-Executed-Version":[
            "$LATEST"
         ],
         "x-amzn-Remapped-Content-Length":[
            "0"
         ],
         "Connection":[
            "keep-alive"
         ],
         "x-amzn-RequestId":[
            "972b2b5a-1279-4de3-a74e-2a9592fada17"
         ],
         "Content-Length":[
            "21"
         ],
         "Date":[
            "Sun, 19 Jun 2022 13:34:06 GMT"
         ],
         "X-Amzn-Trace-Id":[
            "root=1-62af25cc-1676e78d532c29865c4f438c;parent=5b3200a776ec860a;sampled=1"
         ],
         "Content-Type":[
            "application/json"
         ]
      },
      "HttpHeaders":{
         "Connection":"keep-alive",
         "Content-Length":"21",
         "Content-Type":"application/json",
         "Date":"Sun, 19 Jun 2022 13:34:06 GMT",
         "X-Amz-Executed-Version":"$LATEST",
         "x-amzn-Remapped-Content-Length":"0",
         "x-amzn-RequestId":"972b2b5a-1279-4de3-a74e-2a9592fada17",
         "X-Amzn-Trace-Id":"root=1-62af25cc-1676e78d532c29865c4f438c;parent=5b3200a776ec860a;sampled=1"
      },
      "HttpStatusCode":200
   },
   "SdkResponseMetadata":{
      "RequestId":"972b2b5a-1279-4de3-a74e-2a9592fada17"
   },
   "StatusCode":200
}
```

## Reference

[AWS TypeScript CDK and Step Functions](https://aws.plainenglish.io/aws-typescript-cdk-and-step-functions-bbc173333aed)
