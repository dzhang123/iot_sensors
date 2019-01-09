
'use strict'

var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1",
    //endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

var allDevices = JSON.parse(fs.readFileSync("sample_data/sensorsdata.json", 'utf8'));

var table = "dev-sensor-sensors";

allDevices.forEach (sensor => {
    var params = {
        TableName: table,
        Item: {
            "pid_assembly": sensor.pid_assembly,
            "skey_bleId": sensor.skey_bleId,
            "name": sensor.name,
            "wellId": sensor.wellId,
            "paringCode": sensor.paringCode,
            "subDevices": sensor.subDevices
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {
            console.log(`Unable to add hw device: ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`PutItem succeeded: ${data.name}`);
        }
    })
});
