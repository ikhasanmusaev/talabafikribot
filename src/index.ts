const Markup = require('telegraf/markup');
import bot from "./bot";

require('dotenv').config();

const Scene = require('telegraf/scenes/base');

// Greeter scene
const greeter = new Scene('greeter');
greeter.enter((ctx) => ctx.reply('Hi'));

bot.start(async (ctx) =>{
    await ctx.reply('Salom. Siz ro`xatdan o`tish botidasiz.' +
                              '\n Ma`lumot olish uchun /help.');
    return ctx.reply('Ro`yxatdan o`tish uchun "ro`yxatdan o`tish"ni bosing.', Markup
        .keyboard(
        ['📝 Ro`yxatdan o`tish'])
        .oneTime()
        .resize()
        .extra()
    )
});
bot.help((ctx) => ctx.reply('Men Talabalar fikri kanali uchun yordamchi sifatida yaratilganman.'));

// bot.hears('📝 Ro`yxatdan o`tish', (ctx) => {
//
// });
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

// bot.command('old school', (ctx) => ctx.reply('Hello'))
// bot.command('modern', ({ reply }) => reply('Yo'))

bot.launch();
