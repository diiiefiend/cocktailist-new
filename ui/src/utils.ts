import type { Ref } from "vue";

const checkRequiredFields = (requiredFields: string[], payload: Ref) => {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    // @ts-ignore
    if (!payload.value[field] || payload.value[field] === '') {
      errors.push(`missing required field: ${field}`);
    }
  });

  return errors;
}

export {
  checkRequiredFields,
};