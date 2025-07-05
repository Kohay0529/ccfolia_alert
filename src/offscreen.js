// offscreen.js
document.addEventListener('DOMContentLoaded', () => {
    //console.log('offscreen.jsが実行されました。');
    if (IS_DEBUG_MODE === true) {
        console.log('offscreen.jsが実行されました。')
    }

    
    const iframeContainer = document.getElementById('iframe-container');
    const params = new URLSearchParams(window.location.search);
    const urlsJson = params.get('urls');

    if (urlsJson) {
        const urls = JSON.parse(urlsJson);
        
        if (urls.length > 0 && iframeContainer) {
            console.log(`${urls.length}件のルームを監視します。`);
            console.log(urls);
            for (url_input of urls) {
                console.log("iframe要素を作成します");
                const iframe = document.createElement('iframe');
                iframe.src = url_input;
                iframeContainer.appendChild(iframe);
            }
        }
    } else {
        console.log("監視対象のURLが設定されていません。");
    }
})