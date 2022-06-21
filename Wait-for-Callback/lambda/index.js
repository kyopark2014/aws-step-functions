console.log('Loading function');

var AWS = require('aws-sdk');
var stepfunctions = new AWS.StepFunctions({apiVersion: '2016-11-23'});

exports.lambda_handler = async(event, context, callback) => {
    console.log("event: %j", event) 

    for (let i=0;i<event.Records.length;i++) {
        let record = event.Records[i];
        
        const messageBody = JSON.parse(record.body);
        const taskToken = messageBody.TaskToken;

        const params = {
            output: "\"Callback task completed successfully.\"",
            taskToken: taskToken
        };

        console.log(`Calling Step Functions to complete callback task with params ${JSON.stringify(params)}`);
        try {
            let response = await stepfunctions.sendTaskSuccess(params).promise();
            console.log("response: %j", response);
        } catch(err) {
            console.log('err:'+err);
        }
    }
};