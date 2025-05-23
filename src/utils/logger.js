// Simple logger using console.log only
const log = (message, ...optionalParams) => console.log(message, ...optionalParams);
const error = (message, ...optionalParams) => console.log(message, ...optionalParams);

module.exports = {
  log,
  error
};
