// index.js

// Response for Uptime Robot and GAS
require('dotenv').config();
const express = require('express');
const { isLocked, createLock, clearLockOnExit } = require('./lock'); // 多重起動防止ロック

// ★ 多重起動を防止する処理
if (isLocked()) {
    console.log('⚠ Botはすでに起動しています。重複起動を防ぐため終了します。');
    process.exit(0);
}
createLock();
clearLockOnExit();

// ★ PORT は Koyeb や Render が自動的に指定する環境変数に対応
const PORT = process.env.PORT || 8080; // Koyebでは8080を推奨

// Expressアプリの作成
const app = express();

// POSTリクエスト用のボディパーサー
app.use(express.urlencoded({ extended: true }));

// Webサーバー（GASやUptimeRobot用）
app.post('/', (req, res) => {
    const dataObject = req.body;
    if (!dataObject) {
        res.status(400).send('No post data');
        return;
    }
    if (dataObject.type === 'wake') {
        res.send('Woke up via POST');
        return;
    }
    res.send('POST received');
});

app.get('/', (req, res) => {
    res.status(200).type('text/plain').send('Discord Bot is active now\n');
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`✅ HTTPサーバー起動中：ポート ${PORT}`);
});

// Botトークンが設定されていなければ終了
if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('❌ DISCORD_BOT_TOKEN が設定されていません！');
    process.exit(1);
}

// Botの本体起動
require('./bot.js');