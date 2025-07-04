const urlInput = document.getElementById('url-input');
const saveButton = document.getElementById('save-button');
const statusDiv = document.getElementById('status');

// ポップアップが開いたときに、保存済みのURLを読み込んで表示
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['roomUrl'], (result) => {
        if (result.roomUrl) {
            urlInput.value = result.roomUrl;
        }
    });
});

// 保存ボタンがクリックされたときの処理
saveButton.addEventListener('click', () => {
    const url = urlInput.value;
    // 簡単なURLチェック
    if (url && url.startsWith('https://ccfolia.com/rooms/')) {
        // 入力されたURLを'roomUrl'という名前で保存
        chrome.storage.local.set({ roomUrl: url }, () => {
            statusDiv.textContent = 'URLを保存しました！';
            // 変更をバックグラウンドに通知
            chrome.runtime.sendMessage({ type: 'url_updated' });
        });
    } else {
        statusDiv.textContent = '有効なココフォリアの部屋URLを入力してください。';
    }
});