// ===== js/background.js (RESOLVIDO) =====
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background recebeu:", message);
    sendResponse({ status: "ok" });
    return true;
});

async function verificarLicenca(whatsappNumber) {
    try {
        const response = await fetch(`https://wxchpwltgfbpnanpjtwi.supabase.co/functions/v1/license-status?whatsapp=${whatsappNumber}`);
        const data = await response.json();
        return data.status === "active";
    } catch (error) {
        console.error("Erro ao verificar licença:", error);
        return false;
    }
}