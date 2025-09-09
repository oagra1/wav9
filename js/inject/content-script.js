function Xe() {
    // DEBUG: Listar todas as chaves do localStorage
    console.log("=== DEBUG localStorage keys ===");
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        const value = window.localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }
    console.log("=== FIM DEBUG ===");
    
    let Be = "";
    
    try {
        let phoneNumber = "";
        
        // MÉTODO 1: Chaves originais (manter compatibilidade)
        if (window.localStorage.getItem("last-wid")) {
            phoneNumber = window.localStorage.getItem("last-wid");
            Be = phoneNumber.split("@")[0].substring(1);
        } 
        else if (window.localStorage.getItem("last-wid-md")) {
            phoneNumber = window.localStorage.getItem("last-wid-md");
            Be = phoneNumber.split(":")[0].substring(1);
        }
        
        // MÉTODO 2: Buscar chaves que contenham "wid" ou "user"
        else {
            const keys = Object.keys(window.localStorage);
            
            // Procurar por chaves com padrões conhecidos
            const widKeys = keys.filter(key => 
                key.includes('wid') || 
                key.includes('user') || 
                key.includes('phone') ||
                key.includes('jid') ||
                key.includes('me')
            );
            
            console.log("Chaves encontradas com padrão:", widKeys);
            
            // Tentar extrair número das chaves encontradas
            for (const key of widKeys) {
                const value = window.localStorage.getItem(key);
                if (value && value.includes('@')) {
                    // Formato: 5511999999999@c.us
                    const match = value.match(/(\d{10,15})@/);
                    if (match) {
                        Be = match[1];
                        console.log(`Número encontrado na chave ${key}: ${Be}`);
                        break;
                    }
                }
                if (value && value.includes(':')) {
                    // Formato: 55:11999999999:XX
                    const match = value.match(/(\d{10,15}):/);
                    if (match) {
                        Be = match[1];
                        console.log(`Número encontrado na chave ${key}: ${Be}`);
                        break;
                    }
                }
            }
        }
        
        // MÉTODO 3: Usar WAPI se disponível
        if (!Be && window.WAPI && window.WAPI.getMe) {
            try {
                const me = window.WAPI.getMe();
                if (me && me.wid && me.wid.user) {
                    Be = me.wid.user;
                    console.log("Número obtido via WAPI:", Be);
                }
            } catch (wapiError) {
                console.log("Erro ao usar WAPI:", wapiError);
            }
        }
        
        // MÉTODO 4: Último recurso - procurar em window.Store
        if (!Be && window.Store && window.Store.User && window.Store.User.Me) {
            try {
                const me = window.Store.User.Me;
                if (me.wid && me.wid.user) {
                    Be = me.wid.user;
                    console.log("Número obtido via Store.User.Me:", Be);
                }
            } catch (storeError) {
                console.log("Erro ao usar Store:", storeError);
            }
        }
        
    } catch (err) {
        console.log("content-script:get phone number error", err);
    }
    
    // Log final
    console.log("userPhoneNum final:", Be);
    
    chrome.storage.local.set({ userPhoneNum: Be, loadTimes: 1 }).then(() => {});
    b(Y["e"], { userPhoneNum: Be }, "background");
    return Be;
}

function tryExtractPhoneWithRetry() {
    let attempts = 0;
    const maxAttempts = 5;
    
    const intervalId = setInterval(() => {
        attempts++;
        const phone = Xe();
        
        if (phone || attempts >= maxAttempts) {
            clearInterval(intervalId);
            if (phone) {
                console.log(`Número obtido na tentativa ${attempts}: ${phone}`);
            } else {
                console.log("Falha ao obter número após todas as tentativas");
            }
        }
    }, 2000);
}

window.onload = function() {
    tryExtractPhoneWithRetry();
    let e = Xe();
    const t = {
        browserInfo: Object(X["a"])(),
        platform: window.navigator.platform,
        language: window.navigator.language,
        phoneNum: e
    };
    chrome.storage.local.set({ ...t }).then(() => {});
    chrome.storage.local.remove(["isShowNoSubscription", "isOneNoSubscription", "isShowNoActive", "actionCodeList"]);
    et(e, t);
};