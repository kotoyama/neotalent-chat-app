import { type Rule } from 'effector-forms'
import { type z, type ZodError } from 'zod'
import { RequestError, ValidationError } from '@repo/shared-types/types'

export function createRule<V>({
  schema,
  name,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.Schema<any, any, V>
  name: string
}): Rule<V> {
  return {
    name,
    validator: (v: V) => {
      try {
        schema.parse(v)
        return {
          isValid: true,
          value: v,
        }
      } catch (error) {
        return {
          isValid: false,
          value: v,
          errorText: (error as ZodError).issues[0].message,
        }
      }
    },
  }
}

export const isErrorWithDescription = (
  error: RequestError
): error is RequestError &
  Required<Pick<RequestError, 'description'>> => {
  return Boolean('description' in error)
}

export const mapValidationError = (error: ValidationError) => {
  const errors = []

  const fields = (error as unknown as ValidationError)?.fields

  for (const field in fields) {
    errors.push({
      rule: 'backend',
      field,
      errorText: fields[field],
    })
  }

  return errors
}
