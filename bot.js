const express = require("express"); const mineflayer = require("mineflayer"); const { pathfinder, Movements, goals: { GoalBlock } } = require("mineflayer-pathfinder"); const Vec3 = require("vec3"); const config = require("./settings.json");

const app = express(); const port = 3000;

app.listen(port, () => { return console.log("Server running on port 3000"); });

function createBot() { const bot = mineflayer.createBot({ host: config.server.ip, port: config.server.port, username: config["bot-account"].username, password: config["bot-account"].password, auth: config["bot-account"].type, version: config.server.version });

bot.loadPlugin(pathfinder);

bot.once("spawn", () => { console.log("Bot spawned successfully");

if (config.utils["auto-auth"].enabled) {
  const password = config.utils["auto-auth"].password;
  setTimeout(() => {
    bot.chat(`/register ${password} ${password}`);
    bot.chat(`/login ${password}`);
  }, 500);
}

if (config.utils["chat-messages"].enabled) {
  const messages = config.utils["chat-messages"].messages;
  if (config.utils["chat-messages"].repeat) {
    let index = 0;
    const delay = config.utils["chat-messages"]["repeat-delay"] * 1000;
    setInterval(() => {
      bot.chat(messages[index]);
      index = (index + 1) % messages.length;
    }, delay);
  } else {
    messages.forEach(msg => bot.chat(msg));
  }
}

if (config.position.enabled) {
  console.log(`Moving to: ${config.position.x}, ${config.position.y}, ${config.position.z}`);
  const mcData = require("minecraft-data")(bot.version);
  const movements = new Movements(bot, mcData);
  bot.pathfinder.setMovements(movements);
  bot.pathfinder.setGoal(new GoalBlock(config.position.x, config.position.y, config.position.z));
}

if (config.utils["anti-afk"].enabled) {
  bot.setControlState("jump", true);
  if (config.utils["anti-afk"].sneak) {
    bot.setControlState("sneak", true);
  }
}

});

bot.on("end", () => { console.log(Bot ${bot.username} disconnected); if (config.utils["auto-reconnect"]) { setTimeout(() => { createBot(); }, config.utils["auto-reconnect-delay"]); } });

bot.on("death", () => { console.log(Killed: ${bot.username}); });

bot.on("kicked", reason => { console.log(Kicked: ${reason}); });

bot.on("error", err => { console.log(Error: ${err}); }); }

createBot();

