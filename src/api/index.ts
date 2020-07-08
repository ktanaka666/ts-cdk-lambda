import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'ts-cdk-sample';

export const sample = async (
  event: APIGatewayEvent,
  _: Context,
  callback: Callback,
) => {
  console.log(JSON.stringify(event, null, 2));

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event, null, 2),
    isBase64Encoded: false,
  };
  try {
    if (event.resource === '/items' && event.httpMethod === 'GET') {
      const res = await docClient
        .scan({
          TableName: tableName,
        })
        .promise();
      response.body = JSON.stringify(res.Items, null, 2);
    } else if (
      event.resource === '/items/{item}' &&
      event.httpMethod === 'GET' &&
      event.pathParameters?.item
    ) {
      const res = await docClient
        .query({
          TableName: tableName,
          ExpressionAttributeNames: {
            '#id': 'id',
          },
          ExpressionAttributeValues: {
            ':id': decodeURIComponent(event.pathParameters!.item),
          },
          KeyConditionExpression: '#id = :id',
        })
        .promise();
      response.body = JSON.stringify(res.Items, null, 2);
    } else if (
      event.resource === '/items/{item}' &&
      event.httpMethod === 'POST' &&
      event.pathParameters?.item
    ) {
      const res = await docClient
        .put({
          TableName: tableName,
          Item: {
            id: decodeURIComponent(event.pathParameters!.item),
          },
        })
        .promise();
      response.body = JSON.stringify(res, null, 2);
    } else if (
      event.resource === '/items/{item}' &&
      event.httpMethod === 'DELETE' &&
      event.pathParameters?.item
    ) {
      const res = await docClient
        .delete({
          TableName: tableName,
          Key: {
            id: decodeURIComponent(event.pathParameters!.item),
          },
        })
        .promise();
      response.body = JSON.stringify(res, null, 2);
    }

    callback(null, response);
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify(e, null, 2);
    callback(e, response);
  }
};
