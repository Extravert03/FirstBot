const axios = require('axios')
const cheerio = require('cheerio')
const {Telegraf, Markup} = require('telegraf')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)

const getHtml = async (url) => {
    const {data} = await axios.get(url)
    return cheerio.load(data)
}

const parse = async () => {
    const $ = await getHtml('https://banks.kg/rates')
    const dollarBuyRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
    const dollarSellRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(1) > td:nth-child(3)').text()
    const RubBuyRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(3) > td:nth-child(2)').text()
    const RubSellRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(3) > td:nth-child(3)').text()
    const EuroBuyRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(2) > td:nth-child(2)').text()
    const EuroSellRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(2) > td:nth-child(3)').text()
    const TengeBuyRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(4) > td:nth-child(2)').text()
    const TengeSellRate = $('#main > div.page > div > div.page-view > div.page-view-content.page-view__content.page-view__rates > div > div > div.col-md-8 > div > table > tbody > tr:nth-child(4) > td:nth-child(3)').text()
    return {dollarBuyRate: dollarBuyRate, dollarSellRate: dollarSellRate, RubBuyRate: RubBuyRate, RubSellRate: RubSellRate, EuroBuyRate: EuroBuyRate, EuroSellRate: EuroSellRate, TengeBuyRate:TengeBuyRate, TengeSellRate:TengeSellRate}
}



bot.start((ctx) => ctx.reply('Здравстуйте! Этот бот может отправлять вам сегодняшний средний курс валют в Кыргызстане. Для вызова напишите /info',))
bot.command('info', (ctx) => {
    ctx.reply('Средний курс валюты', Markup.inlineKeyboard(
        [
            [Markup.button.callback('Доллар', 'btn1')], [Markup.button.callback('Рубль', 'btn2')],
            [Markup.button.callback('Евро', 'btn3')], [Markup.button.callback('Тенге', 'btn4')]
        ]
    ))
})
bot.action('btn1', async (ctx) => {
    ctx.answerCbQuery('🎉' ,true)
    let dollarRates = await parse()
    let text = `Покупка ${dollarRates.dollarBuyRate}\nПродажа ${dollarRates.dollarSellRate}`
    try {
        ctx.reply(text)
    } catch (e) {
        console.error(e)
    }

})
bot.action('btn2', async (ctx) => {
     ctx.answerCbQuery('🎉', true)
    let rates = await parse()
    let text = `Покупка ${rates.RubBuyRate}\nПродажа ${rates.RubSellRate}`
    try {
        ctx.reply(text)
    } catch (e) {
        console.error(e)
    }

   bot.action('btn3', async (ctx) => {
        ctx.answerCbQuery('🎉', true)
        let rates =await parse()
        let text = `Покупка ${rates.EuroBuyRate}\nПродажа ${rates.EuroSellRate}`
        try {
            ctx.reply(text)
        }
        catch (e) {
            console.log(e)
        }
        bot.action('btn4' , async (ctx) => {
            ctx.answerCbQuery('🎉', true)
            let rates = await parse()
            let text = `Покупка ${rates.TengeBuyRate}\nПродажа ${rates.TengeSellRate}`
            try {
                ctx.reply(text)
            }
            catch (e) {
                console.log(e)
            }
        })
    })

})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))





