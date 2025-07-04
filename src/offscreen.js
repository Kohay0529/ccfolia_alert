// offscreen.js

//console.log('offscreen.jsが実行されました。');

console.log('offscreen.jsが実行されました。')

const iframe = document.getElementById('kokofolia-frame');

// 1. 自分自身のURLからパラメータを読み取る
const params = new URLSearchParams(window.location.search);
const roomUrl = params.get('url');

if (roomUrl) {
    console.log('Service Workerから受け取ったURL:', roomUrl);
    iframe.src = roomUrl;
} else {
    console.error('Service WorkerからURLが渡されませんでした。');
}

iframe.onload = () => {
    console.log('Offscreen Document内のiframeの読み込みが完了しました。')
}

// iframeの読み込みに失敗したときに実行される処理
iframe.onerror = () => {
    console.error('iframeの読み込みに失敗しました。URLやネットワークを確認してください。');
};