import * as Joi from "joi";

export class SchemaValidator {
  public validateSchema = <T>(schema: Joi.ObjectSchema, payload: T): void => {
    try {
      const { error } = schema.validate(payload);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw new Error(`Unexpected validation error: ${error}`);
    }
  };
}
