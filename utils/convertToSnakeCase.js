const styleUnderscoreFormat = (propertyObject) => {
  const addUnderscoreAndConvertToLowercase = (match, offset) => `${offset > 0 ? '_' : ''} ${match.toLowerCase()}`;

  return Object.keys(propertyObject).map((props) => props.replace(/[A-Z]/g, addUnderscoreAndConvertToLowercase));
};

module.exports = {
  styleUnderscoreFormat,
};
