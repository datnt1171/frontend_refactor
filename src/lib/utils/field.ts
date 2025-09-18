import type { ProcessField, FieldCondition } from "@/types"

/**
 * Evaluates a single condition against form values
 */
function evaluateCondition(
  condition: FieldCondition,
  formValues: Record<string, any>
): boolean {
  // Handle special case for weekday operator - it can work without condition_field
  if (condition.operator === "weekday") {
    return evaluateWeekdayCondition(condition, formValues)
  }

  // For all other operators, condition_field is required
  if (!condition.condition_field) return true

  const fieldValue = formValues[condition.condition_field]
  const conditionValue = condition.value

  switch (condition.operator) {
    case "exact":
      if (Array.isArray(conditionValue)) {
        return conditionValue.includes(fieldValue)
      }
      return fieldValue === conditionValue

    case "not_exact":
      if (Array.isArray(conditionValue)) {
        return !conditionValue.includes(fieldValue)
      }
      return fieldValue !== conditionValue

    case "contains":
      if (typeof fieldValue === "string" && typeof conditionValue === "string") {
        return fieldValue.toLowerCase().includes(conditionValue.toLowerCase())
      }
      if (Array.isArray(fieldValue) && Array.isArray(conditionValue)) {
        return conditionValue.some(val => fieldValue.includes(val))
      }
      return false

    case "not_contains":
      if (typeof fieldValue === "string" && typeof conditionValue === "string") {
        return !fieldValue.toLowerCase().includes(conditionValue.toLowerCase())
      }
      if (Array.isArray(fieldValue) && Array.isArray(conditionValue)) {
        return !conditionValue.some(val => fieldValue.includes(val))
      }
      return true

    case "in":
      if (Array.isArray(conditionValue)) {
        return conditionValue.includes(fieldValue)
      }
      return false

    case "not_in":
      if (Array.isArray(conditionValue)) {
        return !conditionValue.includes(fieldValue)
      }
      return true

    case "gt":
      const numFieldValue = Number(fieldValue)
      const numConditionValue = Number(conditionValue)
      return !isNaN(numFieldValue) && !isNaN(numConditionValue) && numFieldValue > numConditionValue

    case "lt":
      const numFieldValueLt = Number(fieldValue)
      const numConditionValueLt = Number(conditionValue)
      return !isNaN(numFieldValueLt) && !isNaN(numConditionValueLt) && numFieldValueLt < numConditionValueLt

    case "gte":
      const numFieldValueGte = Number(fieldValue)
      const numConditionValueGte = Number(conditionValue)
      return !isNaN(numFieldValueGte) && !isNaN(numConditionValueGte) && numFieldValueGte >= numConditionValueGte

    case "lte":
      const numFieldValueLte = Number(fieldValue)
      const numConditionValueLte = Number(conditionValue)
      return !isNaN(numFieldValueLte) && !isNaN(numConditionValueLte) && numFieldValueLte <= numConditionValueLte

    case "is_empty":
      return fieldValue === "" || fieldValue === null || fieldValue === undefined || 
             (Array.isArray(fieldValue) && fieldValue.length === 0)

    case "is_not_empty":
      return fieldValue !== "" && fieldValue !== null && fieldValue !== undefined && 
             (!Array.isArray(fieldValue) || fieldValue.length > 0)

    default:
      console.log("Unknown operator:", condition.operator)
      return true
  }
}

/**
 * Evaluates weekday conditions - can work with or without condition_field
 */
function evaluateWeekdayCondition(
  condition: FieldCondition,
  formValues: Record<string, any>
): boolean {
  const conditionValue = condition.value
  console.log("case weekday", { condition, conditionValue })

  let dayOfWeek: number

  if (!condition.condition_field) {
    // Check current day of week
    const today = new Date()
    dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    console.log("weekday check - current day:", { dayOfWeek })
  } else {
    // Check specific field value (should be a date string)
    const fieldValue = formValues[condition.condition_field]
    if (!fieldValue || typeof fieldValue !== "string") {
      console.log("weekday check - invalid field value:", fieldValue)
      return false
    }
    
    const date = new Date(fieldValue)
    dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    console.log("weekday check - field value:", { fieldValue, dayOfWeek })
  }

  // Convert condition values to numbers for comparison
  const expectedDays = Array.isArray(conditionValue) 
    ? conditionValue.map(val => Number(val))
    : [Number(conditionValue)]
    
  const result = expectedDays.includes(dayOfWeek)
  console.log("weekday check result:", { dayOfWeek, expectedDays, result })
  return result
}

/**
 * Determines if a field should be visible based on its conditions
 * All conditions must be true for the field to be visible (AND logic)
 */
export function isFieldVisible(
  field: ProcessField,
  formValues: Record<string, any>
): boolean {
  console.log("isFieldVisible called for field:", field.name, "conditions:", field.conditions)
  
  // If no conditions, field is always visible
  if (!field.conditions || field.conditions.length === 0) {
    console.log("No conditions, field visible")
    return true
  }

  // All conditions must be true for field to be visible
  const result = field.conditions.every(condition => {
    const conditionResult = evaluateCondition(condition, formValues)
    console.log("Condition result:", conditionResult, "for condition:", condition)
    return conditionResult
  })
  
  console.log("Final visibility result:", result)
  return result
}

/**
 * Filters fields to only return visible ones
 */
export function getVisibleFields(
  fields: ProcessField[],
  formValues: Record<string, any>
): ProcessField[] {
  return fields.filter(field => isFieldVisible(field, formValues))
}

/**
 * Hook for managing field visibility in React components
 */
export function useFieldVisibility(
  fields: ProcessField[],
  formValues: Record<string, any>
) {
  const visibleFields = getVisibleFields(fields, formValues)
  
  const isVisible = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId)
    return field ? isFieldVisible(field, formValues) : false
  }

  return {
    visibleFields,
    isVisible,
    totalFields: fields.length,
    visibleCount: visibleFields.length
  }
}