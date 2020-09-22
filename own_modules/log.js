const colors = {
  // https://github.com/shiena/ansicolor/blob/master/README.md
  _Notifications: {
    default: "\x1b[94m",
    error: "\x1b[41m"
  },
  _Crafting: {
    default: "\x1b[92m",
    error: "\x1b[42m"
  },
  _Skills: {
    default: "\x1b[92m",
    error: "\x1b[42m"
  },
  _Transfers: {
    default: "\x1b[93m",
    error: "\x1b[103m"
  },
  _Tax: {
    default: "\x1b[93m",
    error: "\x1b[103m"
  },
  _Wages: {
    default: "\x1b[93m",
    error: "\x1b[103m"
  },
  _Yourtrades: {
    default: "\x1b[93m",
    error: "\x1b[103m"
  },
  _Trades: {
    default: "\x1b[93m",
    error: "\x1b[103m"
  },
  _Logins: {
    default: "\x1b[32m",
    error: "\x1b[102m\x1b[30m"
  },
  _Property: {
    default: "\x1b[32m",
    error: "\x1b[102m\x1b[30m"
  },
  _Demographics: {
    default: "\x1b[32m",
    error: "\x1b[102m\x1b[30m"
  },
  _Government: {
    default: "\x1b[32m",
    error: "\x1b[102m\x1b[30m"
  },
  _Elections: {
    default: "\x1b[32m",
    error: "\x1b[102m\x1b[30m"
  },
  "#General": {
    default: "\x1b[0m",
    error: "\x1b[47m\x1b[30m"
  },

  general: {
    default: "\x1b[0m",
    error: "\x1b[47m\x1b[30m"
  },
  console: {
    default: "\x1b[96m",
    error: "\x1b[21m\x1b[47m\x1b[30m"
  }
};
class Log {
  static msg(text, source = "general") {
    let color = "";
    if (typeof colors[source] !== "undefined") {
      color = colors[source].default;
    } else {
      Log.error("Color for " + source + " not found");
      Log.msg(text, "general");
      return;
    }
    source = source.toUpperCase();
    console.log(
      color +
        "[" +
        source +
        "] " +
        new Date().toISOString() +
        ": " +
        text +
        (color == "" ? "" : "\x1b[0m")
    );
  }
  static error(text, source = "general") {
    let color = "";
    if (typeof colors[source] !== "undefined") {
      color = colors[source].error;
    } else {
      Log.error(text, "general");
      return;
    }
    source = source.toUpperCase();
    console.error(
      color +
        "[" +
        source +
        "] " +
        new Date().toISOString() +
        ": " +
        text +
        (color == "" ? "" : "\x1b[0m")
    );
  }
  static hex_to_text(buff) {
    buff = buff.toString("hex");
    buff = buff.toUpperCase();

    var zeichen = 0;
    var newString = " ";
    for (var i = 0; i < buff.length; i++) {
      zeichen++;
      newString += buff[i];
      if (zeichen == 2) {
        newString += " ";
        zeichen = 0;
      }
    }
    return newString;
  }
}
module.exports = Log;

