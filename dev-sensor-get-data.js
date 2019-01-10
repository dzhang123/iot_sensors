'use strict'

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:3306"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Scanning dev-sensor-groups...");

var scanParams = {
    TableName: "dev-sensor-groups",
    ProjectionExpression: "#group_pid, #nm, wellId, subDevices",
    FilterExpression: "#group_pid between :start_pid and :end_pid",
    ExpressionAttributeNames: {
        "#group_pid": "pid",
        "#nm": "name"
    },
    ExpressionAttributeValues: {
        ":start_pid": 0,
        ":end_pid": 1000
    }
};

console.log ("Scanning dev-sensor-groups table...");
docClient.scan(scanParams, onScan);
function onScan(err, data) {
    if (err) {
        console.error(`Unable to scan the table, Error JSON: ${JSON.stringify(err, null, 2)}`);
    } else {
        console.log("Scan succeeded.");
        data.Items.forEach ( function(item) {
            console.log(`pid: ${item.pid} - name: ${item.name} - wellId: ${item.wellId} - subDevices: ${item.subDevices}`);
        });
        if (typeof data.LastEvaludatedKey != "undefined") {
            console.log("scanning for more");
            scanParams.ExclusiveStartKey = data.LastEvaludatedKey;
            docClient.scan(scanParams, onScan);
        }
    }
};


console.log("Scanning dev-sensor-sensors table ...");
var sensorsParams = {
    TableName: "dev-sensor-sensors",
    ProjectionExpression: "pid_assembly, skey_bleId, #nm, wellId, paringCode, subDevices",
    FilterExpression: "pid_assembly between :start_pid and :end_pid",
    ExpressionAttributeNames: {
        
        "#nm": "name"
    },
    ExpressionAttributeValues: {
        ":start_pid": 0,
        ":end_pid": 1000
    }
};
docClient.scan(sensorsParams, onScanSensors);
function onScanSensors(err, data) {
    if (err) {
        console.error(`Unable to scan the table, Error JSON: ${JSON.stringify(err, null, 2)}`);
    } else {
        console.log("Scan succeeded.");
        data.Items.forEach ( function(item) {
            console.log(`pid_assembly: ${item.pid_assembly} - skey_bleId: ${item.skey_bleId} - name: ${item.name} - wellId: ${item.wellId} - paringCode: ${item.paringCode} - subDevices: ${item.subDevices}`);
        });
        if (typeof data.LastEvaludatedKey != "undefined") {
            console.log("scanning for more");
            scanParams.ExclusiveStartKey = data.LastEvaludatedKey;
            docClient.scan(sensorsParams, onScanSensors);
        }
    }
};

