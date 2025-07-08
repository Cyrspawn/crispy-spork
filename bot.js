const mineflayer = require('mineflayer');
const config = require('./settings.json');

function createBot() {
  const bot = mineflayer.createBot({
    username: config["bot-account"].username,
    password: config["bot-account"].password || undefined,
    auth: config["bot-account"].type,
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version
  });

  bot.once('spawn', () => {
    console.log(`[+] Bot spawned as ${bot.username}`);

    // Auto-auth
    if (config.utils["auto-auth"].enabled) {
      bot.chat(`/register ${config.utils["auto-auth"].password} ${config.utils["auto-auth"].password}`);
      bot.chat(`/login ${config.utils["auto-auth"].password}`);
    }

    // Position Movement
    if (config.position.enabled) {
      bot.setControlState('forward', true);
      bot.setControlState('jump', true);
      bot.lookAt({
        x: config.position.x,
        y: config.position.y,
        z: config.position.z
      });
    }

    // Chat Messages
    if (config.utils["chat-messages"].enabled) {
      let index = 0;
      setInterval(() => {
        bot.chat(config.utils["chat-messages"].messages[index]);
        if (config.utils["chat-messages"].repeat) {
          index = (index + 1) % config.utils["chat-messages"].messages.length;
        }
      }, config.utils["chat-messages"]["repeat-delay"] * 1000);
    }
  });

  bot.on("end", () => {
    console.log(`[-] Bot ${bot.username} disconnected`);
    if (config.utils["auto-reconnect"]) {
      setTimeout(() => {
        createBot();
      }, config.utils["auto-reconnect-delay"]);
    }
  });

  bot.on("death", () => {
    console.log(`[!] Killed: ${bot.username}`);
  });

  bot.on("error", (err) => {
    console.log(`[!] Error: ${err.message}`);
  });
}

createBot();
