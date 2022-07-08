import Ajv from 'ajv';
import createHttpError, { isHttpError } from 'http-errors';

import { ApiGatewayContract } from '../apiGatewayContract';
import {
  BodyType,
  CompleteHandlerType,
  HandlerEventType,
  HandlerType,
  LambdaEventType,
  LambdaReturnType,
  OutputType,
} from '../types';

const proxyEventToHandlerEvent = <Contract extends ApiGatewayContract>({
  requestContext,
  body: proxyEventBody = null,
  headers,
  pathParameters,
  queryStringParameters,
}: LambdaEventType<Contract>): HandlerEventType<Contract> => {
  return {
    requestContext,
    body: (proxyEventBody !== null
      ? JSON.parse(proxyEventBody)
      : undefined) as BodyType<Contract>,
    headers,
    pathParameters,
    queryStringParameters,
  } as unknown as HandlerEventType<Contract>;
};

const handlerResponseToLambdaResult = <Contract extends ApiGatewayContract>(
  handlerResponse: OutputType<Contract>,
): LambdaReturnType<Contract> => ({
  statusCode: 200,
  body: JSON.stringify(handlerResponse),
});

export const getHttpLambdaHandler =
  <Contract extends ApiGatewayContract>(contract: Contract) =>
  (handler: HandlerType<Contract>): CompleteHandlerType<Contract> =>
  async event => {
    try {
      const ajv = new Ajv();

      const parsedEvent = proxyEventToHandlerEvent<Contract>(event);

      if (contract.bodySchema !== undefined) {
        const inputValidator = ajv.compile(contract.bodySchema);
        if (!inputValidator(parsedEvent.body)) {
          throw createHttpError(400, 'Invalid input');
        }
      }
      const handlerResponse = await handler(parsedEvent);

      if (contract.outputSchema !== undefined) {
        const outputValidator = ajv.compile(contract.outputSchema);
        if (!outputValidator(handlerResponse)) {
          throw createHttpError(400, 'Invalid output');
        }
      }

      return handlerResponseToLambdaResult(handlerResponse);
    } catch (error) {
      if (isHttpError(error) && error.expose) {
        return {
          headers: error.headers,
          statusCode: error.statusCode,
          body: error.message,
        };
      }

      return {
        statusCode: 500,
        body: 'Internal server error',
      };
    }
  };
