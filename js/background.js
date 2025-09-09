chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background recebeu:", message);
    sendResponse({ status: "ok" });
    return true;
});

