import type { ProcessField, FieldCondition } from "@/types"

/**
 * Evaluates a single condition against form values and user context
 */
function evaluateCondition(
  condition: FieldCondition,
  formValues: Record<string, any>,
  userDept?: string
): boolean {
  // Handle user department operators
  if (condition.operator === "user_dept") {
    return evaluateUserDeptCondition(condition, userDept)
  }
  
  if (condition.operator === "user_dept_in") {
    return evaluateUserDeptInCondition(condition, userDept)
  }
  
  if (condition.operator === "user_dept_not_in") {
    return evaluateUserDeptNotInCondition(condition, userDept)
  }

  // Handle special case for weekday operator
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
      return true
  }
}

/**
 * Evaluates user department condition (exact match)
 */
function evaluateUserDeptCondition(
  condition: FieldCondition,
  userDept?: string
): boolean {
  if (!userDept) return false
  
  const conditionValue = condition.value
  
  if (Array.isArray(conditionValue)) {
    // If value is array with single item, compare to that item
    return conditionValue.length === 1 && conditionValue[0] === userDept
  }
  
  return conditionValue === userDept
}

/**
 * Evaluates if user department is in the list
 */
function evaluateUserDeptInCondition(
  condition: FieldCondition,
  userDept?: string
): boolean {
  if (!userDept) return false
  
  const conditionValue = condition.value
  
  if (Array.isArray(conditionValue)) {
    return conditionValue.includes(userDept)
  }
  
  return conditionValue === userDept
}

/**
 * Evaluates if user department is NOT in the list
 */
function evaluateUserDeptNotInCondition(
  condition: FieldCondition,
  userDept?: string
): boolean {
  if (!userDept) return true // If no dept, show field
  
  const conditionValue = condition.value
  
  if (Array.isArray(conditionValue)) {
    return !conditionValue.includes(userDept)
  }
  
  return conditionValue !== userDept
}

/**
 * Evaluates weekday conditions - can work with or without condition_field
 */
function evaluateWeekdayCondition(
  condition: FieldCondition,
  formValues: Record<string, any>
): boolean {
  if (typeof window === 'undefined') {
    return true // Always show fields during SSR
  }
  
  const conditionValue = condition.value
  let dayOfWeek: number

  if (!condition.condition_field) {
    const today = new Date()
    dayOfWeek = today.getDay()
  } else {
    const fieldValue = formValues[condition.condition_field]
    if (!fieldValue || typeof fieldValue !== "string") return false
    dayOfWeek = new Date(fieldValue).getDay()
  }

  const expectedDays = Array.isArray(conditionValue) 
    ? conditionValue.map(val => Number(val))
    : [Number(conditionValue)]
    
  return expectedDays.includes(dayOfWeek)
}

/**
 * Determines if a field should be visible based on its conditions
 * All conditions must be true for the field to be visible (AND logic)
 */
export function isFieldVisible(
  field: ProcessField,
  formValues: Record<string, any>,
  userDept?: string // NEW parameter
): boolean {
  
  // If no conditions, field is always visible
  if (!field.conditions || field.conditions.length === 0) {
    return true
  }

  // All conditions must be true for field to be visible
  const result = field.conditions.every(condition => {
    const conditionResult = evaluateCondition(condition, formValues, userDept)
    return conditionResult
  })
  
  return result
}

/**
 * Filters fields to only return visible ones
 */
export function getVisibleFields(
  fields: ProcessField[],
  formValues: Record<string, any>,
  userDept?: string // NEW parameter
): ProcessField[] {
  return fields.filter(field => isFieldVisible(field, formValues, userDept))
}

/**
 * Hook for managing field visibility in React components
 */
export function useFieldVisibility(
  fields: ProcessField[],
  formValues: Record<string, any>,
  userDept?: string // NEW parameter
) {
  const visibleFields = getVisibleFields(fields, formValues, userDept)
  
  const isVisible = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId)
    return field ? isFieldVisible(field, formValues, userDept) : false
  }

  return {
    visibleFields,
    isVisible,
    totalFields: fields.length,
    visibleCount: visibleFields.length
  }
}