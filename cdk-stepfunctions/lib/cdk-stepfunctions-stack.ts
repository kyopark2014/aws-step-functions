import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CdkStepfunctionsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const startState = new stepfunctions.Pass(this, 'PassState', {
      result: { value: 'Hello back to you!' },
    })
    
    const stateMachine = new stepfunctions.StateMachine(this, 'MyStateMachine', {
      definition: startState,
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    });

    const api = new apigateway.StepFunctionsRestApi(this, 'StepFunctionsRestApi', { 
      stateMachine: stateMachine  
    });

    new cdk.CfnOutput(this, 'apiUrl', {
      value: api.url,
      description: 'The url of API Gateway',
    });
  }
}
