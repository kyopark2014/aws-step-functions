# S3 Event Notification

## S3 생성

1. [Console](https://s3.console.aws.amazon.com/s3/buckets?region=ap-northeast-2)에서 [Create bucket]을 선택합니다.

2. Bucket name으로 "s3-event-tracker"을 입력하고 아래로 스크롤하여 [Create Bucket]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210677831-e2ec2510-4848-4570-b120-9ff773c3b634.png)

3. "s3-event-tracker" bucket에 접속해서, [Properties] - [Create event notification]을 선택합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210678508-1036f99e-e83b-4946-acca-54f7e95df875.png)

4. [General configuration]에서 [Event name]을 "s3-event"라고 입력합니다. 

![noname](https://user-images.githubusercontent.com/52392004/210678730-94fc2e9b-c10e-4113-b071-a712be3e87be.png)




[simple-serverless-filestore-for-notification](https://github.com/kyopark2014/simple-serverless-filestore/tree/main/simple-serverless-filestore-for-notification)을 
