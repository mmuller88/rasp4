// Load the AWS SDK
DEPLOYMENT_GROUP_NAME = process.env.DEPLOYMENT_GROUP_NAME

var AWS = require('aws-sdk'),
    region = "eu-central-1",
    secretName = 'rasp4',
    secret,
    decodedBinarySecret;
var fs = require('fs');
var secretEnv = '/home/ubuntu/git/rasp4/secret.env';

// var credentials = new AWS.SharedIniFileCredentials({profile: `default`});
// AWS.config.credentials = credentials;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        console.log("*******************************")
        console.log("Error fetching secrets")
        console.log("*******************************")
        console.log(err)
        // process.exit(1);
	if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = JSON.parse(data.SecretString);
            for (let key in secret) {
                if(secret.hasOwnProperty(key))
                fs.appendFile(secretEnv, `${key}=${secret[key]}` + '\r\n', function (err) {
                        if (err) throw err;
                        console.log(`${key}='${secret[key]}' Saved!`);
                });
            }

        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
    
    // Your code goes here. 
});