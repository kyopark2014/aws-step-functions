exports.handler = (event, context, callback) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## EVENT: ' + JSON.stringify(event))  
        
    callback(null, {"msg": "lessOrEqual"});
 }; 
