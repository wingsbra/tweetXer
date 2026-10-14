/*
 * ============================================================================
 * TweetXer Fork v7.8 (Smart Cache & Exponential Probe)
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
            "title": "TweetXer Fork v7.8",
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
            "btn_pause": "Pausar",
            "btn_resume": "Retomar ({t})",
            "btn_stop": "Parar",
            "btn_cooldown": "Cooldown ({t})",
            "rate_limit_log": "Rate Limit (#{c}) - Pausa de {t}",
            "manual_pause_log": "Pausado manualmente pelo usuário",
            "manual_resume_log": "Execução retomada pelo usuário",
            "btn_export": "Exportar CSV",
            "no_file": "Nenhum arquivo carregado.",
            "finished": "Processo concluído!",
            "status_deleted": "Deletado",
            "status_unretweet": "RT Desfeito",
            "status_ghost": "Ignorado (Já não existia)",
            "lbl_total": "Na Fila",
            "lbl_deleted": "Deletados",
            "lbl_ignored": "Ignorados",
            "lbl_fail": "Com Erro",
            "lbl_pause": "Pause / RL",
            "log_probe": "Sonda: Testando pulo de {n} IDs...",
            "log_probe_ok": "Sonda: Sucesso! {n} fantasmas ignorados. Dobrando pulo...",
            "log_probe_fail": "Sonda: Encontrou tweet real. Ajustando fronteira..."
        },
        "en": {
            "title": "TweetXer Fork v7.8",
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
            "btn_pause": "Pause",
            "btn_resume": "Resume ({t})",
            "btn_stop": "Stop",
            "btn_cooldown": "Cooldown ({t})",
            "rate_limit_log": "Rate Limit (#{c}) - Paused for {t}",
            "manual_pause_log": "Paused manually by user",
            "manual_resume_log": "Resumed by user",
            "btn_export": "Export CSV",
            "no_file": "No file loaded.",
            "finished": "Process finished!",
            "status_deleted": "Deleted",
            "status_unretweet": "Unretweeted",
            "status_ghost": "Ignored (Already gone)",
            "lbl_total": "Queued",
            "lbl_deleted": "Deleted",
            "lbl_ignored": "Ignored",
            "lbl_fail": "Errors",
            "lbl_pause": "Pause / RL",
            "log_probe": "Probe: Testing jump of {n} IDs...",
            "log_probe_ok": "Probe: Success! {n} ghosts ignored. Doubling jump...",
            "log_probe_fail": "Probe: Hit real tweet. Adjusting boundary..."
        },
        "es": {
            "title": "TweetXer Fork v7.8",
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
            "btn_pause": "Pausar",
            "btn_resume": "Reanudar ({t})",
            "btn_stop": "Detener",
            "btn_cooldown": "Pausa RL ({t})",
            "rate_limit_log": "Rate Limit (#{c}) - Pausa de {t}",
            "manual_pause_log": "Pausado manualmente por el usuario",
            "manual_resume_log": "Reanudado por el usuario",
            "btn_export": "Exportar CSV",
            "no_file": "Ningún archivo cargado.",
            "finished": "¡Proceso terminado!",
            "status_deleted": "Eliminado",
            "status_unretweet": "RT Deshecho",
            "status_ghost": "Ignorado (Ya no existía)",
            "lbl_total": "En Cola",
            "lbl_deleted": "Eliminados",
            "lbl_ignored": "Ignorados",
            "lbl_fail": "Con Error",
            "lbl_pause": "Pausa / RL",
            "log_probe": "Sonda: Probando salto de {n} IDs...",
            "log_probe_ok": "Sonda: ¡Éxito! {n} fantasmas ignorados. Doblando salto...",
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

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, Math.max(0, ms)));

    const formatClock = (ms) => {
        const totalSec = Math.max(0, Math.ceil(ms / 1000));
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

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
        catch (e) { return new Set(); }
    };
    const saveCache = (cacheSet) => {
        try { localStorage.setItem('tx_deleted_cache', JSON.stringify([...cacheSet])); }
        catch (e) { console.warn("Cache cheio"); }
    };

    const state = {
        mode: 'file',
        ids: [],
        rawFilesLoaded: [],
        currentIndex: 0,
        running: false,
        paused: false,
        pausedStartedAt: 0,
        cooldownUntil: 0,
        pauseCount: 0,
        rateLimitHits: 0,
        stats: {
            total: 0,
            deleted: 0,
            ignored: 0,
            ignoredPreFilter: 0,
            ignoredGhost: 0,
            fail: 0
        },
        processedIds: new Set(),
        logs: [],
        deletedCache: loadCache(),
        ct0: getCookie('ct0'),
        bearer: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        username: '',
        uiTicker: null
    };

    const detectUsername = () => {
        const profileLink = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
        if (profileLink) {
            const hrefMatch = (profileLink.getAttribute('href') || '').match(/^\/([a-zA-Z0-9_]+)/);
            if (hrefMatch) {
                state.username = hrefMatch[1];
                return;
            }
        }
        const match = location.pathname.match(/^\/([a-zA-Z0-9_]+)/);
        if (match && !['i', 'home', 'explore', 'notifications', 'messages', 'search', 'settings'].includes(match[1])) {
            state.username = match[1];
        }
    };
    detectUsername();

    // --- API Calls ---
    const unretweet = async (id) => {
        const url = 'https://x.com/i/api/graphql/iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet';
        const body = JSON.stringify({ variables: { source_tweet_id: id, dark_request: false }, queryId: "iQtK4dl5hBmXewYZuEOKVw" });
        const headers = {
            'authorization': state.bearer,
            'content-type': 'application/json',
            'x-csrf-token': getCookie('ct0') || state.ct0,
            'x-client-transaction-id': generateTransactionId(),
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session'
        };
        try {
            const res = await fetch(url, { method: 'POST', headers, body, credentials: 'include' });
            if (res.status === 429) {
                return { status: 429, reset: parseInt(res.headers.get('x-rate-limit-reset'), 10) };
            }
            const data = await res.json().catch(() => null);
            if (data && Array.isArray(data.errors) && data.errors.length > 0) {
                const err = data.errors[0];
                const code = Number(err.code ?? err.extensions?.code);
                const msg = String(err.message || '');
                if (code === 88 || /rate limit/i.test(msg)) {
                    return { status: 429, reset: parseInt(res.headers.get('x-rate-limit-reset'), 10) };
                }
                if (code === 144 || code === 34 || /no status found|not found/i.test(msg)) {
                    return { status: 404, type: 'ghost' };
                }
                return { status: 400, error: msg };
            }
            return { status: res.status };
        } catch (e) {
            return { status: 0, error: e.message };
        }
    };

    const deleteTweet = async (id) => {
        const url = 'https://x.com/i/api/graphql/VaenaVgh5q5ih7kvyVjgtg/DeleteTweet';
        const body = JSON.stringify({ variables: { tweet_id: id, dark_request: false }, queryId: "VaenaVgh5q5ih7kvyVjgtg" });
        const headers = {
            'authorization': state.bearer,
            'content-type': 'application/json',
            'x-csrf-token': getCookie('ct0') || state.ct0,
            'x-client-transaction-id': generateTransactionId(),
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session'
        };

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        try {
            const res = await fetch(url, { method: 'POST', headers, body, credentials: 'include', signal: controller.signal });
            clearTimeout(timeout);

            const resetHeader = parseInt(res.headers.get('x-rate-limit-reset'), 10);
            const remainingHeader = res.headers.get('x-rate-limit-remaining');

            if (res.status === 429) {
                return { status: 429, reset: resetHeader };
            }

            let data = null;
            try { data = await res.json(); } catch (e) {}

            const hasAuthError = data?.errors?.some(e =>
                /NotAuthorizedForResource|not authorized/i.test(e.message || '') ||
                [179, 63].includes(Number(e.code ?? e.extensions?.code))
            );

            if (res.status === 403 || hasAuthError) {
                const unrtRes = await unretweet(id);
                if (unrtRes.status === 200) return { status: 200, type: 'unretweet' };
                if (unrtRes.status === 404) return { status: 404, type: 'ghost' };
                if (unrtRes.status === 429) return { status: 429, reset: unrtRes.reset || resetHeader };
                return { status: 403, error: unrtRes.error || 'Forbidden (403)' };
            }

            if (data && Array.isArray(data.errors) && data.errors.length > 0) {
                const firstErr = data.errors[0];
                const errMsg = String(firstErr.message || '');
                const errCode = Number(firstErr.code ?? firstErr.extensions?.code);

                if (errCode === 88 || /rate limit/i.test(errMsg)) {
                    return { status: 429, reset: resetHeader };
                }
                if (errCode === 144 || errCode === 34 || /no status found|not found|already deleted/i.test(errMsg)) {
                    return { status: 404, type: 'ghost' };
                }
                // IMPORTANTE: Nunca retornar status 200 quando data.errors existir!
                return { status: res.status >= 400 ? res.status : 400, error: errCode ? `Code ${errCode}: ${errMsg}` : errMsg };
            }

            if (res.status >= 200 && res.status < 300) {
                if (data && data.data && data.data.delete_tweet !== undefined) {
                    const exhausted = remainingHeader !== null && remainingHeader !== '' && Number(remainingHeader) < 1;
                    return { status: 200, type: 'deleted', exhausted, reset: resetHeader };
                }
                return { status: 400, error: 'Resposta 200 sem delete_tweet' };
            }

            return { status: res.status, error: `HTTP ${res.status}` };
        } catch (e) {
            clearTimeout(timeout);
            return { status: 0, error: e.name === 'AbortError' ? 'Timeout (12s)' : (e.message || 'Network Error') };
        }
    };

    // --- UI Injection ---
    if (window.__txTicker) clearInterval(window.__txTicker);
    if (document.getElementById('tx_panel')) document.getElementById('tx_panel').remove();

    const uiHTML = `
    <div id="tx_panel" style="position:fixed; top:20px; right:20px; width:430px; background:#ffffff; color:#333; border:1px solid #e1e8ed; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.15); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; z-index:999999; display:flex; flex-direction:column; overflow:hidden; transition:all 0.3s ease;">
        <div id="tx_header" style="background:#f5f8fa; padding:12px 16px; border-bottom:1px solid #e1e8ed; display:flex; justify-content:space-between; align-items:center; font-weight:bold; cursor:move;">
            <span>${t('title')}</span>
            <div>
                <button id="tx_min" style="background:transparent; border:none; cursor:pointer; font-weight:bold; color:#657786;">_</button>
                <button id="tx_close" style="background:transparent; border:none; cursor:pointer; font-weight:bold; color:#657786; margin-left:8px;">X</button>
            </div>
        </div>
        <div id="tx_body" style="padding:16px; overflow-y:auto; max-height:82vh;">
            
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
                <input type="file" id="tx_file" accept=".js,.json" multiple style="border:1px solid #e1e8ed; border-radius:4px; padding:6px; width:100%; box-sizing:border-box; font-size:12px;">
                
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
            
            <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center;">
                <label style="font-size:13px; font-weight:bold;">${t('speed')}</label>
                <select id="tx_speed" style="border:1px solid #e1e8ed; border-radius:4px; padding:4px 8px;">
                    <option value="1">${t('spd_normal')}</option>
                    <option value="3" selected>${t('spd_turbo')}</option>
                </select>
            </div>
            
            <div style="margin-top:12px; display:flex; gap:8px;">
                <button id="tx_start" style="flex:1; background:#1da1f2; color:#fff; border:none; border-radius:9999px; padding:10px; font-weight:bold; cursor:pointer;">${t('btn_start')}</button>
                <button id="tx_pause" style="flex:1; background:#f59e0b; color:#fff; border:none; border-radius:9999px; padding:10px; font-weight:bold; cursor:pointer; display:none;">${t('btn_pause')}</button>
                <button id="tx_stop" style="flex:1; background:#e0245e; color:#fff; border:none; border-radius:9999px; padding:10px; font-weight:bold; cursor:pointer; display:none;">${t('btn_stop')}</button>
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; background:#f5f8fa; padding:10px 6px; border-radius:8px; margin-top:14px; text-align:center; font-size:11px; font-variant-numeric:tabular-nums;">
                <div>
                    <span id="st_total" style="display:block; font-size:15px; font-weight:bold; color:#14171a;">0</span>
                    <small style="color:#657786;">${t('lbl_total')}</small>
                </div>
                <div>
                    <span id="st_deleted" style="display:block; font-size:15px; font-weight:bold; color:#17bf63;">0</span>
                    <small style="color:#657786;">${t('lbl_deleted')}</small>
                </div>
                <div>
                    <span id="st_ignored" style="display:block; font-size:15px; font-weight:bold; color:#657786;">0</span>
                    <small id="st_ignored_sub" style="color:#657786;" title="Filtros/Cache + Fantasmas (404)">${t('lbl_ignored')}</small>
                </div>
                <div>
                    <span id="st_fail" style="display:block; font-size:15px; font-weight:bold; color:#e0245e;">0</span>
                    <small style="color:#657786;">${t('lbl_fail')}</small>
                </div>
                <div>
                    <span id="st_pause" style="display:block; font-size:15px; font-weight:bold; color:#d97706;">00:00</span>
                    <small id="st_pause_sub" style="color:#657786;">0x ${t('lbl_pause')}</small>
                </div>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; margin-bottom:8px;">
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

    // --- UI Logic & Real-Time Pause Ticker ---
    const updateCacheUI = () => {
        if ($('tx_cache_info'))$('tx_cache_info').innerText = t('cache_info').replace('{n}', state.deletedCache.size);
    };

    const updateStats = () => {
        state.stats.ignored = state.stats.ignoredPreFilter + state.stats.ignoredGhost;
        const remainingInQueue = state.mode === 'file'
            ? Math.max(0, state.ids.length - state.currentIndex)
            : state.stats.total;

        if ($('st_total'))$('st_total').innerText = remainingInQueue;
        if ($('st_deleted'))$('st_deleted').innerText = state.stats.deleted;
        if ($('st_ignored'))$('st_ignored').innerText = state.stats.ignored;
        if ($('st_fail'))$('st_fail').innerText = state.stats.fail;
        if ($('st_pause_sub'))$('st_pause_sub').innerText = `${state.pauseCount}x (${state.rateLimitHits} RL)`;
    };

    const updateTimerUI = () => {
        if (!$('tx_panel')) return;
        const now = Date.now();
        const cooldownLeft = Math.max(0, state.cooldownUntil - now);
        const manualElapsed = state.paused && state.pausedStartedAt > 0 ? Math.max(0, now - state.pausedStartedAt) : 0;

        const stPause = $('st_pause');
        const btnPause = $('tx_pause');
        const btnStop = $('tx_stop');

        if (cooldownLeft > 0) {
            const clock = formatClock(cooldownLeft);
            if (stPause) stPause.innerText = clock;
            if (btnStop) btnStop.innerText = `${t('btn_cooldown').replace('{t}', clock)} - ${t('btn_stop')}`;
        } else if (state.paused) {
            const clock = formatClock(manualElapsed);
            if (stPause) stPause.innerText = clock;
            if (btnPause) btnPause.innerText = t('btn_resume').replace('{t}', clock);
            if (btnStop) btnStop.innerText = t('btn_stop');
        } else {
            if (stPause) stPause.innerText = '00:00';
            if (btnPause) btnPause.innerText = t('btn_pause');
            if (btnStop) btnStop.innerText = t('btn_stop');
        }
    };

    window.__txTicker = setInterval(updateTimerUI, 250);

    $('tx_clear_cache').onclick = () => {
        if (confirm("Tem certeza que deseja limpar a memória de tweets já excluídos?")) {
            state.deletedCache.clear();
            saveCache(state.deletedCache);
            updateCacheUI();
            if (state.rawFilesLoaded.length > 0 && !state.running) {
                rebuildQueueFromLoadedFiles();
            }
        }
    };

    $('tab_file').onclick = () => {
        if (state.running) return;
        state.mode = 'file';
        $('tab_file').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid #1da1f2; color:#1da1f2; font-weight:bold; flex:1; text-align:center;";
        $('tab_live').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid transparent; color:#657786; flex:1; text-align:center;";
        $('view_file').style.display = 'block';$('view_live').style.display = 'none';
        updateStats();
    };

    $('tab_live').onclick = () => {
        if (state.running) return;
        state.mode = 'live';
        $('tab_live').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid #1da1f2; color:#1da1f2; font-weight:bold; flex:1; text-align:center;";
        $('tab_file').style.cssText = "padding:8px 16px; cursor:pointer; border-bottom:2px solid transparent; color:#657786; flex:1; text-align:center;";
        $('view_live').style.display = 'block';$('view_file').style.display = 'none';
        updateStats();
    };

    $('tx_btn_profile').onclick = () => {
        detectUsername();
        if (state.username) window.location.href = `/${state.username}/with_replies`;
        else alert("Navegue manualmente para o seu perfil (/usuario/with_replies).");
    };

    // Dragging
    let isDragging = false, currentX = 0, currentY = 0, initialX = 0, initialY = 0, xOffset = 0, yOffset = 0;
    $('tx_header').onmousedown = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        }
    };
    document.onmouseup = () => { initialX = currentX; initialY = currentY; isDragging = false; };
    document.onmousemove = (e) => {
        if (isDragging && $('tx_panel')) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            $('tx_panel').style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    };

    $('tx_min').onclick = () => {
        const body = $('tx_body');
        body.style.display = body.style.display === 'none' ? 'block' : 'none';
    };
    $('tx_close').onclick = () => {
        state.running = false;
        state.paused = false;
        if (window.__txTicker) clearInterval(window.__txTicker);
        $('tx_panel')?.remove();
    };

    const addLog = (id, status, category = 'ok') => {
        state.logs.push({ id, status, category, time: new Date().toISOString() });
        const tr = document.createElement('tr');
        const bgMap = {
            ok: '#e8f5fd',
            ignored: '#f3f4f6',
            wait: '#fef3c7',
            fail: '#fde8e8'
        };
        tr.style.background = bgMap[category] || '#e8f5fd';
        const idCell = /^\d+$/.test(String(id))
            ? `<a href="https://x.com/i/status/${id}" target="_blank" style="color:#1da1f2; text-decoration:none;">${id}</a>`
            : `<strong>${id}</strong>`;
        tr.innerHTML = `<td style="padding:4px; border-bottom:1px solid #e1e8ed;">${idCell}</td><td style="padding:4px; border-bottom:1px solid #e1e8ed;">${status}</td>`;
        $('tx_log_body').prepend(tr);
        if ($('tx_log_body').children.length > 120)$('tx_log_body').lastChild.remove();
    };

    $('tx_export').onclick = () => {
        if (!state.logs.length) return;
        const csv = "ID,Category,Status,Time\n" + state.logs.map(l => `="${l.id}",${l.category},"${String(l.status).replace(/"/g, '""')}",${l.time}`).join('\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
        a.download = `tweetxer_log_${Date.now()}.csv`;
        a.click();
    };

    // --- File Processing & Dynamic Filter Rebuild ---
    const rebuildQueueFromLoadedFiles = (showAlert = false) => {
        if (!state.rawFilesLoaded.length || state.running) return;

        const skipRt = $('tx_skip_rt').checked;
        const keepDays = parseInt($('tx_keep_days').value, 10) || 0;
        const keepLikes = parseInt($('tx_keep_likes').value, 10) || 0;

        const seenInFile = new Set();
        const queueIds = [];
        let ignoredByCache = 0;
        let ignoredByFilter = 0;
        let ignoredDuplicates = 0;

        for (const item of state.rawFilesLoaded) {
            const tweet = item?.tweet || item;
            const rawId = tweet?.id_str || tweet?.id || tweet?.tweet_id;
            if (!rawId) {
                ignoredByFilter++;
                continue;
            }
            const id = String(rawId).trim();
            if (!/^\d+$/.test(id)) {
                ignoredByFilter++;
                continue;
            }
            if (seenInFile.has(id)) {
                ignoredDuplicates++;
                continue;
            }
            seenInFile.add(id);

            if (state.deletedCache.has(id)) {
                ignoredByCache++;
                continue;
            }
            if (skipRt && (/^RT @/i.test(tweet.full_text || '') || tweet.retweeted_status || tweet.retweeted_status_id_str)) {
                ignoredByFilter++;
                continue;
            }
            if (keepLikes > 0 && (parseInt(tweet.favorite_count, 10) || 0) >= keepLikes) {
                ignoredByFilter++;
                continue;
            }
            if (keepDays > 0 && getTweetAgeDays(id) <= keepDays) {
                ignoredByFilter++;
                continue;
            }

            queueIds.push(id);
        }

        queueIds.sort((a, b) => a.length !== b.length ? b.length - a.length : (a > b ? -1 : 1));

        state.ids = queueIds;
        state.currentIndex = 0;
        state.processedIds.clear();
        state.stats = {
            total: queueIds.length,
            deleted: 0,
            ignored: ignoredByCache + ignoredByFilter + ignoredDuplicates,
            ignoredPreFilter: ignoredByCache + ignoredByFilter + ignoredDuplicates,
            ignoredGhost: 0,
            fail: 0
        };
        updateStats();
        $('tx_log_body').innerHTML = '';

        if (ignoredByCache + ignoredByFilter + ignoredDuplicates > 0) {
            addLog('SYS', `Ignorados na leitura: ${ignoredByCache} cache, ${ignoredByFilter} filtros, ${ignoredDuplicates} duplicados`, 'ignored');
        }

        if (showAlert) {
            let msg = `${t('ready_notice')}\n• Na fila para excluir: ${queueIds.length}\n• Ignorados (Cache/Filtros/Duplicados): ${state.stats.ignoredPreFilter}`;
            alert(msg);
        }
    };

    ['tx_skip_rt', 'tx_keep_days', 'tx_keep_likes'].forEach(id => {
        $(id).addEventListener('change', () => {
            if (state.rawFilesLoaded.length > 0 && !state.running) {
                rebuildQueueFromLoadedFiles(false);
            }
        });
    });

    $('tx_file').onchange = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const combinedItems = [];
        for (const file of files) {
            try {
                const text = (await file.text()).trim();
                const match = text.match(/^window\.YTD\.[a-zA-Z0-9_]+\.part\d+\s*=\s*/) || text.match(/^[a-zA-Z0-9_.$]+\s*=\s*/);
                const jsonStr = match ? text.slice(match[0].length).replace(/;\s*$/, '') : text;
                const json = JSON.parse(jsonStr);
                if (Array.isArray(json)) combinedItems.push(...json);
            } catch (err) {
                console.error("Error parsing", file.name, err);
                addLog('SYS', `Erro ao ler ${file.name}: ${err.message}`, 'fail');
            }
        }

        state.rawFilesLoaded = combinedItems;
        rebuildQueueFromLoadedFiles(true);
    };

    // --- Pause & Rate Limit Wait Logic ---
    const computeRateLimitWaitMs = (resetEpochSec) => {
        if (Number.isFinite(resetEpochSec) && resetEpochSec > 0) {
            const diff = (resetEpochSec * 1000) - Date.now() + 3000;
            // Se diff >= 15s e <= 20min, usa o header; caso contrário (clock skew), aplica fallback seguro
            if (diff >= 15000 && diff <= 20 * 60 * 1000) {
                return diff;
            }
        }
        // Fallback seguro de 5 a 15 minutos quando o header x-rate-limit-reset falha ou vem defasado
        return 5 * 60 * 1000;
    };

    const waitIfPausedOrCoolingDown = async () => {
        while (state.running) {
            const now = Date.now();
            if (state.cooldownUntil > now || state.paused) {
                updateTimerUI();
                await sleep(250);
            } else {
                break;
            }
        }
        updateTimerUI();
    };

    const triggerRateLimitPause = async (resetEpochSec) => {
        const waitMs = computeRateLimitWaitMs(resetEpochSec);
        const targetUntil = Date.now() + waitMs;
        if (targetUntil > state.cooldownUntil + 1000) {
            state.rateLimitHits++;
            state.pauseCount++;
            state.cooldownUntil = targetUntil;
            updateStats();
            addLog('SYS', t('rate_limit_log').replace('{c}', state.rateLimitHits).replace('{t}', formatClock(waitMs)), 'wait');
        }
        await waitIfPausedOrCoolingDown();
    };

    // --- Execution Logic ---
    const processQueue = async () => {
        let ghostStreak = 0;
        let probeStep = 100;

        while (state.running && state.currentIndex < state.ids.length) {
            await waitIfPausedOrCoolingDown();
            if (!state.running) break;

            const speed = parseInt($('tx_speed').value, 10) || 1;
            const smartSkip = $('tx_smart_skip').checked;

            // Pula IDs que já tenham sido processados pela Sonda Exponencial
            while (state.currentIndex < state.ids.length && state.processedIds.has(state.ids[state.currentIndex])) {
                state.currentIndex++;
            }
            if (state.currentIndex >= state.ids.length) break;

            // --- SMART PROBE EXPONENCIAL ---
            if (smartSkip && ghostStreak >= 3 && state.currentIndex < state.ids.length - 1) {
                const probeIndex = Math.min(state.currentIndex + probeStep, state.ids.length - 1);
                const probeId = state.ids[probeIndex];

                if (!state.processedIds.has(probeId)) {
                    addLog('SYS', t('log_probe').replace('{n}', probeIndex - state.currentIndex), 'ignored');
                    const res = await deleteTweet(probeId);

                    if (res.status === 429) {
                        await triggerRateLimitPause(res.reset);
                        continue;
                    }

                    if (res.status === 404 && res.type === 'ghost') {
                        let skippedCount = 0;
                        for (let i = state.currentIndex; i <= probeIndex; i++) {
                            const id = state.ids[i];
                            if (!state.processedIds.has(id)) {
                                state.processedIds.add(id);
                                state.deletedCache.add(id);
                                state.stats.ignoredGhost++;
                                skippedCount++;
                            }
                        }
                        addLog('SYS', t('log_probe_ok').replace('{n}', skippedCount), 'ignored');
                        state.currentIndex = probeIndex + 1;
                        probeStep *= 2;
                        saveCache(state.deletedCache);
                        updateCacheUI();
                        updateStats();
                        continue;
                    } else {
                        // Sonda bateu em um tweet real (Overshoot): registra probeId em processedIds para não duplicar!
                        addLog('SYS', t('log_probe_fail'), 'wait');
                        ghostStreak = 0;
                        probeStep = 100;
                        state.processedIds.add(probeId);

                        if (res.status === 200) {
                            state.stats.deleted++;
                            addLog(probeId, res.type === 'unretweet' ? t('status_unretweet') : t('status_deleted'), 'ok');
                            state.deletedCache.add(probeId);
                            saveCache(state.deletedCache);
                            updateCacheUI();
                        } else {
                            state.stats.fail++;
                            addLog(probeId, res.error || `Erro ${res.status}`, 'fail');
                        }
                        updateStats();
                        if (res.exhausted) await triggerRateLimitPause(res.reset);
                    }
                }
            }

            // --- PROCESSAMENTO NORMAL ---
            const batch = [];
            let scanIdx = state.currentIndex;
            while (batch.length < speed && scanIdx < state.ids.length) {
                const candidateId = state.ids[scanIdx];
                if (!state.processedIds.has(candidateId)) {
                    batch.push({ id: candidateId, index: scanIdx });
                }
                scanIdx++;
            }

            if (!batch.length) {
                state.currentIndex = scanIdx;
                updateStats();
                break;
            }

            let hitRateLimit = false;
            let rateLimitReset = 0;
            let batchGhosts = 0;
            let batchReal = 0;
            let minRetryIndex = scanIdx;

            await Promise.all(batch.map(async ({ id, index }) => {
                const res = await deleteTweet(id);

                if (res.status === 429) {
                    hitRateLimit = true;
                    if (res.reset) rateLimitReset = res.reset;
                    if (index < minRetryIndex) minRetryIndex = index;
                    return;
                }

                state.processedIds.add(id);

                if (res.status === 200) {
                    state.stats.deleted++;
                    batchReal++;
                    addLog(id, res.type === 'unretweet' ? t('status_unretweet') : t('status_deleted'), 'ok');
                    state.deletedCache.add(id);
                    if (res.exhausted) {
                        hitRateLimit = true;
                        rateLimitReset = res.reset;
                    }
                } else if (res.status === 404 && res.type === 'ghost') {
                    state.stats.ignoredGhost++;
                    batchGhosts++;
                    addLog(id, t('status_ghost'), 'ignored');
                    state.deletedCache.add(id);
                } else {
                    state.stats.fail++;
                    addLog(id, res.error || `Erro ${res.status}`, 'fail');
                }
            }));

            // Se algum item do batch tomou 429, recua currentIndex para o menor índice não processado
            state.currentIndex = hitRateLimit ? minRetryIndex : scanIdx;

            if (batchReal > 0) ghostStreak = 0;
            else if (batchGhosts > 0) ghostStreak += batchGhosts;

            saveCache(state.deletedCache);
            updateCacheUI();
            updateStats();

            if (hitRateLimit && state.running) {
                await triggerRateLimitPause(rateLimitReset);
            } else if (state.running) {
                await sleep(speed === 3 ? 450 : 1200);
            }
        }

        if (state.running && state.currentIndex >= state.ids.length) {
            state.running = false;
            state.paused = false;
            updateStats();
            alert(`${t('finished')}\n• Deletados: ${state.stats.deleted}\n• Ignorados: ${state.stats.ignored}\n• Com Erro: ${state.stats.fail}`);
        }
        $('tx_start').style.display = 'block';
        $('tx_pause').style.display = 'none';$('tx_stop').style.display = 'none';
        updateTimerUI();
    };

    const processLive = async () => {
        while (state.running) {
            await waitIfPausedOrCoolingDown();
            if (!state.running) break;

            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            let processedAny = false;

            for (const tweet of tweets) {
                if (!state.running) break;
                await waitIfPausedOrCoolingDown();
                if (!state.running) break;

                const link = tweet.querySelector('a[href*="/status/"]');
                if (!link) continue;

                const match = link.href.match(/\/status\/(\d+)/);
                if (!match) continue;
                const id = match[1];

                if (state.processedIds.has(id) || state.deletedCache.has(id)) {
                    if (!state.processedIds.has(id)) {
                        state.processedIds.add(id);
                        state.stats.ignoredPreFilter++;
                        updateStats();
                    }
                    tweet.remove();
                    continue;
                }

                const res = await deleteTweet(id);
                if (res.status === 429) {
                    await triggerRateLimitPause(res.reset);
                    break;
                }

                state.processedIds.add(id);

                if (res.status === 200) {
                    state.stats.deleted++;
                    addLog(id, res.type === 'unretweet' ? t('status_unretweet') : t('status_deleted'), 'ok');
                    state.deletedCache.add(id);
                    saveCache(state.deletedCache);
                    updateCacheUI();
                    tweet.remove();
                    processedAny = true;
                } else if (res.status === 404 && res.type === 'ghost') {
                    state.stats.ignoredGhost++;
                    addLog(id, t('status_ghost'), 'ignored');
                    state.deletedCache.add(id);
                    saveCache(state.deletedCache);
                    updateCacheUI();
                    tweet.remove();
                    processedAny = true;
                } else {
                    state.stats.fail++;
                    addLog(id, res.error || `Erro ${res.status}`, 'fail');
                    tweet.remove();
                }

                updateStats();
                if (res.exhausted) {
                    await triggerRateLimitPause(res.reset);
                    break;
                }
                await sleep(900);
            }

            if (state.running && !processedAny) {
                window.scrollBy(0, 1000);
                await sleep(1800);
            }
        }
        $('tx_start').style.display = 'block';
        $('tx_pause').style.display = 'none';$('tx_stop').style.display = 'none';
        updateTimerUI();
    };

    $('tx_start').onclick = () => {
        if (state.mode === 'file' && state.ids.length === 0) return alert(t('no_file'));
        state.ct0 = getCookie('ct0') || state.ct0;
        state.running = true;
        state.paused = false;
        state.pausedStartedAt = 0;
        $('tx_start').style.display = 'none';
        $('tx_pause').style.display = 'block';$('tx_stop').style.display = 'block';
        updateTimerUI();
        state.mode === 'file' ? processQueue() : processLive();
    };

    $('tx_pause').onclick = () => {
        if (!state.running) return;
        state.paused = !state.paused;
        if (state.paused) {
            state.pausedStartedAt = Date.now();
            state.pauseCount++;
            addLog('SYS', t('manual_pause_log'), 'wait');
        } else {
            state.pausedStartedAt = 0;
            addLog('SYS', t('manual_resume_log'), 'ok');
        }
        updateStats();
        updateTimerUI();
    };

    $('tx_stop').onclick = () => {
        state.running = false;
        state.paused = false;
        state.pausedStartedAt = 0;
        state.cooldownUntil = 0;
        $('tx_start').style.display = 'block';
        $('tx_pause').style.display = 'none';$('tx_stop').style.display = 'none';
        updateTimerUI();
    };

})();
