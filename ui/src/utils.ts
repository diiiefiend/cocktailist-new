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

// constants
export const FLOURISH_IMG = '/images/deco-flourish.jpg';
export const ALL_BARS = 'All bars';
export const ALL_SPIRITS = 'All spirits';

export const DATE_FORMATTING: any = {
  year: 'numeric',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
};

export {
  checkRequiredFields,
};