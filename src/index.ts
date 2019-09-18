import bot from "./bot";
require('dotenv').config();

const RedisSession = require('telegraf-session-redis');
const Markup = require('telegraf/markup');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {leave} = Stage;

//redis-sessiya o'rnatish
const session = new RedisSession({
    store: {
        host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
        port: process.env.TELEGRAM_SESSION_PORT || 6379
    }
});

bot.use(session);

const anketa = new Scene('anketa');
const question1 = new Scene('question1');
const question2 = new Scene('question2');
const question3 = new Scene('question3');
const question4 = new Scene('question4');

//sahnalar boshlanishi
anketa.enter((ctx) => {
    ctx.reply(`Marhamat, Ism va familiyangizni kiriting?`);
});

anketa.on('text', (ctx) => {
    const name = ctx.message.text;

    if (name.length > 3) {
        ctx.session.name = name;
        ctx.scene.enter('question1');
    } else {
        ctx.reply(`Itimos, F.I.O.ingiz 3ta belgidan ko'p bo'lsin`)
    }
});


question1.enter((ctx) => {
    ctx.reply(`Kasbingiz?`);
});

question1.on('text', (ctx) => {
    const profession = ctx.message.text;

    if (profession.length > 3) {
        ctx.session.profession = profession;
        ctx.scene.enter('question2');
    } else {
        ctx.reply('Itimos kasbingiz 3ta belgidan ko\'p bo\'lsin')
    }
});

question2.enter((ctx) => {
    ctx.reply(`O'qish yoki ish joyingiz?`);
});

question2.on('text', (ctx) => {
    const university = ctx.message.text;

    if (university.length > 3) {
        ctx.session.university = university;
        ctx.scene.enter('question3');
    } else {
        ctx.reply('Itimos 3ta belgidan ko\'p kiriting')
    }
});

const cities: string[][] = [
    [`Qoraqalpog'iston Respublikasi`],
    [`Toshkent sh.`, `Toshkent v.`],
    [`Andijon v.`, `Namangan v.`, `Farg'ona v.`],
    [`Qashqadaryo v.`, `Surxandaryo v.`],
    [`Samarqand v.`, `Buxoro v.`, `Navoiy v.`],
    [`Xorazm v.`, `Jizzax v.`, `Sirdaryo v.`]
];

const plainCities = cities.reduce((arr, currRow) => {
    arr.push(...currRow);
    return arr;
}, []);

question3.enter((ctx) => {
    ctx.reply(`Qaysi viloyatdansiz?`);
    return ctx.reply(' Marhamat, tanlang.', Markup
        .keyboard(cities)
        .oneTime()
        .resize()
        .extra()
    )
});

question3.on('text', (ctx) => {
    const region = ctx.message.text;

    if (plainCities.includes(region)) {
        ctx.session.region = region;
        ctx.scene.leave();
    } else {
        ctx.reply('Iltimos tanlang')
    }
});

question3.leave(ctx => {
    ctx.reply("Ma'lumotlaringiz uchun Rahmat! \n Siz muofaqiyatli ro'yhatdan o'tdingiz, marhamat guruhga o'ting!\n");
    ctx.replyWithHTML(`<a href="https://t.me/joinchat/GxajLkVbXPYIMY3yw6wQXg">Guruhga o'tish</a>`)
});

const stage = new Stage();
stage.command('cancel', leave());
stage.register(anketa);
stage.register(question1);
stage.register(question2);
stage.register(question3);

bot.use(stage.middleware());
bot.command('anketa', (ctx) => {

});

let REG_BTN = '📝 Ro`yxatdan o`tish';

//
bot.start(async (ctx) =>{
    await ctx.reply('Salom. Siz ro`yxatdan o`tish botidasiz.' +
                              '\n Ma`lumot olish uchun /help.');
    return ctx.reply('Sizning ma\'lumotlaringiz sir saqlanishi kafolatlanadi. Marhamat, ro\'yhatdan o\'tish tugmasini bosing', Markup
        .keyboard(
        [REG_BTN])
        .oneTime()
        .resize()
        .extra()
    )
});

bot.help((ctx) => ctx.reply('Men Talabalar fikri guruhi uchun yordamchi sifatida yaratilganman.'));

bot.hears(REG_BTN, (ctx) => {
    ctx.scene.enter('anketa');
});

bot.on('text', ctx =>
    ctx.reply('Ro`yxatdan o`tish uchun "Ro`yxatdan o`tish"ni bosing.')
);

bot.startPolling();
