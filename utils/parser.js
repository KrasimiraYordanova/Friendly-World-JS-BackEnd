function parseError(error) {
  if (error.name == "ValidationError") {
    return Object.values(error.errors).map((value) => value.message);
  } else if (Array.isArray(error)) {
    return error.map((err) => err.msg);
  } else {
    return error.message.split("\n");
  }
}

module.exports = {
  parseError,
};
 