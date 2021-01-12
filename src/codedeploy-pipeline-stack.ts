import { ServerDeploymentGroup, ServerApplication, InstanceTagSet } from '@aws-cdk/aws-codedeploy';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { CodeDeployServerDeployAction, GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { ArnPrincipal } from '@aws-cdk/aws-iam';
import { BucketEncryption } from '@aws-cdk/aws-s3';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
// import { Repository } from '@aws-cdk/aws-codecommit';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
// import { dependencies } from '../package.json';
import { StageProps } from './codedeploy-pipeline-app';

export interface CodedeployPipelineStackProps extends StackProps {
  repositoryName: string;
  branch: string;
  stageProps: StageProps;
  actionName: string;
}

/*
 * The stack that defines the application pipeline
 */
export class CodedeployPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: CodedeployPipelineStackProps) {
    super(scope, id, props);

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const sourceBucket = new AutoDeleteBucket(this, 'PipeBucket', {
      versioned: true,
      encryption: BucketEncryption.KMS,
    });

    const pipeline = new Pipeline(this, 'Pipeline', {
      artifactBucket: sourceBucket,
      restartExecutionOnUpdate: true,
    });

    const cdkPipeline = new CdkPipeline(this, 'CdkPipeline', {
      //   pipelineName: 'MyServicePipeline',
      cloudAssemblyArtifact,

      codePipeline: pipeline,

      // Where the source can be found
      sourceAction: new GitHubSourceAction({
        actionName: 'CodeCommitSource',
        branch: props.branch,
        owner: 'mmuller88',
        repo: 'rasp4',
        oauthToken: SecretValue.secretsManager('alfcdk', {
          jsonField: 'muller88-github-token',
        }),
        // repository: Repository.fromRepositoryName(this, 'repo', props.repositoryName),
        output: sourceArtifact,
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        installCommand: 'yarn install',
        // installCommand: `git config --global credential.helper "!aws codecommit credential-helper $@" && git config --global credential.useHttpPath true && make install && npm install -g aws-cdk@${dependencies['@aws-cdk/core']}`,
        sourceArtifact,
        cloudAssemblyArtifact,
        // rolePolicyStatements: [new PolicyStatement({
        //   actions: ['codecommit:*'],
        //   resources: [`arn:aws:codecommit:eu-central-1:${this.account}:*`],
        // })],
        // buildCommand: 'yarn install --frozen-lockfile',
      }),
    });

    const serverApplication = new ServerApplication(this, 'ServerApplication', {
      applicationName: props.repositoryName,
    });

    const instanceUserArn = `arn:aws:iam::${this.account}:user/AWS/CodeDeploy/${props.stageProps.instanceAgentUser}`;

    pipeline.artifactBucket.grantRead(new ArnPrincipal(instanceUserArn));
    pipeline.artifactBucket.encryptionKey?.grant(new ArnPrincipal(instanceUserArn),
      'kms:Encrypt',
      'kms:Decrypt',
      'kms:ReEncrypt*',
      'kms:GenerateDataKey*',
      'kms:DescribeKey',
    );

    const stage = cdkPipeline.addStage(`CodeDeployStage-${props.stageProps.stage}`);

    const deploymentGroup = new ServerDeploymentGroup(this, `ServerDeploymentGroup-${props.stageProps.stage}`, {
      application: serverApplication,
      deploymentGroupName: `${props.repositoryName}-${props.stageProps.stage}`,
      onPremiseInstanceTags: new InstanceTagSet({
        Name: [props.stageProps.instanceAgentUser],
      }),
    });

    stage.addActions(
      // new ManualApprovalAction({
      //   runOrder: stage.nextSequentialRunOrder(),
      //   actionName: `Approve_${props.actionName}`,
      // }),
      new CodeDeployServerDeployAction({
        runOrder: stage.nextSequentialRunOrder(),
        actionName: props.actionName,
        input: sourceArtifact,
        deploymentGroup: deploymentGroup,
      }));
  }
}