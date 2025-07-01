// offscreen.js

console.log('offscreen.jsが実行されました。');

// iframe要素を取得
const iframe = document.getElementById('kokofolia-frame');

// iframeの読み込みが完了したときに実行される処理
iframe.onload = () => {
    console.log('iframeの読み込みが完了しました。');
    console.log('5秒後にService Workerへメッセージを送信します。');

    // 5秒後にテストメッセージを送信
    setTimeout(() => {
        console.log('メッセージ送信中...');
        chrome.runtime.sendMessage({ type: 'kokofolia_update' });
    }, 5000);
};

// iframeの読み込みに失敗したときに実行される処理
iframe.onerror = () => {
    console.error('iframeの読み込みに失敗しました。URLやネットワークを確認してください。');
};