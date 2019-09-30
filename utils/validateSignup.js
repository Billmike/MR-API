const validationCriteria = [
  {
    test: ({ username }) => username.trim() !== '',
    message: 'Please provide a username',
    fieldName: 'username',
  },
  {
    test: ({ password }) => password.trim() !== '' && password.length >= 8,
    message: 'Please enter a password that is at least 8 characters long',
    fieldName: 'password',
  },
];

const validateUserData = (userData) => {
  const errors = validationCriteria.reduce((messages, criterion) => {
    if (!criterion.test(userData)) {
      messages[criterion.fieldName] = criterion.message;
    }
    return messages;
  }, {});

  return {
    isValid: Object.entries(errors).length === 0,
    errors,
  };
};

module.exports = validateUserData;
