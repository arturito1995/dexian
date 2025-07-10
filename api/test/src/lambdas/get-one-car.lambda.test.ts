const mockQueryOne = jest.fn();

jest.mock("../../../src/helpers/dynamo-helper", () => {
  return {
    DynamoHelper: jest.fn().mockImplementation(() => ({
      queryOne: (...args: any[]) => mockQueryOne(...args),
    })),
  };
});

import { handler } from "../../../src/lambdas/get-one-car.lambda";
import { HttpStatusCodes } from "../../../src/enums";
import { DEFAULT_LAMBDA_HEADERS } from "../../../src/constants";

describe("GetOneCarLambda handler", () => {
  const baseEvent = {
    pathParameters: { id: "car-123" },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return car data when found", async () => {
    const car = { id: "car-123", make: "Toyota" };
    mockQueryOne.mockResolvedValue(car);

    const result = await handler(baseEvent);

    expect(result.statusCode).toBe(HttpStatusCodes.OK);
    expect(result.headers).toEqual(DEFAULT_LAMBDA_HEADERS);
    expect(JSON.parse(result.body)).toEqual({
      car,
      success: true,
    });
    expect(mockQueryOne).toHaveBeenCalledWith({ value: "car-123" }, { tableName: "cars-table" });
  });

  it("should return 500 if id is missing", async () => {
    const event = { pathParameters: {} } as any;
    const result = await handler(event);

    expect(result.statusCode).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.headers).toEqual(DEFAULT_LAMBDA_HEADERS);
    expect(JSON.parse(result.body)).toMatchObject({
      error: expect.stringContaining("Id is required"),
      success: false,
    });
    expect(mockQueryOne).not.toHaveBeenCalled();
  });

  it("should return 500 if car not found", async () => {
    mockQueryOne.mockResolvedValue(undefined);

    const result = await handler(baseEvent);

    expect(result.statusCode).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.headers).toEqual(DEFAULT_LAMBDA_HEADERS);
    expect(JSON.parse(result.body)).toMatchObject({
      error: expect.stringContaining("Not found"),
      success: false,
    });
  });

  it("should return 500 on DynamoHelper error", async () => {
    mockQueryOne.mockRejectedValue(new Error("Dynamo error"));

    const result = await handler(baseEvent);

    expect(result.statusCode).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.headers).toEqual(DEFAULT_LAMBDA_HEADERS);
    expect(JSON.parse(result.body)).toMatchObject({
      error: expect.stringContaining("Dynamo error"),
      success: false,
    });
  });
});
