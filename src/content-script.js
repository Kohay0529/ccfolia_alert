
if (IS_DEBUG_MODE === true) {
    console.log('コンテントスクリプトがココフォリアのページに挿入されました。');
}

// 監視セットアップ処理を関数にまとめる
const setupObserver = () => {
    let chatLogContainer = null;
    const allHeaders = document.querySelectorAll('header');
    for (const header of allHeaders) {
        const h6 = header.querySelector('h6');
        if (h6 && h6.textContent.includes('ルームチャット')) {
            const parentPanel = header.parentElement;
            chatLogContainer = parentPanel.querySelector('ul.MuiList-root');
            break;
        }
    }

    if (!chatLogContainer) {
        return false;
    }

    if (IS_DEBUG_MODE === true) {
        console.log('コンテントスクリプトがチャットログのコンテナを発見。監視を開始します。');
    }

    const callback = (mutationsList, observer) => {
        // 変更を検知したら、とりあえず一度だけ通知を送るようにする
        if (IS_DEBUG_MODE === true) {
            console.log('チャットの更新を検知しました！');
        }
            
        chrome.runtime.sendMessage({ type: 'kokofolia_update' });

        // 大量の変更が一度に発生する場合があるため、一度検知したら監視を一度停止し、再設定する
        observer.disconnect();
        // 1秒後に再度監視を開始する
        setTimeout(() => {
            if (setupObserver()) {
                if (IS_DEBUG_MODE === true) {
                    console.log('監視を再開しました。');
                }
            }
        }, 1000);
    };

    const observer = new MutationObserver(callback);
    observer.observe(chatLogContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    return true;
};

// ポーリング処理
const intervalId = setInterval(() => {
    // setupObserverが成功したら（コンテナを見つけたら）
    if (setupObserver()) {
        // ポーリングを停止
        clearInterval(intervalId);
    }
}, 1000); // 1秒ごと