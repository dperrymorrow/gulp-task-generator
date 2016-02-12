
module.exports = {
  dir: function (name) {
    if (name.length ===0 || /[a-zA-Z0-9-_]/g.test(name) === false) {
      return "Not a valid directory name. Allowed characters are [A-Z], [a-z], [0-9], -, and _";
    }
    return true;
  },

  falseIfNone: function (answer) {
    return answer === 'None' ? false : answer;
  }
}