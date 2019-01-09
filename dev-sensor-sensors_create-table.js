
'use strict'

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    //endpoint: "http://localhost:3306"
});

var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: "dev-sensor-sensors",
    KeySchema: [
        {AttributeName: "pid_assembly", KeyType: "HASH"},
        {AttributeName: "skey_bleId", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        {AttributeName: "pid_assembly", AttributeType: "N"},
        {AttributeName: "skey_bleId", AttributeType: "N"}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

dynamodb.createTable (params, (err, data) => {
    if (err) {
        console.log(`Unable to create table. Error JSON: ${JSON.stringify(err, null, 2)}`);
    } else {
        console.log(`Created table. Table description JSON: ${JSON.stringify(data, null, 2)}`);
    }
});