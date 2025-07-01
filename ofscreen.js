//５秒後にテストメッセージを送る
setTimeout(() => {
    chrome.runtime.sendMessage({ type: 'kokfolia_update' });
}, 5000);