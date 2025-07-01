// offscreen.js

//console.log('offscreen.jsが実行されました。');

console.log('offscreen.jsが実行されました。')

const iframe = document.getElementById('kokofolia-frame');

iframe.onload = () => {
    console.log('Offscreen Document内のiframeの読み込みが完了しました。')
}

// iframeの読み込みに失敗したときに実行される処理
iframe.onerror = () => {
    console.error('iframeの読み込みに失敗しました。URLやネットワークを確認してください。');
};