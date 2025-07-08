// Deobfuscated Bot Code

const express = require("express"); const app = express(); const port = 3000;

app.get("/", (req, res) => { return res.sendFile("index.html"); });

app.listen(port, () => { return console.log("Server running on port 3000"); });

const mineflayer = require("mineflayer"); const { Movements, pathfinder, GoalBlock } = require("mineflayer-pathfinder"); const config = require("./config.json");

function createBot() { const bot = mineflayer.createBot({ username: config.auth.email, password: config.auth.password, auth: config.auth.type, host: config.server.host, port: config.server.port, version: config.server.version });

bot.loadPlugin(pathfinder); const defaultMove = require("mineflayer-pathfinder").Movements; const movements = new Movements(bot, bot.physics);

bot.physicsEnabled = false;

bot.on("spawn", () => { console.log("Bot spawned");

// Autologin
if (config.features.autologin.enabled) {
  console.log("Autologin enabled");
  const password = config.features.autologin.password;

  setTimeout(() => {
    bot.chat(`/register ${password} ${password}`);
    bot.chat(`/login ${password}`);
  }, 500);

  console.log(`Login/Register attempted with password`);
}

// Auto message
if (config.features.autosay.enabled) {
  console.log("Autosay enabled");
  const messages = config.features.autosay.messages;

  if (config.features.autosay.repeat) {
    const interval = config.features.autosay.interval;
    let index = 0;

    setInterval(() => {
      bot.chat(`${messages[index]}`);
      index = (index + 1) % messages.length;
    }, interval * 1000);
  } else {
    messages.forEach((msg) => {
      bot.chat(msg);
    });
  }
}

// Go to location
const goal = config.goto;
if (goal.enabled) {
  console.log(`Going to X:${goal.x} Y:${goal.y} Z:${goal.z}`);
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(new GoalBlock(goal.x, goal.y, goal.z));
}

// Autoeat
if (config.features.autoeat.enabled) {
  bot.options.start = true;
  if (config.features.autoeat.priority) {
    bot.options.priority = true;
  }
}

});

bot.on("end", () => { console.log(Bot ${bot.username} disconnected); });

bot.on("death", () => { console.log(Killed: ${bot.username}); });

// Auto-respawn if (config.features.respawn) { bot.on("respawn", () => { setTimeout(() => { createBot(); }, config.features.timeout); }); }

bot.on("error", (err) => { return console.log("Error:", ${err}); });

bot.on("kicked", (reason) => { return console.log(Kicked: ${reason}); }); }

createBot();

