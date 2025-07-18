// service-worker.js
importScripts('config.js');


try {
    console.log("Service Worker: chrome.storageのテストを開始します。");
    if (chrome.storage && chrome.storage.local) {
        console.log("テスト成功: chrome.storage.local は存在します。");
    } else {
        console.error("テスト失敗: chrome.storage または chrome.storage.local が存在しません。");
    }
} catch (e) {
    console.error("テスト中に予期せぬエラー:", e);
}

let creating; // Offscreen Document作成中のロックフラグ

// Offscreen Documentをセットアップ（作成または再作成）する関数
async function setupOffscreenDocument() {
    // 既に作成処理が走っていれば、何もしない
    if (creating) {
        return;
    }
    creating = true;

    // 既にドキュメントが存在する場合は、一度閉じる

    if (await chrome.offscreen.hasDocument()) {
        await chrome.offscreen.closeDocument();
        if (IS_DEBUG_MODE === true) {
            console.log('Offscreen Documentを再作成します。');
        }
    } else {
        if (IS_DEBUG_MODE === true) {
            console.log('Offscreen Documentを作成します。');
        }
    }
    
    //URLをofffscreen.jsへjson形式で渡す
    const result = await chrome.storage.local.get(['roomUrls']);
    const urls = result.roomUrls || [];
    if (urls.length > 0){
        console.log(`${urls.length}件のルームを監視します。`);
    
        const params = new URLSearchParams();
        params.set('urls', JSON.stringify(urls));
        const offscreenUrl = chrome.runtime.getURL('offscreen.html') + '?' + params.toString();
        
        //Offscreen Documentを生成
        await chrome.offscreen.createDocument({
            url: offscreenUrl,
            reasons: ['IFRAME_SCRIPTING'],
            justification: 'バックアップでルームを監視するため',
        });
    } else {
        console.log("監視対象のURLが設定されていません。");
    }


    

    
    creating = false; // ロックを解除
}

// 拡張機能のインストール/更新時にセットアップを実行
chrome.runtime.onInstalled.addListener(setupOffscreenDocument);

// ブラウザの起動時にセットアップを実行
chrome.runtime.onStartup.addListener(setupOffscreenDocument);

// すべてのメッセージをここで一括して処理する
chrome.runtime.onMessage.addListener((message) => {
    // ポップアップからURL更新のメッセージを受け取った場合
    if (message.type === 'url_list_updated' ) {
        console.log('URLの更新を検知。Offscreen Documentを再作成します。');
        setupOffscreenDocument();
    }
    // コンテントスクリプトからチャット更新のメッセージを受け取った場合
    else if (message.type === 'kokofolia_update') {
        if(IS_DEBUG_MODE === true) {
            console.log('チャット更新のメッセージを受信。通知を作成します。');
        }
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon_notify.png',
            title: message.name || 'ココフォリア通知',
            message: message.message || '新しい書き込みがありました。'
        });
    }
});

//アイコンが左クリックされたときに設定ページを開く
chrome.action.onClicked.addListener((tab) => {
    chrome.runtime.openOptionsPage();
});