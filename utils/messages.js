const moment = require("moment");

function formatMessage(username, text, type) {
  return {
    username,
    text,
    type,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
