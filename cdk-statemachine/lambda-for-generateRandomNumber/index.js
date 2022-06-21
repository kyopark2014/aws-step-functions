exports.handler = (event, context, callback) => {
    console.log('## ENVIRONMENT VARIABLES: ' + JSON.stringify(process.env))
    console.log('## EVENT: ' + JSON.stringify(event))    
    
    const generateRandom = (maxNumber) => Math.floor(Math.random() * maxNumber) + 1;
    
    console.log("generateRandom: "+generateRandom(event.body.maxNumber));
    console.log("maxNumber: "+parseInt(event.body.maxNumber));
    console.log("numberToCheck: "+parseInt(event.body.numberToCheck));

    callback(null, {
        "generatedRandomNumber": generateRandom(event.body.maxNumber),
        "maxNumber": parseInt(event.body.maxNumber),
        "numberToCheck": parseInt(event.body.numberToCheck)
    });
} 
