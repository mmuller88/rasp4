const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '1.163.1',
  defaultReleaseBranch: 'main',
  name: 'rasp4',
  cdkDependencies: [
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-codepipeline-actions',
    '@aws-cdk/pipelines',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-codedeploy',
  ],
  deps: ['@mobileposse/auto-delete-bucket'],
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
