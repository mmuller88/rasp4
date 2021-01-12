const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'Martin Mueller',
  cdkVersion: '1.77.0',
  cdkDependencies: [
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-codepipeline-actions',
    '@aws-cdk/pipelines',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-codedeploy',
  ],
  deps: [
    '@mobileposse/auto-delete-bucket',
  ],
  name: 'rasp4',
  repository: 'https://github.com/mmuller88/rasp4.git',
  context: {
    '@aws-cdk/core:enableStackNameDuplicates': 'true',
    'aws-cdk:enableDiffNoFail': 'true',
    '@aws-cdk/core:newStyleStackSynthesis': true,
  },
});

project.setScript('cdkDeploy', 'cdk deploy');

const common_exclude = ['volumes'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
