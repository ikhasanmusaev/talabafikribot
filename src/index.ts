const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
import bot from "./bot";

require('dotenv').config();

const Scene = require('telegraf/scenes/base');

// Greeter scene
const greeter = new Scene('greeter');
greeter.enter((ctx) => ctx.reply('Hi'));

bot.start((ctx) =>{
    ctx.reply('Salom. Siz ro`xatdan o`tish botidasiz. Ro`yxatdan o`tish uchun "ro`yxatdan o`tish"ni bosing.' + 
                              '\n Ma`lumot olish uchun /help.');
    return ctx.reply('Custom buttons keyboard', Markup
        .keyboard(
        ['📝 Ro`yxatdan o`tish'])//, '😎 Popular'], // Row1 with 2 buttons
        // ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
        // ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
        // ])
        .oneTime()
        .resize()
        .extra()
    )
});
bot.help((ctx) => ctx.reply('Men Talabalar fikri kanali uchun yordamchi sifatida yaratilganman.'));

bot.hears('📝 Ro`yxatdan o`tish', (ctx) => {
    ctx.reply('Yay!');
});

// bot.command('custom', ctx => {
//     return ctx.reply('Custom buttons keyboard', Markup
//       .keyboard([
//         ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
//         ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
//         ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
//       ])
//       .oneTime()
//       .resize()
//       .extra()
//     )
//   });

bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('modern', ({ reply }) => reply('Yo'))

bot.launch()
