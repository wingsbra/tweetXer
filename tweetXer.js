/*
 * ============================================================================
 * TweetXer Fork v7.7 (Smart Cache & Exponential Probe)
 * Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude
 * ============================================================================
 * Finalidade : excluir os posts da conta logada no x.com o mais rápido possível.
 * Uso : abra x.com logado > F12 (Console) > cole este arquivo inteiro > Enter.
 * Se o Chrome bloquear a colagem, digite "allow pasting", Enter, e cole de novo.
 * ============================================================================
 */

(() => {
    'use strict';

    const i18n = {
        "pt": {
            "title": "TweetXer Fork v7.7",
            "credit1": "Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude",
            "credit2": "Base: <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" style=\"color:#1da1f2;text-decoration:none;\">TweetXer, de Luca Hammer</a>",
            "kofi_btn": "☕ Se gostou, doe um café se quiser",
            "tab_file": "Backup (Arquivo)",
            "tab_live": "Live (Feed)",
            "panel_file_desc": "Selecione <code>tweet-headers.js</code> ou <code>tweets.js</code> do backup oficial.",
            "skip_rt": "Pular Retweets (requer tweets.js)",
            "smart_skip": "Sonda Exponencial (Acelera se já usou outro app)",
            "keep_days": "Preservar recentes (dias):",
            "keep_likes": "Preservar populares (curtidas):",
            "cache_info": "Memória: {n} já excluídos",
            "btn_clear": "Limpar",
            "panel_live_desc": "Use a aba <code>/with_replies</code> do seu perfil. O script rola o feed e exclui posts visíveis.",
            "btn_profile": "Abrir meu perfil",
            "speed": "Velocidade:",
            "spd_normal": "Normal (1x)",
            "spd_turbo": "Turbo (3x)",
            "ready_notice": "Pronto. Carregue o arquivo ou escolha Live.",
            "log_title": "Registro (CSV guarda todos)",
            "th_id": "ID do post (Link)",
            "th_status": "Status",
            "btn_start": "Iniciar Exclusão",
            "btn_stop": "Parar",
            "btn_paused": "Pausado ({m}m) - Parar",
            "rate_limit_log": "Rate Limit - Pausa de {m}m",
            "btn_export": "Exportar CSV",
            "no_file": "Nenhum arquivo carregado.",
            "finished": "Processo concluído!",
            "status_ghost": "Já não existia",
            "log_probe": "Sonda: Testando pulo de {n} IDs...",
            "log_probe_ok": "Sonda: Sucesso! {n} fantasmas pulados. Dobrando pulo...",
            "log_probe_fail": "Sonda: Encontrou tweet real. Ajustando fronteira..."
        },
        "en": {
            "title": "TweetXer Fork v7.7",
            "credit1": "Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude",
            "credit2": "Base: <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" style=\"color:#1da1f2;text-decoration:none;\">TweetXer by Luca Hammer</a>",
            "kofi_btn": "☕ If you liked it, buy me a coffee",
            "tab_file": "Backup (File)",
            "tab_live": "Live (Feed)",
            "panel_file_desc": "Select <code>tweet-headers.js</code> or <code>tweets.js</code> from your official backup.",
            "skip_rt": "Skip Retweets (requires tweets.js)",
            "smart_skip": "Exponential Probe (Fast-forward if used another app)",
            "keep_days": "Keep recent (days):",
            "keep_likes": "Keep popular (likes):",
            "cache_info": "Memory: {n} already deleted",
            "btn_clear": "Clear",
            "panel_live_desc": "Use the <code>/with_replies</code> tab. The script scrolls and deletes visible posts.",
            "btn_profile": "Open my profile",
            "speed": "Speed:",
            "spd_normal": "Normal (1x)",
            "spd_turbo": "Turbo (3x)",
            "ready_notice": "Ready. Load a file or choose Live mode.",
            "log_title": "Log (CSV keeps all)",
            "th_id": "Post ID (Link)",
            "th_status": "Status",
            "btn_start": "Start Deletion",
            "btn_stop": "Stop",
            "btn_paused": "Paused ({m}m) - Stop",
            "rate_limit_log": "Rate Limit - Paused for {m}m",
            "btn_export": "Export CSV",
            "no_file": "No file loaded.",
            "finished": "Process finished!",
            "status_ghost": "Already gone",
            "log_probe": "Probe: Testing jump of {n} IDs...",
            "log_probe_ok": "Probe: Success! {n} ghosts skipped. Doubling jump...",
            "log_probe_fail": "Probe: Hit real tweet. Adjusting boundary..."
        },
        "es": {
            "title": "TweetXer Fork v7.7",
            "credit1": "Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude",
            "credit2": "Base: <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" style=\"color:#1da1f2;text-decoration:none;\">TweetXer de Luca Hammer</a>",
            "kofi_btn": "☕ Si te gustó, invítame un café si quieres",
            "tab_file": "Respaldo (Archivo)",
            "tab_live": "Live (Feed)",
            "panel_file_desc": "Selecciona <code>tweet-headers.js</code> o <code>tweets.js</code> de tu respaldo oficial.",
            "skip_rt": "Omitir Retweets (requiere tweets.js)",
            "smart_skip": "Sonda Exponencial (Acelera si usaste otra app)",
            "keep_days": "Conservar recientes (días):",
            "keep_likes": "Conservar populares (likes):",
            "cache_info": "Memoria: {n} ya eliminados",
            "btn_clear": "Limpiar",
            "panel_live_desc": "Usa la pestaña <code>/with_replies</code>. El script se desplaza y elimina posts.",
            "btn_profile": "Abrir mi perfil",
            "speed": "Velocidad:",
            "spd_normal": "Normal (1x)",
            "spd_turbo": "Turbo (3x)",
            "ready_notice": "Listo. Carga un archivo o elige Live.",
            "log_title": "Registro (CSV guarda todos)",
            "th_id": "ID del post (Enlace)",
            "th_status": "Estado",
            "btn_start": "Iniciar",
            "btn_stop": "Detener",
            "btn_paused": "Pausado ({m}m) - Detener",
            "rate_limit_log": "Rate Limit - Pausa de {m}m",
            "btn_export": "Exportar CSV",
            "no_file": "Ningún archivo cargado.",
            "finished": "¡Proceso terminado!",
            "status_ghost": "Ya no existía",
            "log_probe": "Sonda: Probando salto de {n} IDs...",
            "log_probe_ok": "Sonda: ¡Éxito! {n} fantasmas saltados. Doblando salto...",
            "log_probe_fail": "Sonda: Encontró tweet real. Ajustando frontera..."
        }
    };

    let lang = 'en';
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('pt')) lang = 'pt';
    else if (navLang.startsWith('es')) lang = 'es';
    const t = (key) => i18n[lang][key] || i18n['en'][key] || key;

    // --- Core Functions ---
    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
    };

    const generateTransactionId = () => {
        const bytes = new Uint8Array(95);
        crypto.getRandomValues(bytes);
        return Array.from(bytes).map(x => {
            const i = Math.floor((x / 255) * 61);
            return String.fromCharCode(i + (i > 9 ? (i > 35 ? 61 : 55) : 48));
        }).join('');
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const getTweetAgeDays = (id) => {
        const epoch = 1288834974657n;
        try {
            const tweetTime = Number((BigInt(id) >> 22n) + epoch);
            return (Date.now() - tweetTime) / (1000 * 60 * 60 * 24);
        } catch (e) { return 99999; }
    };

    // --- Smart Cache System ---
    const loadCache = () => {
        try { return new Set(JSON.parse(localStorage.getItem('tx_deleted_cache') || '[]')); }
        catch(e) { return new Set(); }
    };
    const saveCache = (cacheSet) => {
        try { localStorage.setItem('tx_deleted_cache', JSON.stringify([...cacheSet])); }
        catch(e) { console.warn("Cache cheio"); }
    };

    const state = {
        mode: 'file',
        ids: [],
        currentIndex: 0,
        running: false,
        stats: { total: 0, ok: 0, fail: 0 },
        logs: [],
        deletedCache: loadCache(),
        ct0: getCookie('ct0'),
        bearer: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        username: ''
    };

    const detectUsername = () => {
        const match = location.pathname.match(/^\/([a-zA-Z0-9_]+)/);
        if (match && !['i','home','explore','notifications','messages'].includes(match[1])) {
            state.username = match[1];
        }
    };
    detectUsername();

    // --- API Calls ---
    const unretweet = async (id) => {
        const url = 'https://x.com/i/api/graphql/iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet';
        const body = JSON.stringify({ variables: { source_tweet_id: id, dark_request: false }, queryId: "iQtK4dl5hBmXewYZuEOKVw" });
        const headers = { 'authorization': state.bearer, 'content-type': 'application/json', 'x-csrf-token': state.ct0, 'x-client-transaction-id': generateTransactionId(), 'x-twitter-active-user': 'yes', 'x-twitter-auth-type': 'OAuth2Session' };
        try {
            const res = await fetch(url, { method: 'POST', headers, body, credentials: 'include' });
            return { status: res.status };
        } catch (e) { return { status: 0 }; }
    };

    const deleteTweet = async (id) => {
        const url = 'https://x.com/i/api/graphql/VaenaVgh5q5ih7kvyVjgtg/DeleteTweet';
        const body = JSON.stringify({ variables: { tweet_id: id, dark_request: false }, queryId: "VaenaVgh5q5ih7kvyVjgtg" });
        const headers = { 'authorization': state.bearer, 'content-type': 'application/json', 'x-csrf-token': state.ct0, 'x-client-transaction-id': generateTransactionId(), 'x-twitter-active-user': 'yes', 'x-twitter-auth-type': 'OAuth2Session' };
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        
        try {
            const res = await fetch(url, { method: 'POST', headers, body, credentials: 'include', signal: controller.signal });
            clearTimeout(timeout);
            
            if (res.status === 429) return { status: 429, reset: parseInt(res.headers.get('x-rate-limit-reset'), 10) };
            
            let data = null;
            try { data = await res.json(); } catch(e) {}

            if (res.status === 403 || (data && data.errors && data.errors.some(e => e.message.includes('NotAuthorizedForResource')))) {
                const unrtRes = await unretweet(id);
                if (unrtRes.status === 200) return { status: 200, type: 'unretweet' };
                return { status: 403, error: 'Forbidden' };
            }

            if (data && data.errors && data.errors.length > 0) {
                const errMsg = data.errors[0].message || "";
                if (errMsg.includes("No status found") || errMsg.includes("not found")) {
                    return { status: 404, type: 'ghost' };
                }
                return { status: res.status, error: errMsg };
            }

            return { status: res.status };
        } catch (e) {
            clearTimeout(timeout);
            return { status: 0, error: e.message };
        }
    };

    // --- UI Injection ---
    if (document.getElementById('tx_panel')) document.getElementById('tx_panel').remove();

    const uiHTML = `
    <div id="tx_panel" style="position:fixed; top:20px; right:20px; width:400px; background:#ffffff; color:#333; border:1px solid #e1e8ed; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.15); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; z-index:999999; display:flex; flex-direction:column; overflow:hidden; transition:all 0.3s ease;">
        <div id="tx_header" style="background:#f5f8fa; padding:12px 16px; border-bottom:1px solid #e1e8ed; display:flex; justify-content:space-between; align-items:center; font-weight:bold; cursor:move;">
            <span>${t('title')}</span>
            <div>
                <button id="tx_min" style="background:transparent; border:none; cursor:pointer; font-weight:bold; color:#657786;">_</button>
                <button id="tx_close" style="background:transparent; border:none; cursor:pointer; font-weight:bold; color:#657786; margin-left:8px;">X</button>
            </div>
        </div>
        <div id="tx_body" style="padding:16px; overflow-y:auto; max-height:80vh;">
            
            <div style="font-size:11px; color:#657786; margin-bottom:12px; line-height:1.4;">
                ${t('credit1')}<br>${t('credit2')}
                <div style="margin-top:8px;">
                    <a href="https://ko-fi.com/V7V3BQZHM" target="_blank" style="display:inline-flex; align-items:center; background:#72a4f2; color:#fff; text-decoration:none; padding:4px 10px; border-radius:6px; font-weight:bold; font-size:11px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                        ${t('kofi_btn')}
                    </a>
                </div>
            </div>
            
            <div style="display:flex; border-bottom:1px solid #e1e8ed; margin-bottom:12px;">
                <div id="tab_file" style="padding:8px 16px; cursor:pointer; border-bottom:2px solid #1da1f2; color:#1da1f2; font-weight:bold; flex:1; text-align:center;">${t('tab_file')}</div>
                <div id="tab_live" style="padding:8px 16px; cursor:pointer; border-bottom:2px solid transparent; color:#657786; flex:1; text-align:center;">${t('tab_live')}</div>
            </div>
            
            <div id="view_file">
                <p style="font-size:13px; margin-top:0; color:#657786;">${t('panel_file_desc')}</p>
                <input type="file" id="tx_file" accept=".js" multiple style="border:1px solid #e1e8ed; border-radius:4px; padding:6px; width:100%; box-sizing:border-box; font-size:12px;">
                
                <div style="margin-top:12px; font-size:13px; background:#f5f8fa; padding:10px; border-radius:8px;">
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="tx_skip_rt"> <span>${t('skip_rt')}</span></label>
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; margin-top:6px;"><input type="checkbox" id="tx_smart_skip" checked> <span>${t('smart_skip')}</span></label>
                    
                    <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                        <label>${t('keep_days')}</label>
                        <input type="number" id="tx_keep_days" style="width:60px; border:1px solid #e1e8ed; border-radius:4px; padding:4px;" min="0" value="0">
                    </div>
                    <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                        <label>${t('keep_likes')}</label>
                        <input type="number" id="tx_keep_likes" style="width:60px; border:1px solid #e1e8ed; border-radius:4px; padding:4px;" min="0" value="0">
                    </div>
                    <div style="margin-top:12px; padding-top:8px; border-top:1px solid #e1e8ed; font-size:11px; color:#657786; display:flex; justify-content:space-between; align-items:center;">
                        <span id="tx_cache_info">${t('cache_info').replace('{n}', state.deletedCache.size)}</span>
                        <button id="tx_clear_cache" style="background:transparent; border:none; color:#e0245e; cursor:pointer; font-size:11px; text-decoration:underline;">${t('btn_clear')}</button>
                    </div>
                </div>
            </div>
            
            <div id="view_live" style="display:none;">
                <p style="font-size:13px; margin-top:0; color:#657786;">${t('panel_live_desc')}</p>
                <button id="tx_btn_profile" style="width:100%; background:transparent; color:#1da1f2; border:1px solid #1da1f2; border-radius:9999px; padding:8px; font-weight:bold; cursor:pointer;">${t('btn_profile')}</button>
            </div>
            
            <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
                <label style="font-size:13px; font-weight:bold;">${t('speed')}</label>
                <select id="tx_speed" style="border:1px solid #e1e8ed; border-radius:4px; padding:4px 8px;">
                    <option value="1">${t('spd_normal')}</option>
                    <option value="3" selected>${t('spd_turbo')}</option>
                </select>
            </div>
            
            <div style="margin-top:12px; display:flex; gap:8px;">
                <button id="tx_start" style="flex:1; background:#1da1f2; color:#fff; border:none; border-radius:9999px; padding:10px; font-weight:bold; cursor:pointer;">${t('btn_start')}</button>
                <button id="tx_stop" style="flex:1; background:#e0245e; color:#fff; border:none; border-radius:9999px; padding:10px; font-weight:bold; cursor:pointer; display:none;">${t('btn_stop')}</button>
            </div>
            
            <div style="display:flex; justify-content:space-between; background:#f5f8fa; padding:10px; border-radius:8px; margin-top:16px; text-align:center; font-size:12px;">
                <div><span id="st_total" style="display:block; font-size:16px; font-weight:bold; color:#14171a;">0</span> <small>Total</small></div>
                <div><span id="st_ok" style="display:block; font-size:16px; font-weight:bold; color:#17bf63;">0</span> <small>OK</small></div>
                <div><span id="st_fail" style="display:block; font-size:16px; font-weight:bold; color:#e0245e;">0</span> <small>Fail</small></div>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; margin-bottom:8px;">
                <span style="font-size:13px; font-weight:bold;">${t('log_title')}</span>
                <button id="tx_export" style="background:transparent; color:#1da1f2; border:1px solid #1da1f2; border-radius:4px; padding:2px 8px; font-size:11px; cursor:pointer;">${t('btn_export')}</button>
            </div>
            
            <div style="max-height:150px; overflow-y:auto; border:1px solid #e1e8ed; border-radius:4px;">
                <table style="width:100%; border-collapse:collapse; font-size:11px; text-align:left;">
                    <thead style="background:#f5f8fa; position:sticky; top:0;">
                        <tr><th style="padding:4px; border-bottom:1px solid #e1e8ed;">${t('th_id')}</th><th style="padding:4px; border-bottom:1px solid #e1e8ed;">${t('th_status')}</th></tr>
                    </thead>
                    <tbody id="tx_log_body"></tbody>
                </table>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', uiHTML);
    const $ = (id) => document.getElementById(id);

    // --- UI Logic ---
    const updateCacheUI = () => {
        if($('tx_cache_info')) $('tx_cache_info').innerText = t('cache_info').replace('{n}', state.deletedCache.size);
    };

    $('tx_clear_cache').onclick = () => {
        if(confirm("Tem certeza que deseja limpar a memória de tweets já excluídos?")) {
            state.deletedCache.clear();
            saveCache(state.deletedCache);
            updateCacheUI();
        }
    };

    $('tab_file').onclick = () => {
        state.mode = 'file';
        $('tab_file').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid #1da1f2; color:#1da1f2; font-weight:bold; flex:1; text-align:center;";
        $('tab_live').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid transparent; color:#657786; flex:1; text-align:center;";
        $('view_file').style.display = 'block';
        $('view_live').style.display = 'none';
    };
    $('tab_live').onclick = () => {
        state.mode = 'live';
        $('tab_live').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid #1da1f2; color:#1da1f2; font-weight:bold; flex:1; text-align:center;";
        $('tab_file').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid transparent; color:#657786; flex:1; text-align:center;";
        $('view_live').style.display = 'block';
        $('view_file').style.display = 'none';
    };
    $('tx_btn_profile').onclick = () => {
        if (state.username) window.location.href = `/${state.username}/with_replies`;
        else alert("Navegue manualmente para o seu perfil.");
    };

    // Dragging
    let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
    $('tx_header').onmousedown = (e) => { if (e.target.tagName !== 'BUTTON') { initialX = e.clientX - xOffset; initialY = e.clientY - yOffset; isDragging = true; }};
    document.onmouseup = () => { initialX = currentX; initialY = currentY; isDragging = false; };
    document.onmousemove = (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX; currentY = e.clientY - initialY;
            xOffset = currentX; yOffset = currentY;
            $('tx_panel').style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    };

    $('tx_min').onclick = () => {
        const body = $('tx_body');
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    };
    $('tx_close').onclick = () => $('tx_panel').remove();

    const updateStats = () => {
        $('st_total').innerText = state.stats.total;
        $('st_ok').innerText = state.stats.ok;
        $('st_fail').innerText = state.stats.fail;
    };

    const addLog = (id, status, isOk) => {
        state.logs.push({ id, status, isOk, time: new Date().toISOString() });
        const tr = document.createElement('tr');
        tr.style.background = isOk ? '#e8f5fd' : '#fde8e8';
        tr.innerHTML = `<td style="padding:4px; border-bottom:1px solid #e1e8ed;"><a href="https://x.com/i/status/${id}" target="_blank" style="color:#1da1f2; text-decoration:none;">${id}</a></td><td style="padding:4px; border-bottom:1px solid #e1e8ed;">${status}</td>`;
        $('tx_log_body').prepend(tr);
        if ($('tx_log_body').children.length > 100) $('tx_log_body').lastChild.remove();
    };

    $('tx_export').onclick = () => {
        if (!state.logs.length) return;
        let csv = "ID,Status,Time\n" + state.logs.map(l => `="${l.id}",${l.status},${l.time}`).join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        a.download = `tweetxer_log_${Date.now()}.csv`;
        a.click();
    };

    // --- File Processing ---
    $('tx_file').onchange = async (e) => {
        const files = e.target.files;
        if (!files.length) return;
        
        const skipRt = $('tx_skip_rt').checked;
        const keepDays = parseInt($('tx_keep_days').value, 10) || 0;
        const keepLikes = parseInt($('tx_keep_likes').value, 10) || 0;
        let allIds = [];
        let skippedByCache = 0;
        
        for (const file of files) {
            try {
                const text = await file.text();
                const match = text.match(/^.*?\s*=\s*/);
                if (!match) continue;
                
                const json = JSON.parse(text.slice(match[0].length));
                for (const item of json) {
                    const tweet = item.tweet || item;
                    const id = tweet.id_str || tweet.id || tweet.tweet_id;
                    if (!id) continue;
                    
                    if (state.deletedCache.has(id)) {
                        skippedByCache++;
                        continue;
                    }
                    
                    if (skipRt && (tweet.full_text?.match(/^RT @/i) || tweet.retweeted_status || tweet.retweeted_status_id_str)) continue;
                    if (keepLikes > 0 && (parseInt(tweet.favorite_count, 10) || 0) >= keepLikes) continue;
                    if (keepDays > 0 && getTweetAgeDays(id) <= keepDays) continue;
                    
                    allIds.push(id);
                }
            } catch (err) { console.error("Error parsing", file.name, err); }
        }
        
        allIds = [...new Set(allIds)].sort((a, b) => a.length !== b.length ? b.length - a.length : (a > b ? -1 : 1));
        state.ids = allIds;
        state.stats = { total: allIds.length, ok: 0, fail: 0 };
        state.currentIndex = 0;
        updateStats();
        $('tx_log_body').innerHTML = '';
        
        let msg = `${t('ready_notice')} (${allIds.length} itens na fila).`;
        if (skippedByCache > 0) msg += `\n\n${skippedByCache} tweets foram ignorados automaticamente porque já estavam na memória (já excluídos).`;
        alert(msg);
    };

    // --- Execution Logic ---
    const doWait = async (waitTime) => {
        const btn = $('tx_stop');
        const originalText = t('btn_stop');
        let timeLeft = waitTime;
        while(timeLeft > 0 && state.running) {
            btn.innerText = t('btn_paused').replace('{m}', Math.ceil(timeLeft/60000));
            await sleep(Math.min(1000, timeLeft));
            timeLeft -= 1000;
        }
        btn.innerText = originalText;
    };

    const processQueue = async () => {
        const speed = parseInt($('tx_speed').value, 10);
        let ghostStreak = 0; 
        let probeStep = 100; // Inicia o pulo em 100

        while (state.running && state.currentIndex < state.ids.length) {
            const smartSkip = $('tx_smart_skip').checked;

            // --- SMART PROBE EXPONENCIAL ---
            if (smartSkip && ghostStreak >= 3 && state.currentIndex < state.ids.length - 1) {
                const probeIndex = Math.min(state.currentIndex + probeStep, state.ids.length - 1);
                const probeId = state.ids[probeIndex];
                
                addLog('SYS', t('log_probe').replace('{n}', probeStep), true);
                const res = await deleteTweet(probeId);

                if (res.status === 404 && res.type === 'ghost') {
                    // Sonda confirmou! Tudo até o probeIndex é fantasma.
                    let skippedCount = 0;
                    for(let i = state.currentIndex; i <= probeIndex; i++) {
                        if (!state.deletedCache.has(state.ids[i])) {
                            state.deletedCache.add(state.ids[i]);
                            state.stats.ok++;
                            skippedCount++;
                        }
                    }
                    addLog('SYS', t('log_probe_ok').replace('{n}', skippedCount), true);
                    state.currentIndex = probeIndex + 1;
                    probeStep *= 2; // PULO EXPONENCIAL (100 -> 200 -> 400 -> 800...)
                    updateStats();
                    updateCacheUI();
                    saveCache(state.deletedCache);
                    continue; // Pula o processamento normal e vai pro próximo loop
                } else if (res.status === 429) {
                    // Rate limit na sonda
                    const waitTime = res.reset ? Math.max(0, (res.reset * 1000) - Date.now()) + 2000 : 15 * 60 * 1000;
                    addLog('SYS', t('rate_limit_log').replace('{m}', Math.ceil(waitTime / 60000)), false);
                    await doWait(waitTime);
                    continue; // Tenta a sonda de novo após a pausa
                } else {
                    // Sonda bateu em um tweet real (Overshoot). Fim da zona fantasma.
                    addLog('SYS', t('log_probe_fail'), true);
                    ghostStreak = 0; // Reseta o contador de fantasmas
                    probeStep = 100; // Reseta o tamanho do pulo
                    
                    if (res.status === 200) {
                        state.stats.ok++;
                        addLog(probeId, 'OK', true);
                        state.deletedCache.add(probeId);
                        saveCache(state.deletedCache);
                        updateCacheUI();
                        updateStats();
                    } else {
                        state.stats.fail++;
                        addLog(probeId, `Erro ${res.status}`, false);
                    }
                    // IMPORTANTE: Não avança o currentIndex aqui. 
                    // Deixa o loop normal processar o "buraco" que ficou para trás.
                }
            }

            // --- PROCESSAMENTO NORMAL ---
            const batch = state.ids.slice(state.currentIndex, state.currentIndex + speed);
            state.currentIndex += batch.length;
            
            let rateLimitWait = 0;
            let batchGhosts = 0;
            let batchReal = 0;
            
            await Promise.all(batch.map(async (id) => {
                if (rateLimitWait > 0) {
                    state.ids.push(id); 
                    return;
                }
                const res = await deleteTweet(id);
                
                if (res.status === 200) {
                    state.stats.ok++; 
                    batchReal++;
                    addLog(id, 'OK', true);
                    state.deletedCache.add(id);
                } else if (res.status === 404 && res.type === 'ghost') {
                    state.stats.ok++; 
                    batchGhosts++;
                    addLog(id, t('status_ghost'), true);
                    state.deletedCache.add(id); 
                } else if (res.status === 429) {
                    state.stats.fail++; 
                    state.ids.push(id); 
                    rateLimitWait = res.reset ? Math.max(0, (res.reset * 1000) - Date.now()) + 2000 : 15 * 60 * 1000;
                    addLog(id, 'Rate Limit (429)', false);
                } else {
                    state.stats.fail++; addLog(id, `Erro ${res.status}`, false);
                }
            }));
            
            // Atualiza o contador de fantasmas para ativar a Sonda
            if (batchReal > 0) ghostStreak = 0;
            else if (batchGhosts > 0) ghostStreak += batchGhosts;

            saveCache(state.deletedCache);
            updateCacheUI();
            updateStats();
            
            if (rateLimitWait > 0 && state.running) {
                addLog('SYS', t('rate_limit_log').replace('{m}', Math.ceil(rateLimitWait / 60000)), false);
                await doWait(rateLimitWait);
            } else if (state.running) {
                await sleep(speed === 3 ? 500 : 1500);
            }
        }
        if (state.currentIndex >= state.ids.length) {
            state.running = false;
            alert(t('finished'));
        }
        $('tx_start').style.display = 'block'; $('tx_stop').style.display = 'none';
    };

    const processLive = async () => {
        while (state.running) {
            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            let processedAny = false;
            
            for (const tweet of tweets) {
                if (!state.running) break;
                const link = tweet.querySelector('a[href*="/status/"]');
                if (!link) continue;
                
                const match = link.href.match(/\/status\/(\d+)/);
                if (!match) continue;
                const id = match[1];
                
                if (state.logs.some(l => l.id === id) || state.deletedCache.has(id)) { 
                    tweet.remove(); 
                    continue; 
                }
                
                const res = await deleteTweet(id);
                if (res.status === 200 || (res.status === 404 && res.type === 'ghost')) {
                    state.stats.ok++; 
                    addLog(id, res.status === 200 ? 'OK' : t('status_ghost'), true); 
                    state.deletedCache.add(id);
                    saveCache(state.deletedCache);
                    updateCacheUI();
                    tweet.remove(); 
                    processedAny = true;
                } else if (res.status === 429) {
                    const waitTime = res.reset ? Math.max(0, (res.reset * 1000) - Date.now()) + 2000 : 15 * 60 * 1000;
                    addLog(id, t('rate_limit_log').replace('{m}', Math.ceil(waitTime / 60000)), false);
                    await doWait(waitTime);
                    break; 
                } else {
                    state.stats.fail++; addLog(id, `Erro ${res.status}`, false); tweet.remove();
                }
                updateStats();
                await sleep(1000);
            }
            if (state.running && !processedAny) { window.scrollBy(0, 1000); await sleep(2000); }
        }
        $('tx_start').style.display = 'block'; $('tx_stop').style.display = 'none';
    };

    $('tx_start').onclick = () => {
        if (state.mode === 'file' && state.ids.length === 0) return alert(t('no_file'));
        state.running = true;
        $('tx_start').style.display = 'none'; $('tx_stop').style.display = 'block';
        state.mode === 'file' ? processQueue() : processLive();
    };

    $('tx_stop').onclick = () => {
        state.running = false;
        $('tx_start').style.display = 'block'; $('tx_stop').style.display = 'none';
        $('tx_stop').innerText = t('btn_stop'); 
    };

})();
