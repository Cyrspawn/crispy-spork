const express = require('express');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalBlock } = goals;
const config = require('./settings.json');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function createBot() {
  const bot = mineflayer.createBot({
    host: config.server.host,
    port: config.server.port,
    username: config.bot.username,
    auth: config.bot.auth,
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('Bot has spawned.');

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);

    // Optional: auto move
    const actions = ['jump', 'forward', 'back', 'left', 'right'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    bot.setControlState(randomAction, true);

    setTimeout(() => {
      bot.setControlState(randomAction, false);
    }, 3000 + Math.random() * 5000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message.toLowerCase() === 'hello') {
      bot.chat('Hello, I am alive!');
    }
  });

  bot.on('end', () => {
    console.log(`Bot ${bot.username} disconnected`);
    setTimeout(createBot, 5000);
  });

  bot.on('death', () => {
    console.log(`Killed: ${bot.username}`);
  });

  bot.on('error', (err) => {
    console.error('Bot error:', err);
  });
}

createBot();
