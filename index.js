const TelegramBot = require('node-telegram-bot-api');
const webAppUrl = 'https://master--zesty-fenglisu-cc614f.netlify.app/'
const token = '6209889183:AAENYpshp9y6iYcsewi-nWfDpdO0cKpXdlU';
const express = require('express');
const cors = require('cors');
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появятся кнопки!', {
            reply_markup: {
                keyboard: [
                    [{'text': 'Нажми на меня!', web_app: {
                        url: webAppUrl + 'form'
                    }}]
                ]
            }
        })
    }

    else if(text === '/help') {
        await bot.sendMessage(chatId, 'Помощь!', {
            reply_markup: {
                inline_keyboard: [
                    [{'text': 'Сделать заказ!', web_app: {
                        url: webAppUrl
                    }}]
                ]
            }
        })
        }

    else {
        bot.sendMessage(chatId, 'Все доступные команды: \n/start - начать работу с ботом!');
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);

            await bot.sendMessage(chatId, 'Спасибо за заявку!');
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Еще раз спасибо!');
            });

        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId {
            type: 'article',
            id: queryId,
            title: "Успешная покупка",
            input_message_content: {message_text: "Поздравляю с покупкой" + totalPrice}
        });
        return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId {
            type: 'article',
            id: queryId,
            title: "Покупка неудалась!",
            input_message_content: {message_text: "Покупка неудалась!"}
        });
        return res.status(500).json({});
    }
});

const PORT = 8000;

app.listen(PORT, () => console.log('Server started on PORT ' + PORT));