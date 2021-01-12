import { App, AppProps } from '@aws-cdk/core';
import { CodedeployPipelineStack, CodedeployPipelineStackProps } from './codedeploy-pipeline-stack';

export interface CodeDeployPipelineAppProps extends AppProps {
  branch: string;
  repositoryName: string;
  /**
   * Verschiedenen sStages
   */
  stageProps: StageProps;
  /**
   * Name for the Action shown in the Pipeline
   */
  actionName: string;
}

export interface StageProps {
  account: string;
  stage: string;
  /**
   * You find that User in the Build IAM User list
   */
  instanceAgentUser: string;
}

export class CodeDeployPipelineApp extends App {

  constructor(props: CodeDeployPipelineAppProps) {
    super(props);

    const codedeployPipelineStackProps: CodedeployPipelineStackProps = {
      env: {
        account: props.stageProps.account,
        region: 'eu-central-1',
      },
      repositoryName: props.repositoryName,
      branch: props.branch,
      stageProps: props.stageProps,
      actionName: props.actionName,
    };

    // tslint:disable-next-line: no-unused-expression
    new CodedeployPipelineStack(this, `${props.repositoryName}-pipeline-stack`, codedeployPipelineStackProps);

    this.synth();
  }
}


