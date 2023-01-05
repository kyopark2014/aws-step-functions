# S3 Event Notification

## Lambda 생성 

[console](https://ap-northeast-2.console.aws.amazon.com/lambda/home?region=ap-northeast-2#/create/function)에서 [Function name]으로 "s3-event-trigger"을 입력하고, 스크롤하여 [Create function]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210679351-a55b923f-f8dc-4722-bc3d-d2b19748ad78.png)

[simple-serverless-filestore-for-notification](https://github.com/kyopark2014/simple-serverless-filestore/tree/main/simple-serverless-filestore-for-notification)을 참조하여 Lambda를 생성합니다.

```java
const AWS = require('aws-sdk');

exports.handler = async (event) => {
    console.log('## EVENT: ' + JSON.stringify(event))

    let bucket = event.Records[0].s3.bucket.name;
    let key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };  
    
    console.log('Info: ' + JSON.stringify(params)) 
    
    // TODO implement
    const response = {
        statusCode: 200,
    };
    return response;
};
```
아래와 같이 Lambda의 ARN을 확인합니다. 여기서는 "arn:aws:lambda:ap-northeast-2:123456789012:function:s3-event-trigger" 입니다. 

![noname](https://user-images.githubusercontent.com/52392004/210679958-70b9a9be-c704-4582-8122-e254daa742b7.png)




## S3 생성

1. [Console](https://s3.console.aws.amazon.com/s3/buckets?region=ap-northeast-2)에서 [Create bucket]을 선택합니다.

2. Bucket name으로 "s3-event-tracker"을 입력하고 아래로 스크롤하여 [Create Bucket]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210677831-e2ec2510-4848-4570-b120-9ff773c3b634.png)

3. "s3-event-tracker" bucket에 접속해서, [Properties] - [Create event notification]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210678508-1036f99e-e83b-4946-acca-54f7e95df875.png)

4. [General configuration]에서 [Event name]을 "s3-event"라고 입력합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210678730-94fc2e9b-c10e-4113-b071-a712be3e87be.png)

5. event를 아래와 같이 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210680277-bdfeb268-20e6-4087-909e-6721370bfbfe.png)

6. 아래와 같이 event를 받을 lambda를 설정합니다.

![noname](https://user-images.githubusercontent.com/52392004/210680480-564edd9c-cff0-4c9a-81dc-449b4457db7c.png)

정상적으로 Lambda가 준비되면 아래와 같이 파일 업로드시 관련 event를 받을수 있습니다.

```java
2023-01-05T01:30:34.148Z	a24a20de-94ca-4faa-bfff-53f0aae663ba	INFO	Info: 
{
    "Bucket": "s3-event-tracker",
    "Key": "customers.csv"
}
```

7. [Configurations] - [State machines]에서 [Create state machine]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210681645-edcd2262-7cd8-442f-b1d6-a4642a178a61.png)

8. [Design your workflow visualy]를 선택하고 Next를 선택합니다. 


