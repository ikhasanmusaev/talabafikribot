import bot from "./bot";

const RedisSession = require('telegraf-session-redis');
const Markup = require('telegraf/markup');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {leave} = Stage;

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

anketa.enter((ctx) => {
    ctx.reply(`Marhamat, F.I.O.ingizni kiriting.`);
});

anketa.on('text', (ctx) => {
    const name = ctx.message.text;

    if (name.length > 3) {
        ctx.session.name = name;
        ctx.scene.enter('question1');
    } else {
        ctx.reply('Iltimos 3 dan kop bolsin')
    }
});


question1.enter((ctx) => {
    ctx.reply(`Marhamat, kasbingizni kiriting.`);
});

question1.on('text', (ctx) => {
    const profession = ctx.message.text;

    if (profession.length > 3) {
        ctx.session.profession = profession;
        ctx.scene.enter('question2');
    } else {
        ctx.reply('Iltimos 3 dan kop bolsin')
    }
});

question2.enter((ctx) => {
    ctx.reply(`Marhamat, o'qish yoki ish joyingizni kiriting.`);
});

question2.on('text', (ctx) => {
    const university = ctx.message.text;

    if (university.length > 3) {
        ctx.session.university = university;
        ctx.scene.enter('question3');
    } else {
        ctx.reply('Iltimos 3 dan kop bolsin')
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
        return leave();
    } else {
        ctx.reply('Iltimos tanlang')
    }
});

question3.leave(ctx => {
    ctx.reply("Ma'lumotlaringiz uchun Rahmat!");
    ctx.reply(`Devoleped by @ikhasanmusaev`)
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

bot.startPolling();
