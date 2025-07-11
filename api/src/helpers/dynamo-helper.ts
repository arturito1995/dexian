import * as dynamodb from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

interface DynamoHelperProps {
  tableName: string;
}

interface QueryProps {
  value: string;
  from?: string;
  to?: string;
}

interface TableOptions<T> {
  searchBy?: keyof T;
  limit?: number;
}

const DEFAULT_QUERY_SIZE = 20;

export class DynamoHelper<T> {
  private readonly client: dynamodb.DynamoDBClient;
  private tableName: string;

  constructor({ tableName }: DynamoHelperProps) {
    this.client = new dynamodb.DynamoDBClient();
    this.tableName = tableName;
  }

  public queryOne = async ({ value }: QueryProps, options?: TableOptions<T>): Promise<T | undefined> => {
    try {
      const field = options?.searchBy ?? "id";

      const cmd = new dynamodb.QueryCommand({
        TableName: this.tableName,
        IndexName: options?.searchBy as string | undefined,
        Limit: 1,
        KeyConditionExpression: `${String(field)} = :p0`,
        ExpressionAttributeValues: {
          ":p0": { S: value },
        },
      });

      return this.innerQuery(cmd);
    } catch (error) {
      throw new Error(`Error querying item: ${error}`);
    }
  };

  public queryMany = async ({ limit = DEFAULT_QUERY_SIZE }: TableOptions<T>): Promise<T[]> => {
    try {
      const cmd = new dynamodb.ScanCommand({
        TableName: this.tableName,
        Limit: limit,
      });

      return this.innerQueryMany(cmd);
    } catch (error) {
      throw new Error(`Error querying items: ${error}`);
    }
  };

  public create = async (payload: T): Promise<T | undefined> => {
    try {
      const id = randomUUID();

      const params: dynamodb.PutItemCommandInput = {
        TableName: this.tableName,
        Item: marshall({
          id,
          ...payload,
        }),
      };

      const command = new dynamodb.PutItemCommand(params);

      await this.client.send(command);

      return await this.queryOne({ value: id });
    } catch (error) {
      throw new Error(`Error creating item: ${error}`);
    }
  };

  public delete = async ({ id, insertDate }: { id: string; insertDate?: string }): Promise<void> => {
    try {
      const keyObj = { id: { S: id }, ...(insertDate!! ? { insertDate: { S: insertDate } } : {}) };

      const params: dynamodb.DeleteItemCommandInput = {
        TableName: this.tableName,
        Key: keyObj,
      };

      const command = new dynamodb.DeleteItemCommand(params);
      await this.client.send(command);
    } catch (error) {
      throw new Error(`Error deleting item: ${error}`);
    }
  };

  private innerQuery = async (cmd: dynamodb.QueryCommand): Promise<T | undefined> => {
    try {
      const results = await this.client.send(cmd);

      if (!results.Items || results.Items.length === 0) return undefined;

      return unmarshall(results.Items[0]) as T;
    } catch (error) {
      throw new Error(`Error querying item: ${error}`);
    }
  };

  private innerQueryMany = async (cmd: dynamodb.QueryCommand): Promise<T[]> => {
    try {
      let results: T[] = [];
      let lastEvaluatedKey = undefined;

      do {
        const response = await this.client.send(cmd);

        if (response.Items) {
          const unmarshalledItems = response.Items.map((item) => unmarshall(item) as T);
          results = results.concat(unmarshalledItems);

          if (results.length >= (cmd.input.Limit || DEFAULT_QUERY_SIZE)) {
            results = results.slice(0, cmd.input.Limit || DEFAULT_QUERY_SIZE);
            break;
          }
        }

        lastEvaluatedKey = response.LastEvaluatedKey;
        if (lastEvaluatedKey) {
          cmd.input.ExclusiveStartKey = lastEvaluatedKey;
        }
      } while (lastEvaluatedKey);

      return results;
    } catch (error) {
      throw new Error(`Error querying items: ${error}`);
    }
  };
}
