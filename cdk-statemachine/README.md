# Welcome to your CDK TypeScript project

여기에서는 [AWS TypeScript CDK and Step Functions](https://aws.plainenglish.io/aws-typescript-cdk-and-step-functions-bbc173333aed)를 활용하여 cdk로 step functions을 구현한 예제를 설명합니다.

## 설치 방법

아래와 같이 git repository를 다운로드 하여 cdk로 인프라를 생성합니다. 

```c
$ git clone https://github.com/kyopark2014/aws-step-functions
$ cd cdk-statemachine
$ cdk deploy
```

## Step Functions

CDK로 생성된 step function의 graph는 아래와 같습니다.

![image](https://user-images.githubusercontent.com/52392004/174481191-1d46baaa-7fa5-4e0f-91a1-857fbe9885bc.png)


상세한 구성은 아래와 같습니다. 

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



## Reference

[AWS TypeScript CDK and Step Functions](https://aws.plainenglish.io/aws-typescript-cdk-and-step-functions-bbc173333aed)
