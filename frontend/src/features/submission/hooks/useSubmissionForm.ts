import { useState, useCallback, useEffect } from 'react';
import { SubmissionFormValues, SubmissionFormErrors } from '../types/submission';
import { VALIDATION_LIMITS, ERROR_MESSAGES } from '../constants/validation';

const initialValues: SubmissionFormValues = {
  fullName: '',
  mobileNumber: '',
  title: '',
  description: '',
  category: '',
  language: '',
};

export function useSubmissionForm() {
  const [values, setValues] = useState<SubmissionFormValues>(initialValues);
  const [errors, setErrors] = useState<SubmissionFormErrors>({});
  const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name: keyof SubmissionFormValues, value: string): string => {
    switch (name) {
      case 'title':
        if (!value.trim()) {
          return ERROR_MESSAGES.TITLE_REQUIRED;
        }
        if (value.length < VALIDATION_LIMITS.TITLE.MIN || value.length > VALIDATION_LIMITS.TITLE.MAX) {
          return ERROR_MESSAGES.TITLE_LENGTH;
        }
        return '';
      
      case 'description':
        if (!value.trim()) {
          return ERROR_MESSAGES.DESCRIPTION_REQUIRED;
        }
        if (value.length < VALIDATION_LIMITS.DESCRIPTION.MIN || value.length > VALIDATION_LIMITS.DESCRIPTION.MAX) {
          return ERROR_MESSAGES.DESCRIPTION_LENGTH;
        }
        return '';

      case 'category':
        if (!value) {
          return ERROR_MESSAGES.CATEGORY_REQUIRED;
        }
        return '';

      case 'language':
        if (!value) {
          return ERROR_MESSAGES.LANGUAGE_REQUIRED;
        }
        return '';

      case 'mobileNumber':
        if (value.trim() && !VALIDATION_LIMITS.MOBILE_REGEX.test(value.trim())) {
          return ERROR_MESSAGES.MOBILE_INVALID;
        }
        return '';

      default:
        return '';
    }
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SubmissionFormValues;
    
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    setIsTouched((prev) => ({ ...prev, [fieldName]: true }));
    
    const fieldError = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
  }, [validateField]);

  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SubmissionFormValues;
    
    setIsTouched((prev) => ({ ...prev, [fieldName]: true }));
    const fieldError = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
  }, [validateField]);

  // Compute overall form validity
  useEffect(() => {
    const requiredFields: (keyof SubmissionFormValues)[] = ['title', 'description', 'category', 'language'];
    
    // Check if all required fields are filled and there are no errors on any field
    const allRequiredFilled = requiredFields.every((field) => !!values[field].trim());
    const hasAnyErrors = Object.values(errors).some((err) => !!err);
    
    setIsValid(allRequiredFilled && !hasAnyErrors);
  }, [values, errors]);

  return {
    values,
    errors,
    isTouched,
    isValid,
    handleChange,
    handleBlur,
  };
}
