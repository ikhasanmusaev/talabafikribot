import bot from "./bot";

const LocalSession = require('telegraf-session-local');

// bot.use((new LocalSession({ database: 'example_db.json' })).middleware());
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { leave } = Stage;

const property = 'data';

const localSession = new LocalSession({
    database: 'example_db.json',
    property: 'session',
    storage: LocalSession.storageFileAsync,
    format: {
        serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
        deserialize: (str) => JSON.parse(str),
    },
    state: { messages: [] }
});

localSession.DB.then(DB => {
    console.log('Current LocalSession DB:', DB.value());
    // console.log(DB.get('sessions').getById('1:1').value())
});

bot.use(localSession.middleware(property));

// bot.on('text', (ctx, next) => {
//     ctx[property].counter = ctx[property].counter || 0;
//     ctx[property].counter++;
//     ctx.replyWithMarkdown(`Counter updated, new value: \`${ctx[property].counter}\``);
//     ctx[property + 'DB'].get('messages').push([ctx.message]).write();
//     // `property`+'DB' is a name of property which contains lowdb instance, default = `sessionDB`, in current example = `dataDB`
//     // ctx.dataDB.get('messages').push([ctx.message]).write()
//
//     return next()
// });

bot.command('/stats', (ctx) => {
    let msg = `Using session object from [Telegraf Context](http://telegraf.js.org/context.html) (\`ctx\`), named \`${property}\`\n`;
    msg += `Database has \`${ctx[property].counter}\` messages from @${ctx.from.username || ctx.from.id}`;
    ctx.replyWithMarkdown(msg)
});
bot.command('/remove', (ctx) => {
    ctx.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(ctx[property])}\``);
    // Setting session to null, undefined or empty object/array will trigger removing it from database
    ctx[property] = null
});



// Greeter scene
const anketa = new Scene('anketa');
anketa.enter((ctx) => {
    ctx.reply(`Marhamat ismingizni kiriting.`);

});
anketa.leave((ctx) => ctx.reply('Bye'));
anketa.hears(/hi/gi, leave());
// anketa.on('message', (ctx) => ctx.reply('Send `hi`'));
anketa.on('text', (ctx, next) => {
    ctx[property].counter = ctx[property].counter || 0;
    ctx[property].counter++;
    ctx.replyWithMarkdown(`Counter updated, new value: \`${ctx[property].counter}\``);
    ctx[property + 'DB'].get('messages').push([ctx.message]).write();
    // `property`+'DB' is a name of property which contains lowdb instance, default = `sessionDB`, in current example = `dataDB`
    // ctx.dataDB.get('messages').push([ctx.message]).write()

    return next()
});

// Create scene manager
const stage = new Stage();
stage.command('cancel', leave());

// Scene registration
stage.register(anketa);

// const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());
bot.use(stage.middleware());
bot.command('anketa', (ctx) => ctx.scene.enter('anketa'));

bot.startPolling();
