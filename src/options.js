document.addEventListener('DOMContentLoaded', async () => {
    const urlInput = document.getElementById('url-input');
    const addButton = document.getElementById('add-button');
    const urlList = document.getElementById('url-list');
    const statusDiv = document.getElementById('status')

    function displayUrls(urls = []) {
        urlList.innerHTML = '';
        urls.forEach((url, index) => {
            const li = document.createElement('li');
            li.innerHTML = '<span></span><button>削除</button>';
            li.querySelector('span').textContent = url;
            li.querySelector('button').addEventListener('click', () => removeUrl(index));
            urlList.appendChild(li);
        });
    };
    
    //urlを削除する関数
    async function removeUrl(indexToRemove) {
        const result = await chrome.storage.local.get(['roomUrls']);
        let currentUrls = result.roomUrls || [];
        currentUrls.splice(indexToRemove, 1);
        await chrome.storage.local.set({ roomUrls: currentUrls });
        displayUrls(currentUrls);
        chrome.runtime.sendMessage({ type: 'url_list_updated'});
    }

    //urlを追加する関数
    async function addUrl() {
        const newUrl = urlInput.value;
        if (newUrl && newUrl.startsWith('https://ccfolia.com/rooms/')){
            const result = await chrome.storage.local.get(['roomUrls']);
            let currentUrls = result.roomUrls || [];
            if (!currentUrls.includes(newUrl)) {
                currentUrls.push(newUrl);

                chrome.storage.local.set({ roomUrls: currentUrls }, () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                        statusDiv.textContent = 'エラー：保存に失敗しました。';
                    } else {
                        statusDiv.textContent = 'URLを追加しました！';
                        displayUrls(currentUrls);
                        urlInput.value = '';
                        chrome.runtime.sendMessage({ type: 'url_list_updated' });
                    }

                    setTimeout(() => { statusDiv.textContent = '' }, 3000)
                });
            } else {
                statusDiv.textContent = 'このURLは既に追加されています。';
                setTimeout(() => { statusDiv.textContent = '' }, 3000);
            }
        } else {
            statusDiv.textContent = 'ココフォリアの部屋URLを入力してください。';
            setTimeout(() => { statusDiv.textContent = '' }, 3000);
        }
    }

    const initialResult = await chrome.storage.local.get(['roomUrls']);
    displayUrls(initialResult.roomUrls);

    addButton.addEventListener('click', addUrl);
});