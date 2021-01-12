// import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { CodeDeployPipelineApp } from './codedeploy-pipeline-app';

// export class MyStack extends Stack {
//   constructor(scope: Construct, id: string, props: StackProps = {}) {
//     super(scope, id, props);

//     // define resources here...
//   }
// }

// for development, use account/region from cdk cli
// const devEnv = {
//   account: process.env.CDK_DEFAULT_ACCOUNT,
//   region: process.env.CDK_DEFAULT_REGION,
// };

new CodeDeployPipelineApp({
  branch: 'master',
  repositoryName: 'rasp4',
  stageProps: {
    account: '981237193288',
    stage: 'dev',
    instanceAgentUser: 'Rasp4VM10',
  },
  actionName: 'Deploy_Rasp4VM',
});

// new MyStack(app, 'my-stack-dev', { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

// app.synth();