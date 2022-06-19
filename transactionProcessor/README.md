# Step Function - DynamoDB

여기에서는 [AWS Step Functions with DynamoDB Tutorial](https://www.youtube.com/watch?v=9aE9Yjna8J0)을 따라서 Step Function에서 DynamoDB를 access 하는 예제를 수행합니다.

1) DynamoDB 생성을 위해 DyanmoDB console로 이동합니다.

https://ap-northeast-2.console.aws.amazon.com/dynamodbv2/home?region=ap-northeast-2#tables

2) [Create table]을 선택하여 [Table nmae]으로 "TransactionHistoryTable"라고 입력하고, [Partition key]로 "TransactionId"라고 입력하고 [Create table]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/174461481-c1e5a98e-6a8b-488e-9495-a9a3976a5925.png)

3) Step Functions Console에서 [Create state machine]으로 이동합니다.

https://ap-northeast-2.console.aws.amazon.com/states/home?region=ap-northeast-2#/statemachines/create?mode=authornew

4) [Define state machine]에서 [Write your workflow in code]를 선택후 Definition에 [transaction.json](https://github.com/kyopark2014/aws-step-functions/blob/main/transactionProcessor/transaction.json)을 아래와 같이 붙여 넣기 하여 줍니다. 이후 [Next]를 선택합니다.

![image](https://user-images.githubusercontent.com/52392004/174461586-e439ed63-dd27-4a62-ae7d-6408a08e35bb.png)

5) Permissions는 [Create new role]을 선택합니다. 

하지만 아래와 같은 policy를 가지는 role을 생성하여 사용할 수도 있습니다. 

```java
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-2:123456789012:table/TransactionHistoryTable"
            ]
        },
        {
            "Action": [
                "logs:*"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

6) state machine이 생성된후 [Edit] - [Workflow Studio]로 진입하면 아래와 같이 "ProcessTransaction"은 "Flow"의 "Pass" state로 선언되어 있고, "StoreHistory"는 "Actions"의 "DynamoDB: PutItem"으로 선언된것을 확인 할 수 있습니다. 

- ProcessTransaction

![noname](https://user-images.githubusercontent.com/52392004/174461878-2b5d5bb8-be8b-4eef-b080-468c0da20138.png)

- StoreHistory

![noname](https://user-images.githubusercontent.com/52392004/174461925-f9a15dde-c94f-45b8-839e-ffcbe8774e43.png)


## 실행 결과 

1) [Start execution]을 선택하여 실행화면으로 이동합니다.

2) 아래와 같이 "Input"에 아래와 같이 입력합니다. 

```java
{
    "TransactionId": "abcde1234"
}
```

입력 화면은 아래와 같습니다.

![noname](https://user-images.githubusercontent.com/52392004/174462033-c7e1ab12-1972-4312-b5ef-fc2ea52b240a.png)

3) 실행후 결과는 아래와 같습니다. 

![image](https://user-images.githubusercontent.com/52392004/174462042-46087f8e-cc09-462e-8be9-b755d74d1b6f.png)

여기서 각 단계의 history는 아래와 같습니다.

- ExecutionStarted

```java
{
  "input": {
    "TransactionId": "abcde1234"
  },
  "inputDetails": {
    "truncated": false
  },
  "roleArn": "arn:aws:iam::1234567890:role/aws-step-functions-dynamodb"
}
```

- TaskScheduled

```java
{
  "resourceType": "dynamodb",
  "resource": "putItem",
  "region": "ap-northeast-2",
  "parameters": {
    "TableName": "TransactionHistoryTable",
    "Item": {
      "TransactionId": {
        "S": "abcde1234"
      }
    }
  },
  "timeoutInSeconds": null,
  "heartbeatInSeconds": null
}
```

- TaskSucceeded

```java
{
  "resourceType": "dynamodb",
  "resource": "putItem",
  "output": {
    "SdkHttpMetadata": {
      "AllHttpHeaders": {
        "Server": [
          "Server"
        ],
        "Connection": [
          "keep-alive"
        ],
        "x-amzn-RequestId": [
          "CRVLF46AGC9LO1RO98GN0S2T07VV4KQNSO5AEMVJF66Q9ASUAAJG"
        ],
        "x-amz-crc32": [
          "2745614147"
        ],
        "Content-Length": [
          "2"
        ],
        "Date": [
          "Sun, 19 Jun 2022 01:19:35 GMT"
        ],
        "Content-Type": [
          "application/x-amz-json-1.0"
        ]
      },
      "HttpHeaders": {
        "Connection": "keep-alive",
        "Content-Length": "2",
        "Content-Type": "application/x-amz-json-1.0",
        "Date": "Sun, 19 Jun 2022 01:19:35 GMT",
        "Server": "Server",
        "x-amz-crc32": "2745614147",
        "x-amzn-RequestId": "CRVLF46AGC9LO1RO98GN0S2T07VV4KQNSO5AEMVJF66Q9ASUAAJG"
      },
      "HttpStatusCode": 200
    },
    "SdkResponseMetadata": {
      "RequestId": "CRVLF46AGC9LO1RO98GN0S2T07VV4KQNSO5AEMVJF66Q9ASUAAJG"
    }
  },
  "outputDetails": {
    "truncated": false
  }
}
```

- ExecutionSucceeded

```java
{
  "output": {
    "TransactionId": "abcde1234",
    "DynamoDB": {
      "SdkHttpMetadata": {
        "AllHttpHeaders": {
          "Server": [
            "Server"
          ],
          "Connection": [
            "keep-alive"
          ],
          "x-amzn-RequestId": [
            "CRVLF46AGC9LO1RO98GN0S2T07VV4KQNSO5AEMVJF66Q9ASUAAJG"
          ],
          "x-amz-crc32": [
            "2745614147"
          ],
          "Content-Length": [
            "2"
          ],
          "Date": [
            "Sun, 19 Jun 2022 01:19:35 GMT"
          ],
          "Content-Type": [
            "application/x-amz-json-1.0"
          ]
        },
        "HttpHeaders": {
          "Connection": "keep-alive",
          "Content-Length": "2",
          "Content-Type": "application/x-amz-json-1.0",
          "Date": "Sun, 19 Jun 2022 01:19:35 GMT",
          "Server": "Server",
          "x-amz-crc32": "2745614147",
          "x-amzn-RequestId": "CRVLF46AGC9LO1RO98GN0S2T07VV4KQNSO5AEMVJF66Q9ASUAAJG"
        },
        "HttpStatusCode": 200
      },
      "SdkResponseMetadata": {
        "RequestId": "CRVLF46AGC9LO1RO98GN0S2T07VV4KQNSO5AEMVJF66Q9ASUAAJG"
      }
    }
  },
  "outputDetails": {
    "truncated": false
  }
}
```

4) DyanmoDB console에서 아래와 같이 Step Function이 write한 Item을 확인 할 수 있습니다. 

![noname](https://user-images.githubusercontent.com/52392004/174462130-dd9d544d-3422-4bf1-8602-0f12e270f7d2.png)




## Reference 

[AWS Step Functions with DynamoDB Tutorial | Step by Step Guide](https://www.youtube.com/watch?v=9aE9Yjna8J0)
