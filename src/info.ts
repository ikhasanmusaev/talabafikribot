import bot from "./bot";

const LocalSession = require('telegraf-session-local');

bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

