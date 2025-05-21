export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // Au moins 8 caractères, 1 lettre majuscule, 1 lettre minuscule et 1 chiffre
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const validatePhoneNumber = (phone) => {
  // Format international ou local (France, Côte d'Ivoire)
  const regex = /^(\+\d{1,3}\s?)?\d{8,15}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

export const validateLoanAmount = (amount) => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

export const validateRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim() !== '';
  return value !== null && value !== undefined;
};

export const validateLoanDuration = (duration) => {
  const num = Number(duration);
  return !isNaN(num) && num >= 3 && num <= 120; // Entre 3 mois et 10 ans
};

export const validateIncome = (income) => {
  const numIncome = Number(income);
  return !isNaN(numIncome) && numIncome > 0;
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    if (rules.required && !validateRequired(value)) {
      errors[field] = 'Ce champ est obligatoire';
    } else if (rules.email && value && !validateEmail(value)) {
      errors[field] = 'Email invalide';
    } else if (rules.password && value && !validatePassword(value)) {
      errors[field] = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre';
    } else if (rules.phone && value && !validatePhoneNumber(value)) {
      errors[field] = 'Numéro de téléphone invalide';
    } else if (rules.min && value < rules.min) {
      errors[field] = `La valeur minimale est ${rules.min}`;
    } else if (rules.max && value > rules.max) {
      errors[field] = `La valeur maximale est ${rules.max}`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
