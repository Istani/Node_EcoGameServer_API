process.chdir(__dirname);
const package_info = require("./package.json");
var software = package_info.name + " (V " + package_info.version + ")";
console.log(software);
console.log("=".repeat(software.length));

const fs = require("fs");
var envpath = __dirname + "/.env";
var config = require("dotenv").config({ path: envpath });
var config_example = "";
if (fs.existsSync(".env")) {
  for (var attributename in config.parsed) {
    config_example += attributename + "=\r\n";
  }
  fs.writeFileSync(".env.example", config_example);
}

const base_url = "http://" + process.env.SERVER_IP + ":" + process.env.SERVER_WEB_PORT + "/";
const request = require("request");
const striptags = require("striptags");
const moment = require("moment");

async function save_file(name, data) {
  try {
    var filename = "./tmp/" + name + ".json";
    var fs = require("fs");
    if (fs.existsSync(filename)) {
      await fs.unlinkSync(filename);
    }
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

var settings = {};
function load_settings() {
  try {
    settings = require("./tmp/settings.json");
  } catch (error) {
    console.error("Settings", "Couldn't load!");
    settings = {};
    settings.timestamp_last_chat = 0;
  }
}
function save_settings() {
  var data = JSON.stringify(settings, null, 2);
  fs.writeFileSync("./tmp/settings.json", data);
  load_settings();
}
load_settings();

async function get_chat() {
  //request.setTimeout(0);
  request({ url: base_url + "api/v1/chat", timeout: 1000*60*60*60 }, async function(error, response, body) {
    if (error) {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    } else {
      var data = JSON.parse(body); // Print the HTML for the Google homepage.
      await save_file("chat", data);
      for (let data_index = 0; data_index < data.length; data_index++) {
        const element = data[data_index];
        if (element.Timestamp > settings.timestamp_last_chat) {
          element.Text = striptags(element.Text);
          if (element.Text.startsWith("You gained")) {
            //continue;
          }
          if (element.Text.indexOf("Blocked!") > 1) {
            //continue;
          }
          if (element.Text.indexOf("until completion.") > 1) {
            //continue;
          }
          if (element.Tag == "_Logins") {
           // continue;
          }
          var new_line = {
            date: element.Timestamp,
            text: element.Text
          };
          console.log(JSON.stringify(new_line));
          //console.log("");
          settings.timestamp_last_chat = element.Timestamp;
          save_settings();
          //await get_info();
        }
      }
    }
    get_info();
    setTimeout(get_chat, 1000 * 10);
  });
}
get_chat();

async function get_info() {
  request(base_url + "info", async function(error, response, body) {
    if (error) {
      //console.error("error:", error); // Print the error if one occurred
      //console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    } else {
      var data = JSON.parse(body); // Print the HTML for the Google homepage.
      await save_file("info", data);
      //if (data.TimeSinceStart < settings.timestamp_last_chat) {
      //  settings.timestamp_last_chat = 0;
      //  save_settings();
      //}

      await get_playstyles();
      await get_playerstats();
    }
  });
}

async function get_playstyles() {
  request(base_url + "api/v1/analysis/playstyles", async function(error, response, body) {
    if (error) {
      //console.error("error:", error); // Print the error if one occurred
      //console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    } else {
      var data = JSON.parse(body); // Print the HTML for the Google homepage.
      await save_file("playstyles", data);
      for (let i_playstyles = 0; i_playstyles < data.length; i_playstyles++) {
        const element = data[i_playstyles];
        await get_playerstats_user(element.Username);
      }
    }
  });
}
async function get_playerstats_user(username) {
  request(base_url + "api/v1/analysis/playstyles/" + username, async function(error, response, body) {
    if (error) {
      //console.error("error:", error); // Print the error if one occurred
      //console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    } else {
      var data = JSON.parse(body); // Print the HTML for the Google homepage.
      await save_file("playstyles_" + username, data);
    }
  });
}

async function get_playerstats() {
  request(base_url + "api/v1/analysis/playerstats", async function(error, response, body) {
    if (error) {
      //console.error("error:", error); // Print the error if one occurred
      //console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    } else {
      var data = JSON.parse(body); // Print the HTML for the Google homepage.
      await save_file("playerstats", data);
    }
  });
}
