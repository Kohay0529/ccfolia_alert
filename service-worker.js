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

chrome.runtime.onStartup.addListener(createOffscreenDocument);
self.oninstall = () => {
    createOffscreenDocument();
};

chrome.runtime,onmessage.addListener((message) => {
    if (message.tye === 'kokofolia_update') {
        console.log('ココフォリアに更新がありました！');
        //通知を出す
        chrome.notifications.creaate({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'ココフォリア通知',
            message: '新しい書き込みがありました。'
        });
    }
});