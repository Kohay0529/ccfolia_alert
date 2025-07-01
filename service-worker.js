const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

async function createOffscreenDocument() {
    if (await chrome.offscreen.hasDocument()) {
        console.log('Offscreen document already exists.');
        return;
    }

    await chrome.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: ['IFRAME_SCRIPTING'],
        justification: 'ココフォリアのDOMを監視するため',
    });
    console.log('Offscreen document created.');
}

// 拡張機能がインストールされたり更新されたりした時に実行
chrome.runtime.onInstalled.addListener(() => {
    createOffscreenDocument();
});

// ブラウザが起動したときに実行
chrome.runtime.onStartup.addListener(() => {
    createOffscreenDocument();
});

// offscreen.jsからのメッセージを受け取る
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'kokofolia_update') {
        console.log('ココフォリアに更新がありました！');
        // デスクトップ通知を出す
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'ココフォリア通知',
            message: '新しい書き込みがありました。'
        });
    }
});