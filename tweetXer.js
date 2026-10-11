/*
 * ============================================================================
 * TweetXer Fork v6.0
 * Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude
 * ============================================================================
 * Finalidade : excluir os posts da conta logada no x.com o mais rápido possível.
 * Uso        : abra x.com logado > F12 (Console) > cole este arquivo inteiro > Enter.
 *              Se o Chrome bloquear a colagem, digite "allow pasting", Enter, e cole de novo.
 * Modos      : 1) Backup: lê tweet-headers.js ou tweets.js do arquivo oficial do X
 *                 (mais rápido e alcança posts antigos que o feed não carrega).
 *              2) Live  : varre o próprio perfil (/USUARIO/with_replies), sem arquivo.
 * Recursos   : Normal (1x) e Turbo (3x), pausa automática por rate limit (429 e
 *              headers x-rate-limit-*), progresso com taxa e ETA, link por ID para
 *              validar a exclusão, filtros de log e exportação CSV.
 * Requisito  : Chrome 90+ (ou Chromium/Firefox recente); manter a aba visível durante a execução.
 *
 * ----------------------------------------------------------------------------
 * CRÉDITOS E ATRIBUIÇÃO AO AUTOR ORIGINAL
 * ----------------------------------------------------------------------------
 *  - Projeto original : TweetXer, de Luca Hammer
 *                       (colaboradores citados no original: dbort, pReya, Micolithe, STrRedWolf)
 *  - Repositório      : https://github.com/lucahammer/tweetXer
 *  - Fonte do fork    : https://raw.githubusercontent.com/lucahammer/tweetXer/main/tweetXer.js
 *                       (referência usada: v0.9.4)
 *  - Licença original : Do No Harm License v0.3 (NoHarm), arquivo LICENSE do repositório
 *                       (o cabeçalho do userscript original cita "NoHarm-draft")
 *  - Inspiração citada pelo original (exclusão rápida): https://github.com/Lyfhael/DeleteTweets
 *  - Reaproveitado do original: endpoint GraphQL DeleteTweet (queryId
 *    VaenaVgh5q5ih7kvyVjgtg), bearer público do web client, headers da requisição,
 *    x-client-transaction-id aleatório, uso dos headers x-rate-limit-*, leitura do
 *    tweet-headers.js / tweets.js e desfazer repost pela interface (unretweet).
 *
 * ----------------------------------------------------------------------------
 * ALTERAÇÕES DA v6.0 SOBRE A v5.0-Turbo
 * ----------------------------------------------------------------------------
 *  - Corrigido TypeError (e.target nulo após await em Shadow DOM) que impedia o
 *    botão Iniciar de habilitar após carregar o arquivo.
 *  - Parar/retomar não perde mais IDs; progresso conta itens concluídos.
 *  - Repetir falhas atualiza contadores e a lista (antes duplicava e nunca zerava).
 *  - HTTP 404 não é mais tratado como "post já excluído" sem checar o corpo.
 *  - Pausa automática em 401 (sessão), 226 (anti-automação) e 8 falhas seguidas.
 *  - Re-colar o script encerra a instância anterior (antes ficava rodando sem painel).
 *  - Live: exclusão em paralelo, desfaz reposts, não confunde perfil de terceiros.
 *  - Interface: render com throttle, ~50% da tela, sem janelas de confirmação,
 *    CSV com ID como texto (Excel não converte em notação científica).
 *  - Suporte a i18n para os idiomas Português, Inglês e Espanhol.
 * ============================================================================
 */

(() => {
  'use strict';

  const i18n = {"pt": {"title": "TweetXer Fork", "credit1": "Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude", "credit2": "Base: <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" rel=\"noopener noreferrer\">TweetXer, de Luca Hammer</a>", "min": "Minimizar", "close": "Fechar painel", "logged_in": "Conta logada", "detecting": "Detectando...", "handle_placeholder": "Digite seu @usuario", "tab_file": "Backup do X (arquivo)", "tab_live": "Live (feed do perfil)", "panel_file_desc": "Selecione <code>tweet-headers.js</code> ou <code>tweets.js</code> do backup oficial. Arquivos divididos em partes podem ser selecionados juntos.", "btn_pick": "Selecionar arquivo(s)", "skip_first": "Pular os primeiros", "items": "itens", "no_file": "Nenhum arquivo carregado.", "panel_live_desc": "Use a aba <code>/usuario/with_replies</code> do seu perfil. O script rola o feed, exclui seus posts pela API e desfaz seus reposts pela interface. O feed do X só carrega uma parte do histórico; para posts antigos use o modo Backup.", "btn_profile": "Abrir meu perfil (Respostas)", "speed": "Velocidade", "spd_normal_title": "1 requisição por vez", "spd_normal": "Normal (1x)", "spd_turbo_title": "3 requisições simultâneas; pausa automática no rate limit", "spd_turbo": "Turbo (3x)", "ready_notice": "Pronto. Carregue o arquivo de backup ou escolha o modo Live.", "deleted": "Excluídos", "gone": "Ausentes", "failed": "Falhas", "processed": "Processados", "log_title": "Registro: últimos {0} (o CSV guarda todos)", "filter_all": "Todos", "filter_ok": "Excluídos", "filter_gone": "Ausentes", "filter_bad": "Falhas", "th_time": "Hora", "th_status": "Status", "th_id": "ID do post (abrir no X)", "th_detail": "Detalhe", "btn_start": "Iniciar exclusão", "btn_stop": "Parar", "btn_retry": "Repetir falhas", "btn_export": "Exportar CSV", "footer_text": "Fork de <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" rel=\"noopener noreferrer\">TweetXer</a> (Luca Hammer), licença Do No Harm v0.3.<br>Fonte: <a href=\"https://raw.githubusercontent.com/lucahammer/tweetXer/main/tweetXer.js\" target=\"_blank\" rel=\"noopener noreferrer\">tweetXer.js</a>.<br>Processamento local; as únicas requisições são para o próprio x.com. Exclusões são definitivas.", "running_notice": "Processando. Mantenha esta aba visível (o Chrome reduz a velocidade de abas em segundo plano).", "rate_limit": "Rate limit do X: aguardando {0}s para continuar.", "no_cookie": "Cookie ct0 ausente: recarregue a página do X.", "net_timeout": "Rede/timeout ({0}) após {1} tentativas.", "rate_limit_persistent": "Rate limit persistente após várias pausas.", "rate_limit_pause": "Rate limit: pausa de {0}s", "invalid_session": "Sessão inválida (401): faça login de novo, recarregue a página e cole o script.", "blocked_automation": "X bloqueou por suspeita de automação (código 226). Aguarde e retome em Normal (1x).", "gone_post": "Post já inexistente (código 144).", "invalid_response": "Resposta inválida do servidor (não é JSON).", "deleted_success": "Excluído com sucesso.", "stopped": "Interrompido.", "repost_gone": "Repost já desfeito.", "repost_failed": "Confirmação de repost não apareceu.", "repost_deleted": "Repost desfeito (confira no perfil).", "paused_fail": "Pausado após {0} falhas seguidas. Último erro: {1}", "not_detected": "Não detectada", "file_empty": "arquivo vazio.", "file_invalid_type": "arquivo do tipo \"{0}\". Use tweet-headers.js ou tweets.js.", "invalid_json": "JSON inválido ou truncado.", "no_tweets": "nenhum registro de tweet encontrado.", "no_valid_ids": "nenhum ID numérico válido foi extraído.", "pause_msg": "Pausado. {0} itens pendentes; clique em Iniciar para continuar.", "live_paused": "Live pausado.", "done_msg": "Concluído: {0} excluídos, {1} ausentes, {2} falhas.", "done_live_msg": "Varredura concluída: {0} excluídos, {1} ausentes, {2} falhas. Posts mais antigos que o feed carrega: use o modo Backup.", "load_file_warn": "Carregue um arquivo com IDs pendentes.", "handle_not_detected": "Conta não detectada. Digite seu @usuario no campo da conta.", "open_profile_warn": "Abra seu perfil na aba Respostas (/usuario/with_replies) ou use o botão \"Abrir meu perfil\".", "critical_error": "Erro crítico: {0}", "scan_feed": "Varredura do feed de @{0}", "nav_left_profile": "A navegação saiu do seu perfil: operação interrompida.", "retrying_fails": "Repetindo {0} falha(s)...", "error_retry": "Erro ao repetir falhas: {0}", "open_manual": "Conta não detectada: abra manualmente o seu perfil.", "profile_opened": "Perfil aberto. Clique em Iniciar exclusão.", "fail_open_profile": "Não foi possível abrir /with_replies automaticamente. Abra manualmente.", "reading_files": "Lendo {0} arquivo(s)...", "error_load": "Erro ao carregar arquivo.", "no_valid_ids_found": "Nenhum ID válido encontrado.", "posts_loaded": "{0} posts carregados ({1}).", "posts_ready_ignored": "{0} posts prontos. Ignorados: {1}", "posts_ready": "{0} posts prontos. Clique em Iniciar exclusão.", "file_loaded": "Arquivo carregado: {0} IDs únicos", "stopping": "Parando: aguardando as requisições em andamento terminarem.", "close_warn": "Pare a exclusão antes de fechar o painel.", "sweeping": "Varrendo", "stopped_status": "Parado", "posts_found": "{0} posts encontrados", "remains": "restam ~{0}", "no_records": "Nenhum registro.", "open_post_validate": "Abrir o post no X para validar", "log_deleted": "Excluído", "log_gone": "Ausente", "log_failed": "Falha", "log_repost": "Repost", "log_pause": "Pausa", "log_error": "Erro", "log_info": "Info", "csv_time": "Horario", "csv_type": "Tipo", "csv_status": "Status", "csv_id": "ID_Post", "csv_msg": "Mensagem", "csv_url": "URL_Validacao", "live_mode_start": "Modo Live: abra /usuario/with_replies e clique em Iniciar exclusão.", "ready": "pronto", "panel_loaded": "Painel carregado"}, "en": {"title": "TweetXer Fork", "credit1": "Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude", "credit2": "Base: <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" rel=\"noopener noreferrer\">TweetXer by Luca Hammer</a>", "min": "Minimize", "close": "Close panel", "logged_in": "Logged in account", "detecting": "Detecting...", "handle_placeholder": "Type your @username", "tab_file": "X Backup (file)", "tab_live": "Live (profile feed)", "panel_file_desc": "Select <code>tweet-headers.js</code> or <code>tweets.js</code> from your official backup. Split files can be selected together.", "btn_pick": "Select file(s)", "skip_first": "Skip the first", "items": "items", "no_file": "No file loaded.", "panel_live_desc": "Use the <code>/username/with_replies</code> tab of your profile. The script scrolls the feed, deletes posts via API and undoes reposts via UI. The feed only loads part of the history; for older posts use Backup mode.", "btn_profile": "Open my profile (Replies)", "speed": "Speed", "spd_normal_title": "1 request at a time", "spd_normal": "Normal (1x)", "spd_turbo_title": "3 concurrent requests; auto-pause on rate limit", "spd_turbo": "Turbo (3x)", "ready_notice": "Ready. Load the backup file or choose Live mode.", "deleted": "Deleted", "gone": "Gone", "failed": "Failed", "processed": "Processed", "log_title": "Log: last {0} (CSV saves all)", "filter_all": "All", "filter_ok": "Deleted", "filter_gone": "Gone", "filter_bad": "Failed", "th_time": "Time", "th_status": "Status", "th_id": "Post ID (open in X)", "th_detail": "Detail", "btn_start": "Start deletion", "btn_stop": "Stop", "btn_retry": "Retry failed", "btn_export": "Export CSV", "footer_text": "Fork of <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" rel=\"noopener noreferrer\">TweetXer</a> (Luca Hammer), Do No Harm v0.3 license.<br>Source: <a href=\"https://raw.githubusercontent.com/lucahammer/tweetXer/main/tweetXer.js\" target=\"_blank\" rel=\"noopener noreferrer\">tweetXer.js</a>.<br>Local processing; only requests to x.com are made. Deletions are permanent.", "running_notice": "Processing. Keep this tab visible (Chrome throttles background tabs).", "rate_limit": "X Rate limit: waiting {0}s to continue.", "no_cookie": "Cookie ct0 missing: reload the X page.", "net_timeout": "Network/timeout ({0}) after {1} attempts.", "rate_limit_persistent": "Persistent rate limit after several pauses.", "rate_limit_pause": "Rate limit: paused for {0}s", "invalid_session": "Invalid session (401): login again, reload page and paste script.", "blocked_automation": "X blocked for suspected automation (code 226). Wait and resume in Normal (1x).", "gone_post": "Post no longer exists (code 144).", "invalid_response": "Invalid server response (not JSON).", "deleted_success": "Successfully deleted.", "stopped": "Stopped.", "repost_gone": "Repost already undone.", "repost_failed": "Repost confirmation did not appear.", "repost_deleted": "Repost undone (check profile).", "paused_fail": "Paused after {0} consecutive failures. Last error: {1}", "not_detected": "Not detected", "file_empty": "empty file.", "file_invalid_type": "file of type \"{0}\". Use tweet-headers.js or tweets.js.", "invalid_json": "Invalid or truncated JSON.", "no_tweets": "no tweet record found.", "no_valid_ids": "no valid numeric ID extracted.", "pause_msg": "Paused. {0} pending items; click Start to continue.", "live_paused": "Live paused.", "done_msg": "Done: {0} deleted, {1} gone, {2} failed.", "done_live_msg": "Sweep done: {0} deleted, {1} gone, {2} failed. Older posts: use Backup mode.", "load_file_warn": "Load a file with pending IDs.", "handle_not_detected": "Account not detected. Type your @username in the account field.", "open_profile_warn": "Open your profile on the Replies tab (/username/with_replies) or use the \"Open my profile\" button.", "critical_error": "Critical error: {0}", "scan_feed": "Sweeping feed of @{0}", "nav_left_profile": "Navigation left your profile: operation interrupted.", "retrying_fails": "Retrying {0} failure(s)...", "error_retry": "Error retrying failures: {0}", "open_manual": "Account not detected: manually open your profile.", "profile_opened": "Profile opened. Click Start deletion.", "fail_open_profile": "Could not automatically open /with_replies. Open manually.", "reading_files": "Reading {0} file(s)...", "error_load": "Error loading file.", "no_valid_ids_found": "No valid ID found.", "posts_loaded": "{0} posts loaded ({1}).", "posts_ready_ignored": "{0} ready posts. Ignored: {1}", "posts_ready": "{0} ready posts. Click Start deletion.", "file_loaded": "File loaded: {0} unique IDs", "stopping": "Stopping: waiting for ongoing requests to finish.", "close_warn": "Stop deletion before closing the panel.", "sweeping": "Sweeping", "stopped_status": "Stopped", "posts_found": "{0} posts found", "remains": "remaining ~{0}", "no_records": "No records.", "open_post_validate": "Open post on X to validate", "log_deleted": "Deleted", "log_gone": "Gone", "log_failed": "Failed", "log_repost": "Repost", "log_pause": "Pause", "log_error": "Error", "log_info": "Info", "csv_time": "Time", "csv_type": "Type", "csv_status": "Status", "csv_id": "Post_ID", "csv_msg": "Message", "csv_url": "Validation_URL", "live_mode_start": "Live Mode: open /username/with_replies and click Start deletion.", "ready": "ready", "panel_loaded": "Panel loaded"}, "es": {"title": "TweetXer Fork", "credit1": "Fork by: Fabricio Sasaki | Powered by AI: ChatGPT, DeepSeek, Gemini, Claude", "credit2": "Base: <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" rel=\"noopener noreferrer\">TweetXer de Luca Hammer</a>", "min": "Minimizar", "close": "Cerrar panel", "logged_in": "Cuenta iniciada", "detecting": "Detectando...", "handle_placeholder": "Escribe tu @usuario", "tab_file": "Respaldo X (archivo)", "tab_live": "En vivo (feed del perfil)", "panel_file_desc": "Selecciona <code>tweet-headers.js</code> o <code>tweets.js</code> de tu respaldo oficial. Archivos divididos se pueden seleccionar juntos.", "btn_pick": "Seleccionar archivo(s)", "skip_first": "Omitir los primeros", "items": "elementos", "no_file": "Ningún archivo cargado.", "panel_live_desc": "Usa la pestaña <code>/usuario/with_replies</code> de tu perfil. El script desplaza el feed, elimina publicaciones por API y deshace reposts por interfaz. El feed solo carga parte del historial; para publicaciones antiguas usa modo Respaldo.", "btn_profile": "Abrir mi perfil (Respuestas)", "speed": "Velocidad", "spd_normal_title": "1 solicitud a la vez", "spd_normal": "Normal (1x)", "spd_turbo_title": "3 solicitudes a la vez; pausa automática por rate limit", "spd_turbo": "Turbo (3x)", "ready_notice": "Listo. Carga el archivo de respaldo o elige modo En vivo.", "deleted": "Eliminados", "gone": "Ausentes", "failed": "Fallidos", "processed": "Procesados", "log_title": "Registro: últimos {0} (CSV guarda todo)", "filter_all": "Todos", "filter_ok": "Eliminados", "filter_gone": "Ausentes", "filter_bad": "Fallidos", "th_time": "Hora", "th_status": "Estado", "th_id": "ID del post (abrir en X)", "th_detail": "Detalle", "btn_start": "Iniciar eliminación", "btn_stop": "Detener", "btn_retry": "Reintentar fallos", "btn_export": "Exportar CSV", "footer_text": "Fork de <a href=\"https://github.com/lucahammer/tweetXer\" target=\"_blank\" rel=\"noopener noreferrer\">TweetXer</a> (Luca Hammer), licencia Do No Harm v0.3.<br>Fuente: <a href=\"https://raw.githubusercontent.com/lucahammer/tweetXer/main/tweetXer.js\" target=\"_blank\" rel=\"noopener noreferrer\">tweetXer.js</a>.<br>Procesamiento local; solo se hacen peticiones a x.com. Las eliminaciones son definitivas.", "running_notice": "Procesando. Mantén esta pestaña visible (Chrome ralentiza pestañas en segundo plano).", "rate_limit": "Rate limit de X: esperando {0}s para continuar.", "no_cookie": "Cookie ct0 ausente: recarga la página de X.", "net_timeout": "Red/tiempo de espera ({0}) tras {1} intentos.", "rate_limit_persistent": "Rate limit persistente después de varias pausas.", "rate_limit_pause": "Rate limit: pausa de {0}s", "invalid_session": "Sesión inválida (401): inicia sesión, recarga la página y pega el script.", "blocked_automation": "X bloqueó por sospecha de automatización (código 226). Espera y reanuda en Normal (1x).", "gone_post": "El post ya no existe (código 144).", "invalid_response": "Respuesta inválida del servidor (no es JSON).", "deleted_success": "Eliminado con éxito.", "stopped": "Interrumpido.", "repost_gone": "Repost ya deshecho.", "repost_failed": "La confirmación de repost no apareció.", "repost_deleted": "Repost deshecho (revisa tu perfil).", "paused_fail": "Pausado tras {0} fallos seguidos. Último error: {1}", "not_detected": "No detectada", "file_empty": "archivo vacío.", "file_invalid_type": "archivo del tipo \"{0}\". Usa tweet-headers.js o tweets.js.", "invalid_json": "JSON inválido o truncado.", "no_tweets": "ningún registro de tweet encontrado.", "no_valid_ids": "ningún ID numérico válido extraído.", "pause_msg": "Pausado. {0} elementos pendientes; haz clic en Iniciar para continuar.", "live_paused": "En vivo pausado.", "done_msg": "Terminado: {0} eliminados, {1} ausentes, {2} fallidos.", "done_live_msg": "Barrido terminado: {0} eliminados, {1} ausentes, {2} fallidos. Posts antiguos: usa modo Respaldo.", "load_file_warn": "Carga un archivo con IDs pendientes.", "handle_not_detected": "Cuenta no detectada. Escribe tu @usuario en el campo de la cuenta.", "open_profile_warn": "Abre tu perfil en Respuestas (/usuario/with_replies) o usa el botón \"Abrir mi perfil\".", "critical_error": "Error crítico: {0}", "scan_feed": "Barrido del feed de @{0}", "nav_left_profile": "La navegación salió de tu perfil: operación interrumpida.", "retrying_fails": "Reintentando {0} fallo(s)...", "error_retry": "Error al reintentar fallos: {0}", "open_manual": "Cuenta no detectada: abre manualmente tu perfil.", "profile_opened": "Perfil abierto. Haz clic en Iniciar eliminación.", "fail_open_profile": "No se pudo abrir /with_replies automáticamente. Ábrelo manualmente.", "reading_files": "Leyendo {0} archivo(s)...", "error_load": "Error al cargar archivo.", "no_valid_ids_found": "Ningún ID válido encontrado.", "posts_loaded": "{0} posts cargados ({1}).", "posts_ready_ignored": "{0} posts listos. Ignorados: {1}", "posts_ready": "{0} posts listos. Haz clic en Iniciar eliminación.", "file_loaded": "Archivo cargado: {0} IDs únicos", "stopping": "Deteniendo: esperando que terminen las solicitudes en curso.", "close_warn": "Detén la eliminación antes de cerrar el panel.", "sweeping": "Barriendo", "stopped_status": "Detenido", "posts_found": "{0} posts encontrados", "remains": "quedan ~{0}", "no_records": "Ningún registro.", "open_post_validate": "Abrir el post en X para validar", "log_deleted": "Eliminado", "log_gone": "Ausente", "log_failed": "Fallido", "log_repost": "Repost", "log_pause": "Pausa", "log_error": "Error", "log_info": "Info", "csv_time": "Hora", "csv_type": "Tipo", "csv_status": "Estado", "csv_id": "ID_Post", "csv_msg": "Mensaje", "csv_url": "URL_Validacion", "live_mode_start": "Modo En vivo: abre /usuario/with_replies y haz clic en Iniciar eliminación.", "ready": "listo", "panel_loaded": "Panel cargado"}};
  const lang = (navigator.language || navigator.userLanguage || 'en').substring(0, 2).toLowerCase();
  const t_lang = i18n[lang] ? lang : (lang === 'pt' ? 'pt' : (lang === 'es' ? 'es' : 'en'));
  const t = (key, ...args) => {
    let str = i18n[t_lang][key] || i18n['en'][key] || key;
    args.forEach((arg, i) => { str = str.replace('{' + i + '}', arg); });
    return str;
  };


  /* ==========================================================================
     CONSTANTES
     ========================================================================== */
  const VERSION = '6.0';
  const GLOBAL_KEY = '__tweetXerForkFabricio';
  const HOST_ID = 'tx-fork-host';
  const LEGACY_HOST_IDS = ['tx-clean-host'];
  const QUERY_ID = 'VaenaVgh5q5ih7kvyVjgtg';
  const BEARER_TOKEN = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
  const MAX_RATE_LIMIT_RETRIES = 6;
  const MAX_NET_RETRIES = 2;
  const MAX_COOLDOWN_MS = 16 * 60 * 1000;
  const FAIL_BREAKER = 8;
  const MAX_LOG_ROWS = 300;
  const LIVE_IDLE_LIMIT = 10;
  const RENDER_MS = 120;
  const RUNNING_NOTICE = t('running_notice');
  const TWEET_KINDS = ['tweet_headers', 'tweets', 'tweet'];
  const STATUS_URL = id => `https://x.com/i/status/${id}`;
  const fmt = v => Number(v || 0).toLocaleString(t_lang);

  /* ==========================================================================
     INSTÂNCIA ANTERIOR (re-colar o script)
     ========================================================================== */
  try {
    const prev = window[GLOBAL_KEY];
    if (prev && typeof prev.destroy === 'function') prev.destroy();
  } catch (_) { /* ignora */ }
  for (const id of [HOST_ID, ...LEGACY_HOST_IDS]) {
    try { document.getElementById(id)?.remove(); } catch (_) { /* ignora */ }
  }

  /* ==========================================================================
     ESTADO
     ========================================================================== */
  const state = {
    running: false,
    stopRequested: false,
    destroyed: false,
    haltReason: null,         // { msg, type } quando o motor pausa sozinho
    mode: 'file',             // 'file' | 'live'
    speed: 'turbo',           // 'turbo' (3 requisições) | 'normal' (1)
    handle: '',
    // modo arquivo
    ids: [],
    source: null,
    loaded: false,
    sourceName: '',
    fileDone: 0,
    // modo live
    liveSeen: new Set(),
    liveSource: null,
    liveDone: false,
    liveEnded: false,
    // controle
    cooldownUntil: 0,
    inflight: 0,
    consecutiveFails: 0,
    results: new Map(),       // chave -> { key, id, kind, status, message, time, url }
    failedKeys: new Set(),    // somente posts (reposts não são repetíveis pela API)
    counters: { deleted: 0, gone: 0, failed: 0 },
    log: [],
    activeFilter: 'all',
    rate: 0,
    tick: { t: 0, n: 0 }
  };

  /* ==========================================================================
     UTILITÁRIOS
     ========================================================================== */
  const sleep = ms => new Promise(res => setTimeout(res, Math.max(0, ms)));
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pad2 = n => String(n).padStart(2, '0');
  const nowStr = () => new Date().toLocaleTimeString(t_lang);
  const stamp = () => {
    const d = new Date();
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
  };

  function fmtDuration(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '—';
    const s = Math.round(sec);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h) return `${h}h ${m}min`;
    if (m) return `${m}min ${s % 60}s`;
    return `${s}s`;
  }

  function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  const getCsrfToken = () => document.cookie.match(/(?:^|;\s*)ct0=([^;]+)/)?.[1] || '';
  const normalizeHandle = v => String(v || '').trim().replace(/^@/, '');
  const isValidHandle = h => /^[A-Za-z0-9_]{1,15}$/.test(String(h || ''));

  function timeoutSignal(ms) {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
    const ctl = new AbortController();
    setTimeout(() => ctl.abort(), ms);
    return ctl.signal;
  }

  function makeTransactionId() {
    return [...crypto.getRandomValues(new Uint8Array(95))]
      .map(x => {
        const i = (x / 255 * 61) | 0;
        return String.fromCharCode(i + (i > 9 ? (i > 35 ? 61 : 55) : 48));
      }).join('');
  }

  /* Conta logada: somente fontes confiáveis. Os palpites por URL/nav da v5.0
     podiam devolver "bookmarks", "grok" ou o perfil de outra pessoa. */
  function detectLoggedInHandle() {
    const link = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
    if (link) {
      const seg = (link.getAttribute('href') || '').replace(/^\/+/, '').split(/[/?#]/)[0];
      if (isValidHandle(seg)) return seg;
    }
    const acct = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
    if (acct) {
      const m = (acct.innerText || acct.textContent || '').match(/@([A-Za-z0-9_]{1,15})/);
      if (m) return m[1];
    }
    return '';
  }

  function isOwnProfileFeed(handle) {
    if (!isValidHandle(handle)) return false;
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || parts[0].toLowerCase() !== handle.toLowerCase()) return false;
    return parts.length === 1 || (parts.length === 2 && parts[1].toLowerCase() === 'with_replies');
  }

  /* ID do post próprio dentro de um <article>. Se o timestamp aponta para outro
     autor (repost, contexto de resposta), não é post próprio. */
  function getOwnStatusId(article, re) {
    const timeLink = article.querySelector('time')?.closest('a');
    if (timeLink) {
      const m = (timeLink.getAttribute('href') || '').match(re);
      return m ? m[1] : '';
    }
    for (const a of article.querySelectorAll('a[href*="/status/"]')) {
      const m = (a.getAttribute('href') || '').match(re);
      if (m) return m[1];
    }
    return '';
  }

  function getAnyStatusId(article) {
    const href = article.querySelector('time')?.closest('a')?.getAttribute('href') || '';
    return href.match(/^\/[A-Za-z0-9_]+\/status\/(\d+)/)?.[1] || '';
  }

  /* ==========================================================================
     PARSER DO BACKUP (tweet-headers.js / tweets.js)
     ========================================================================== */
  function parseArchiveFile(text, filename) {
    const clean = String(text || '').trim();
    if (!clean) throw new Error(t('file_empty'));

    let body = clean;
    const m = clean.match(/^window\.YTD\.([A-Za-z0-9_]+)\.part\d+\s*=\s*/);
    if (m) {
      if (!TWEET_KINDS.includes(m[1])) {
        throw new Error(t('file_invalid_type', m[1]));
      }
      body = clean.slice(m[0].length).replace(/;\s*$/, '');
    } else if (/^[A-Za-z_$][\w$.]*\s*=/.test(clean)) {
      body = clean.slice(clean.indexOf('=') + 1).trim().replace(/;\s*$/, '');
    }

    let data;
    try { data = JSON.parse(body); } catch (_) { throw new Error(t('invalid_json')); }

    const rows = Array.isArray(data) ? data : (data?.tweets || data?.data || []);
    if (!Array.isArray(rows) || !rows.length) throw new Error(t('no_tweets'));

    const ids = [];
    let skipped = 0;
    for (const row of rows) {
      const t = row?.tweet || row;
      const raw = t?.tweet_id ?? t?.id_str ?? t?.id;
      // número JS acima de 2^53 já perdeu precisão: descartar em vez de apagar ID errado
      if (typeof raw === 'number' && !Number.isSafeInteger(raw)) { skipped++; continue; }
      const s = String(raw ?? '').trim();
      if (/^\d{5,25}$/.test(s)) ids.push(s); else skipped++;
    }
    const unique = [...new Set(ids)];
    if (!unique.length) throw new Error(t('no_valid_ids'));
    return { ids: unique, skipped };
  }

  /* ==========================================================================
     FILAS
     ========================================================================== */
  function makeSource(list, wrap) {
    let head = 0;
    const back = [];
    return {
      take() {
        if (back.length) return back.pop();
        return head < list.length ? wrap(list[head++]) : null;
      },
      giveBack(job) { back.push(job); },
      push(x) { list.push(x); },
      remaining() { return back.length + list.length - head; },
      skip(n) { head = Math.min(list.length, Math.max(0, n)); }
    };
  }

  /* ==========================================================================
     REQUISIÇÃO GRAPHQL DeleteTweet
     ========================================================================== */
  const parseJSON = t => { try { return JSON.parse(t); } catch (_) { return null; } };
  const toErr = e => ({
    code: Number(e?.code ?? e?.extensions?.code),
    kind: String(e?.kind || e?.extensions?.kind || ''),
    name: String(e?.name || e?.extensions?.name || ''),
    message: String(e?.message || '')
  });
  const isNotFoundErr = e => e.code === 144 || e.kind === 'NotFound' || e.name === 'NotFoundError' ||
    /no status found|status.{0,20}not found|tweet.{0,20}not found|already deleted/i.test(e.message);
  const isRateErr = e => e.code === 88 || /rate limit/i.test(e.message);
  const isBlockErr = e => e.code === 226 || /might be automated|automated/i.test(e.message);
  const isAuthErr = e => [32, 89, 215].includes(e.code);

  async function waitUntilCooldown() {
    let waited = false;
    while (state.cooldownUntil > Date.now() && !state.stopRequested) {
      waited = true;
      const s = Math.ceil((state.cooldownUntil - Date.now()) / 1000);
      ui.setNotice(t('rate_limit', s), 'warn');
      await sleep(Math.min(1000, Math.max(50, state.cooldownUntil - Date.now())));
    }
    if (waited && !state.stopRequested && !state.haltReason) ui.setNotice(RUNNING_NOTICE);
    return !state.stopRequested;
  }

  async function deleteTweetAPI(id) {
    let rl = 0;
    let net = 0;
    while (!state.stopRequested) {
      if (!(await waitUntilCooldown())) break;
      const csrf = getCsrfToken();
      if (!csrf) return { kind: 'auth', message: t('no_cookie') };

      let response;
      let text = '';
      try {
        response = await fetch(`${window.location.origin}/i/api/graphql/${QUERY_ID}/DeleteTweet`, {
          method: 'POST',
          credentials: 'include',
          referrer: state.handle
            ? `${window.location.origin}/${encodeURIComponent(state.handle)}/with_replies`
            : `${window.location.origin}/home`,
          referrerPolicy: 'strict-origin-when-cross-origin',
          signal: timeoutSignal(18000),
          headers: {
            'authorization': BEARER_TOKEN,
            'content-type': 'application/json',
            'x-csrf-token': csrf,
            'x-client-transaction-id': makeTransactionId(),
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session'
          },
          body: JSON.stringify({ variables: { tweet_id: id, dark_request: false }, queryId: QUERY_ID })
        });
        text = await response.text();
      } catch (err) {
        if (++net <= MAX_NET_RETRIES) { await sleep(500 * net); continue; }
        return { kind: 'failed', message: t('net_timeout', err?.name || 'erro', MAX_NET_RETRIES + 1) };
      }

      const status = response.status;
      const json = parseJSON(text);
      const errs = Array.isArray(json?.errors) ? json.errors.map(toErr) : [];
      const resetHdr = Number(response.headers.get('x-rate-limit-reset'));
      const remainingHdr = response.headers.get('x-rate-limit-remaining');

      // Rate limit: 429 ou erro 88 no corpo
      if (status === 429 || errs.some(isRateErr)) {
        if (++rl > MAX_RATE_LIMIT_RETRIES) return { kind: 'failed', message: t('rate_limit_persistent') };
        let waitMs = 60000;
        if (Number.isFinite(resetHdr) && resetHdr > 0) waitMs = resetHdr * 1000 - Date.now() + 1500;
        waitMs = Math.min(Math.max(waitMs, 2000), MAX_COOLDOWN_MS);
        const until = Date.now() + waitMs;
        if (until > state.cooldownUntil + 500) {
          ui.addLog('wait', t('log_pause'), t('rate_limit_pause', Math.ceil(waitMs / 1000)));
        }
        state.cooldownUntil = Math.max(state.cooldownUntil, until);
        continue;
      }
      if (status === 401 || errs.some(isAuthErr)) {
        return { kind: 'auth', message: t('invalid_session') };
      }
      if (errs.some(isBlockErr)) {
        return { kind: 'blocked', message: t('blocked_automation') };
      }
      if (errs.some(isNotFoundErr)) {
        return { kind: 'gone', message: t('gone_post') };
      }
      if (status >= 200 && status < 300) {
        if (!json) return { kind: 'failed', message: t('invalid_response') };
        if (errs.length) return { kind: 'failed', message: `GraphQL: ${errs[0].message.slice(0, 100) || 'erro sem mensagem'}` };
        if (remainingHdr !== null && remainingHdr !== '' && Number(remainingHdr) < 1 && Number.isFinite(resetHdr) && resetHdr > 0) {
          state.cooldownUntil = Math.max(state.cooldownUntil, Math.min(resetHdr * 1000 + 1500, Date.now() + MAX_COOLDOWN_MS));
        }
        return { kind: 'deleted', message: t('deleted_success') };
      }
      const snippet = (errs[0]?.message || text || '').replace(/\s+/g, ' ').trim().slice(0, 90);
      const hint = status === 404 ? ' (endpoint/queryId possivelmente obsoleto; compare com tweetXer.js)' : '';
      return { kind: 'failed', message: `HTTP ${status}${hint}${snippet ? ': ' + snippet : ''}` };
    }
    return { kind: 'stopped', message: t('stopped') };
  }

  /* Desfazer repost pela interface (mesmo método do tweetXer original) */
  async function waitForSelector(sel, timeout) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      const el = document.querySelector(sel);
      if (el) return el;
      await sleep(50);
    }
    return null;
  }

  async function undoRepostDom(article) {
    const btn = article.querySelector('[data-testid="unretweet"]');
    if (!btn) return { kind: 'gone', message: t('repost_gone') };
    btn.click();
    const confirmBtn = await waitForSelector('[data-testid="unretweetConfirm"]', 4000);
    if (!confirmBtn) return { kind: 'failed', message: t('repost_failed') };
    confirmBtn.click();
    await sleep(300);
    return { kind: 'deleted', message: t('repost_deleted') };
  }

  function fadeArticle(article) {
    try {
      article.style.opacity = '0.3';
      article.style.filter = 'grayscale(1)';
    } catch (_) { /* ignora */ }
  }

  /* ==========================================================================
     MOTOR
     ========================================================================== */
  function recordResult(job, status, message) {
    const key = job.key || job.id;
    const old = state.results.get(key);
    if (old) {
      state.counters[old.status]--;
      state.failedKeys.delete(key);
    }
    if (job.src === 'file') state.fileDone++;
    state.results.set(key, {
      key, id: job.id, kind: job.kind, status, message,
      time: nowStr(), url: STATUS_URL(job.id)
    });
    state.counters[status]++;
    if (status === 'failed' && job.kind !== 'repost') state.failedKeys.add(key);
    const map = { deleted: ['ok', t('log_deleted')], gone: ['gone', t('log_gone')], failed: ['bad', t('log_failed')] };
    ui.addLog(map[status][0], job.kind === 'repost' && status === 'deleted' ? t('log_repost') : map[status][1], message, job.id);
  }

  function haltRun(msg, type = 'warn') {
    if (!state.haltReason) state.haltReason = { msg, type };
    state.stopRequested = true;
    ui.setNotice(msg, type);
    ui.addLog(type === 'error' ? 'bad' : 'wait', t('log_pause'), msg);
  }

  function finalNotice() {
    if (state.haltReason) { ui.setNotice(state.haltReason.msg, state.haltReason.type); return; }
    const c = state.counters;
    if (state.stopRequested) {
      const rem = state.mode === 'file' && state.source ? state.source.remaining() : 0;
      ui.setNotice(state.mode === 'file' ? t('pause_msg', fmt(rem)) : t('live_paused'), 'warn');
      return;
    }
    if (state.mode === 'live' && state.liveEnded) {
      ui.setNotice(t('done_live_msg', fmt(c.deleted), fmt(c.gone), fmt(c.failed)), c.failed ? 'warn' : 'ok');
      return;
    }
    ui.setNotice(t('done_msg', fmt(c.deleted), fmt(c.gone), fmt(c.failed)), c.failed ? 'warn' : 'ok');
  }

  async function runPool(source, live) {
    const conc = state.speed === 'turbo' ? 3 : 1;
    const pause = () => (state.speed === 'turbo' ? rand(0, 30) : rand(100, 220));
    const worker = async () => {
      while (!state.stopRequested) {
        const job = source.take();
        if (!job) {
          if (!live || state.liveDone) break;
          await sleep(80);
          continue;
        }
        state.inflight++;
        let res;
        try { res = await deleteTweetAPI(job.id); }
        catch (err) { res = { kind: 'failed', message: `Exceção: ${err?.message || err}` }; }
        state.inflight--;

        if (res.kind === 'stopped') { source.giveBack(job); break; }
        if (res.kind === 'auth' || res.kind === 'blocked') {
          source.giveBack(job);
          haltRun(res.message, res.kind === 'auth' ? 'error' : 'warn');
          break;
        }
        recordResult(job, res.kind, res.message);
        if (res.kind === 'failed') {
          if (++state.consecutiveFails >= FAIL_BREAKER) {
            haltRun(t('paused_fail', FAIL_BREAKER, res.message), 'error');
          }
        } else {
          state.consecutiveFails = 0;
          if (job.article) fadeArticle(job.article);
        }
        await sleep(pause());
      }
    };
    await Promise.all(Array.from({ length: conc }, worker));
  }

  function scanFeed(re, src) {
    let found = 0;
    const reposts = [];
    for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
      const id = getOwnStatusId(article, re);
      if (id) {
        if (state.liveSeen.has(id)) continue;
        state.liveSeen.add(id);
        src.push({ id, key: id, kind: 'post', src: 'live', article });
        found++;
        continue;
      }
      if (article.querySelector('[data-testid="unretweet"]')) {
        const orig = getAnyStatusId(article);
        const key = orig ? `rt:${orig}` : '';
        if (key && !state.liveSeen.has(key)) {
          state.liveSeen.add(key);
          reposts.push({ id: orig, key, kind: 'repost', src: 'live', article });
        }
      }
    }
    return { found, reposts };
  }

  const engine = {
    async start() {
      if (state.running) return;
      const detected = ui.refreshDetection();
      const typed = normalizeHandle(ui.$('input-handle')?.value);
      state.handle = detected || (isValidHandle(typed) ? typed : '');

      if (!getCsrfToken()) {
        ui.setNotice(t('no_cookie'), 'error');
        return;
      }
      if (state.mode === 'file') {
        if (!state.loaded || !state.source || state.source.remaining() === 0) {
          ui.setNotice(t('load_file_warn'), 'warn');
          return;
        }
        if (state.fileDone === 0) {
          const skip = Math.floor(Number(ui.$('input-skip')?.value) || 0);
          if (skip > 0) { state.source.skip(skip); state.fileDone = Math.min(skip, state.ids.length); }
        }
      } else {
        if (!isValidHandle(state.handle)) {
          ui.showHandleInput();
          ui.setNotice(t('handle_not_detected'), 'error');
          return;
        }
        if (!isOwnProfileFeed(state.handle)) {
          ui.setNotice(t('open_profile_warn'), 'error');
          return;
        }
      }

      state.running = true;
      state.stopRequested = false;
      state.haltReason = null;
      state.consecutiveFails = 0;
      state.rate = 0;
      state.tick = { t: Date.now(), n: state.results.size };
      ui.setNotice(RUNNING_NOTICE);
      ui.render();
      try {
        if (state.mode === 'file') await runPool(state.source, false);
        else await this.runLive();
        finalNotice();
      } catch (err) {
        ui.addLog('bad', t('log_error'), t('critical_error', err?.message || err));
        ui.setNotice(t('critical_error', err?.message || err), 'error');
      } finally {
        state.running = false;
        if (!state.destroyed) state.stopRequested = false;
        ui.render();
      }
    },

    async runLive() {
      const re = new RegExp(`^/${state.handle}/status/(\\d+)`, 'i');
      const src = state.liveSource || (state.liveSource = makeSource([], j => j));
      state.liveDone = false;
      state.liveEnded = false;
      ui.addLog('info', t('log_info'), t('scan_feed', state.handle));
      try { window.scrollTo(0, 0); } catch (_) { /* ignora */ }
      await sleep(800);

      const pool = runPool(src, true);
      let idle = 0;
      let lastH = -1;
      try {
        while (!state.stopRequested) {
          if (!isOwnProfileFeed(state.handle)) {
            haltRun(t('nav_left_profile'), 'error');
            break;
          }
          const { found, reposts } = scanFeed(re, src);
          for (const job of reposts) {
            if (state.stopRequested) break;
            const res = await undoRepostDom(job.article);
            recordResult(job, res.kind, res.message);
            if (res.kind === 'deleted') fadeArticle(job.article);
            await sleep(250);
          }
          while (src.remaining() > 60 && !state.stopRequested) await sleep(100);

          const h = document.documentElement.scrollHeight;
          const busy = state.inflight > 0 || src.remaining() > 0;
          idle = (found === 0 && reposts.length === 0 && h === lastH && !busy) ? idle + 1 : 0;
          lastH = h;
          if (idle >= LIVE_IDLE_LIMIT) { state.liveEnded = true; break; }

          window.scrollBy(0, Math.max(300, Math.round(window.innerHeight * 0.8)));
          await sleep(state.speed === 'turbo' ? 700 : 1000);
        }
      } finally {
        state.liveDone = true;
        await pool;
      }
    },

    async retryFailed() {
      if (state.running || !state.failedKeys.size) return;
      const ids = [...state.failedKeys];
      state.handle = ui.refreshDetection() || state.handle;
      state.running = true;
      state.stopRequested = false;
      state.haltReason = null;
      state.consecutiveFails = 0;
      state.rate = 0;
      state.tick = { t: Date.now(), n: state.results.size };
      ui.setNotice(t('retrying_fails', fmt(ids.length)));
      ui.render();
      try {
        await runPool(makeSource(ids, id => ({ id, key: id, kind: 'post', src: 'retry' })), false);
        finalNotice();
      } catch (err) {
        ui.setNotice(t('error_retry', err?.message || err), 'error');
      } finally {
        state.running = false;
        if (!state.destroyed) state.stopRequested = false;
        ui.render();
      }
    }
  };

  /* ==========================================================================
     INTERFACE (Shadow DOM, tema claro)
     ========================================================================== */
  const ui = {
    host: null,
    shadow: null,
    logDirty: true,
    _timer: 0,

    $(id) { return this.shadow.getElementById(id); },

    init() {
      this.host = document.createElement('div');
      this.host.id = HOST_ID;
      this.host.style.cssText = [
        'position:fixed', 'top:12px', 'right:12px', 'width:clamp(440px,50vw,1200px)',
        'max-width:calc(100vw - 24px)', 'max-height:calc(100vh - 24px)', 'z-index:2147483647'
      ].join(';');
      this.shadow = this.host.attachShadow({ mode: 'open' });
      this.shadow.innerHTML = `
        <style>
          :host { all: initial; display: block; color-scheme: light; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .card {
            display: flex; flex-direction: column; max-height: calc(100vh - 24px);
            background: #ffffff; color: #0f1419; border: 1px solid #cfd9de; border-radius: 14px;
            box-shadow: 0 10px 32px rgba(15, 20, 25, 0.16); overflow: hidden;
            font: 13px/1.4 "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
          }
          .header { display: flex; justify-content: space-between; gap: 8px; padding: 10px 14px; background: #f7f9f9; border-bottom: 1px solid #eff3f4; }
          .title { font-size: 15px; font-weight: 700; }
          .badge-ver { margin-left: 6px; padding: 1px 6px; border-radius: 6px; background: #e1e8ed; color: #536471; font-size: 11px; font-weight: 600; }
          .credit { margin-top: 1px; font-size: 10.5px; color: #536471; }
          .credit a { color: #0c7abf; text-decoration: none; }
          .credit a:hover { text-decoration: underline; }
          .head-btns { display: flex; gap: 2px; align-items: flex-start; }
          .icon-btn { width: 28px; height: 28px; border: 0; border-radius: 8px; background: transparent; color: #536471; font-size: 15px; line-height: 1; cursor: pointer; }
          .icon-btn:hover { background: #e7ecee; }
          .body { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; overflow-y: auto; min-height: 0; }
          .hidden { display: none !important; }
          .box { padding: 9px 10px; border: 1px solid #eff3f4; border-radius: 10px; background: #f7f9f9; }
          .row { display: flex; justify-content: space-between; align-items: center; gap: 8px; color: #536471; }
          .handle { font-weight: 700; color: #0c7abf; }
          .input { width: 100%; margin-top: 6px; padding: 7px 9px; border: 1px solid #cfd9de; border-radius: 8px; background: #fff; color: #0f1419; font: inherit; outline: none; }
          .input.num { width: 76px; margin: 0 4px; padding: 3px 6px; }
          .input:focus-visible { border-color: #1d9bf0; box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.2); }
          .tabs { display: flex; gap: 4px; padding: 3px; border-radius: 10px; background: #eff3f4; }
          .tab { flex: 1; padding: 7px 0; border: 0; border-radius: 8px; background: transparent; color: #536471; font: inherit; font-weight: 600; cursor: pointer; }
          .tab.active { background: #fff; color: #0f1419; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
          .panel { padding: 9px 10px; border: 1px solid #eff3f4; border-radius: 10px; color: #536471; font-size: 12px; }
          .panel code { padding: 0 3px; border-radius: 4px; background: #eff3f4; color: #0f1419; font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; }
          .file-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
          .file-desc { margin-top: 6px; color: #0f1419; font-weight: 600; }
          .speed { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
          .seg { display: flex; gap: 4px; }
          .seg button { padding: 4px 9px; border: 1px solid #cfd9de; border-radius: 7px; background: #fff; color: #536471; font: inherit; font-size: 11.5px; font-weight: 600; cursor: pointer; }
          .seg button.active { border-color: #0f1419; background: #0f1419; color: #fff; }
          .notice { padding: 8px 11px; border: 1px solid #cbe5f7; border-radius: 8px; background: #e8f5fd; color: #0c5f93; font-size: 12px; }
          .notice.ok { border-color: #b7e4cf; background: #e9f8f0; color: #0b6b45; }
          .notice.warn { border-color: #ffe8a3; background: #fff8e6; color: #946300; }
          .notice.error { border-color: #f8c4c7; background: #fdf2f2; color: #b4232f; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
          .stat { padding: 7px 4px; border: 1px solid #eff3f4; border-radius: 8px; background: #f7f9f9; text-align: center; }
          .stat-label { font-size: 11px; font-weight: 600; color: #536471; }
          .stat-val { margin-top: 1px; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; }
          .stat-val.del { color: #00875a; }
          .stat-val.fail { color: #d4222f; }
          .progress-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 4px; font-variant-numeric: tabular-nums; }
          .pct { font-size: 15px; font-weight: 700; }
          .muted { color: #536471; font-size: 11.5px; }
          .bar { height: 8px; overflow: hidden; border-radius: 99px; background: #eff3f4; }
          .fill { height: 100%; width: 0; border-radius: 99px; background: #1d9bf0; transition: width 0.2s ease; }
          .fill.indet { width: 35%; transition: none; animation: slide 1.3s ease-in-out infinite; }
          @keyframes slide { 0% { margin-left: -35%; } 100% { margin-left: 100%; } }
          @media (prefers-reduced-motion: reduce) { .fill.indet { animation: none; width: 100%; opacity: 0.5; } }
          .log-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-weight: 700; }
          .chips { display: flex; gap: 4px; }
          .chip { padding: 3px 8px; border: 0; border-radius: 99px; background: #eff3f4; color: #536471; font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
          .chip.active { background: #1d9bf0; color: #fff; }
          .log { height: clamp(150px, 28vh, 320px); overflow-y: auto; border: 1px solid #eff3f4; border-radius: 8px; font-size: 11.5px; }
          table { width: 100%; border-collapse: collapse; }
          th { position: sticky; top: 0; padding: 5px 6px; background: #f7f9f9; color: #536471; font-size: 11px; font-weight: 600; text-align: left; }
          td { padding: 4px 6px; border-top: 1px solid #eff3f4; vertical-align: middle; }
          td.t { color: #536471; white-space: nowrap; font-variant-numeric: tabular-nums; }
          td.d { color: #536471; }
          .id-link { color: #0c7abf; font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-weight: 600; text-decoration: none; }
          .id-link:hover { text-decoration: underline; }
          .badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; white-space: nowrap; }
          .badge.ok { background: #def7ec; color: #03543f; }
          .badge.gone { background: #eceff1; color: #455a64; }
          .badge.bad { background: #fde8e8; color: #9b1c1c; }
          .badge.wait { background: #fff3cd; color: #7a5200; }
          .badge.info { background: #e1effe; color: #1e429f; }
          .actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px; }
          .btn { padding: 9px 10px; border: 0; border-radius: 99px; font: inherit; font-weight: 700; cursor: pointer; }
          .btn-sm { padding: 6px 12px; font-size: 12px; }
          .btn-primary { background: #1d9bf0; color: #fff; }
          .btn-primary:hover:not(:disabled) { background: #1a8cd8; }
          .btn-danger { background: #d4222f; color: #fff; }
          .btn-danger:hover:not(:disabled) { background: #bc1d29; }
          .btn-sub { background: #eff3f4; color: #0f1419; }
          .btn-sub:hover:not(:disabled) { background: #e2e7eb; }
          .btn:disabled { opacity: 0.45; cursor: not-allowed; }
          button:focus-visible, a:focus-visible { outline: 2px solid #1d9bf0; outline-offset: 2px; }
          .footer { padding: 8px 14px; border-top: 1px solid #eff3f4; background: #f7f9f9; color: #687684; font-size: 10.5px; }
          .footer a { color: #0c7abf; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          .card.collapsed .body, .card.collapsed .footer { display: none; }
        </style>
        <div class="card" id="card">
          <div class="header">
            <div>
              <div class="title">TweetXer Fork <span class="badge-ver">v${VERSION}</span></div>
              <div class="credit">${t('credit1')}</div>
              <div class="credit">${t('credit2')}</div>
            </div>
            <div class="head-btns">
              <button id="btn-min" class="icon-btn" type="button" title="${t('min')}">&#8211;</button>
              <button id="btn-close" class="icon-btn" type="button" title="${t('close')}">&#10005;</button>
            </div>
          </div>
          <div class="body">
            <div class="box">
              <div class="row"><span>${t('logged_in')}</span><span id="handle-label" class="handle">${t('detecting')}</span></div>
              <div id="handle-row" class="hidden"><input id="input-handle" class="input" type="text" placeholder="${t('handle_placeholder')}" autocomplete="off" spellcheck="false"></div>
            </div>
            <div class="tabs">
              <button id="tab-file" class="tab active" type="button">${t('tab_file')}</button>
              <button id="tab-live" class="tab" type="button">${t('tab_live')}</button>
            </div>
            <div id="panel-file" class="panel">
              <p>${t('panel_file_desc')}</p>
              <div class="file-row">
                <button id="btn-pick" class="btn btn-primary btn-sm" type="button">${t('btn_pick')}</button>
                <input id="file-input" type="file" accept=".js,.json" multiple hidden>
                <label>${t('skip_first')}<input id="input-skip" class="input num" type="number" min="0" value="0">${t('items')}</label>
              </div>
              <div id="file-desc" class="file-desc">${t('no_file')}</div>
            </div>
            <div id="panel-live" class="panel hidden">
              <p>${t('panel_live_desc')}</p>
              <div class="file-row"><button id="btn-profile" class="btn btn-sub btn-sm" type="button">${t('btn_profile')}</button></div>
            </div>
            <div class="speed">
              <span>${t('speed')}</span>
              <div class="seg">
                <button id="spd-normal" type="button" title="${t('spd_normal_title')}">${t('spd_normal')}</button>
                <button id="spd-turbo" type="button" class="active" title="${t('spd_turbo_title')}">${t('spd_turbo')}</button>
              </div>
            </div>
            <div id="notice-box" class="notice">${t('ready_notice')}</div>
            <div class="stats">
              <div class="stat"><div class="stat-label">${t('deleted')}</div><div id="st-del" class="stat-val del">0</div></div>
              <div class="stat"><div class="stat-label">${t('gone')}</div><div id="st-gone" class="stat-val">0</div></div>
              <div class="stat"><div class="stat-label">${t('failed')}</div><div id="st-fail" class="stat-val fail">0</div></div>
              <div class="stat"><div class="stat-label">${t('processed')}</div><div id="st-proc" class="stat-val">0</div></div>
            </div>
            <div>
              <div class="progress-head">
                <span id="st-pct" class="pct">0%</span>
                <span id="st-detail" class="muted">0 de 0</span>
                <span id="st-rate" class="muted">—</span>
              </div>
              <div class="bar"><div id="progress-bar" class="fill"></div></div>
            </div>
            <div>
              <div class="log-head">
                <span>${t('log_title', MAX_LOG_ROWS)}</span>
                <div class="chips">
                  <button class="chip active" data-filter="all" type="button">${t('filter_all')}</button>
                  <button class="chip" data-filter="ok" type="button">${t('deleted')}</button>
                  <button class="chip" data-filter="gone" type="button">${t('gone')}</button>
                  <button class="chip" data-filter="bad" type="button">${t('failed')}</button>
                </div>
              </div>
              <div class="log">
                <table>
                  <thead><tr><th>${t('th_time')}</th><th>${t('th_status')}</th><th>${t('th_id')}</th><th>${t('th_detail')}</th></tr></thead>
                  <tbody id="log-body"></tbody>
                </table>
              </div>
            </div>
            <div class="actions">
              <button id="btn-start" class="btn btn-primary" type="button" disabled>${t('btn_start')}</button>
              <button id="btn-stop" class="btn btn-danger" type="button" disabled>${t('btn_stop')}</button>
              <button id="btn-retry" class="btn btn-sub" type="button" disabled>${t('btn_retry')}</button>
              <button id="btn-export" class="btn btn-sub" type="button" disabled>${t('btn_export')}</button>
            </div>
          </div>
          <div class="footer">
            ${t('footer_text')}
          </div>
        </div>
      `;
      document.body.appendChild(this.host);
      window[GLOBAL_KEY] = { host: this.host, destroy };
      this.bindEvents();
      this.refreshDetection();
      this.render();
    },

    refreshDetection() {
      const handle = detectLoggedInHandle();
      const label = this.$('handle-label');
      if (label) label.textContent = handle ? `@${handle}` : t('not_detected');
      if (!handle) this.showHandleInput();
      else this.$('handle-row')?.classList.add('hidden');
      return handle;
    },

    showHandleInput() { this.$('handle-row')?.classList.remove('hidden'); },

    setNotice(msg, type = '') {
      const el = this.$('notice-box');
      if (!el) return;
      el.textContent = msg;
      el.className = `notice ${type}`.trim();
    },

    addLog(type, label, msg, id = '') {
      state.log.unshift({ time: nowStr(), type, label, msg: String(msg), id: String(id || '') });
      if (state.log.length > MAX_LOG_ROWS) state.log.length = MAX_LOG_ROWS;
      this.logDirty = true;
      this.scheduleRender();
    },

    scheduleRender() {
      if (this._timer || state.destroyed) return;
      this._timer = setTimeout(() => { this._timer = 0; this.render(); }, RENDER_MS);
    },

    renderProgress() {
      const bar = this.$('progress-bar');
      const now = Date.now();
      const done = state.results.size;
      if (state.running && now - state.tick.t >= 1000) {
        const inst = (done - state.tick.n) / ((now - state.tick.t) / 1000);
        state.rate = state.rate ? state.rate * 0.6 + inst * 0.4 : inst;
        state.tick = { t: now, n: done };
      }
      if (!state.running) state.rate = 0;

      let pctTxt = '0%';
      let detail;
      let rateTxt = '—';
      if (state.mode === 'file') {
        const total = state.ids.length;
        const pct = total ? Math.min(100, (state.fileDone / total) * 100) : 0;
        pctTxt = `${pct.toLocaleString(t_lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
        detail = `${fmt(state.fileDone)} de ${fmt(total)}`;
        bar.classList.remove('indet');
        bar.style.width = `${pct}%`;
        if (state.running && state.rate > 0.05) {
          const eta = (total - state.fileDone) / state.rate;
          rateTxt = `${state.rate.toLocaleString(t_lang, { maximumFractionDigits: 1 })}/s, ${t('remains', fmtDuration(eta))}`;
        }
      } else {
        pctTxt = state.running ? t('sweeping') : t('stopped_status');
        detail = t('posts_found', fmt(state.liveSeen.size));
        bar.classList.toggle('indet', state.running);
        bar.style.width = '';
        if (state.running && state.rate > 0.05) rateTxt = `${state.rate.toLocaleString(t_lang, { maximumFractionDigits: 1 })}/s`;
      }
      this.$('st-pct').textContent = pctTxt;
      this.$('st-detail').textContent = detail;
      this.$('st-rate').textContent = rateTxt;
    },

    renderLogTable() {
      const tbody = this.$('log-body');
      const f = state.activeFilter;
      const rows = state.log.filter(it => f === 'all' || it.type === f);
      if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#8899a6;padding:12px;">${t('no_records')}</td></tr>`;
        return;
      }
      tbody.innerHTML = rows.map(it => {
        const idHtml = /^\d{5,25}$/.test(it.id)
          ? `<a class="id-link" href="${STATUS_URL(it.id)}" target="_blank" rel="noopener noreferrer" title="${t('open_post_validate')}">${it.id}</a>`
          : '<span style="color:#8899a6;">-</span>';
        return `<tr><td class="t">${escapeHTML(it.time)}</td><td><span class="badge ${escapeHTML(it.type)}">${escapeHTML(it.label)}</span></td><td>${idHtml}</td><td class="d">${escapeHTML(it.msg)}</td></tr>`;
      }).join('');
    },

    render() {
      if (state.destroyed || !this.shadow) return;
      const c = state.counters;
      this.$('st-del').textContent = fmt(c.deleted);
      this.$('st-gone').textContent = fmt(c.gone);
      this.$('st-fail').textContent = fmt(c.failed);
      this.$('st-proc').textContent = fmt(state.results.size);
      this.renderProgress();
      if (this.logDirty) { this.logDirty = false; this.renderLogTable(); }

      const canStart = !state.running && (state.mode === 'live' || (state.loaded && !!state.source && state.source.remaining() > 0));
      this.$('btn-start').disabled = !canStart;
      this.$('btn-stop').disabled = !state.running;
      this.$('btn-retry').disabled = state.running || state.failedKeys.size === 0;
      this.$('btn-export').disabled = state.results.size === 0;
      this.$('tab-file').classList.toggle('active', state.mode === 'file');
      this.$('tab-live').classList.toggle('active', state.mode === 'live');
      this.$('panel-file').classList.toggle('hidden', state.mode !== 'file');
      this.$('panel-live').classList.toggle('hidden', state.mode !== 'live');
      this.$('spd-normal').classList.toggle('active', state.speed === 'normal');
      this.$('spd-turbo').classList.toggle('active', state.speed === 'turbo');
    },

    bindEvents() {
      const $ = id => this.$(id);

      // Evita que atalhos de teclado do X reajam ao digitar nos campos do painel
      this.shadow.querySelectorAll('input[type="text"], input[type="number"]').forEach(inp => {
        ['keydown', 'keyup', 'keypress'].forEach(ev => inp.addEventListener(ev, e => e.stopPropagation()));
      });

      $('tab-file').addEventListener('click', () => {
        if (state.running) return;
        state.mode = 'file';
        this.render();
      });
      $('tab-live').addEventListener('click', () => {
        if (state.running) return;
        state.mode = 'live';
        state.liveSeen.clear();
        state.liveSource = null;
        this.setNotice(t('live_mode_start'));
        this.render();
      });
      $('spd-normal').addEventListener('click', () => { if (!state.running) { state.speed = 'normal'; this.render(); } });
      $('spd-turbo').addEventListener('click', () => { if (!state.running) { state.speed = 'turbo'; this.render(); } });

      this.shadow.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          this.shadow.querySelectorAll('.chip').forEach(ch => ch.classList.remove('active'));
          btn.classList.add('active');
          state.activeFilter = btn.dataset.filter;
          this.logDirty = true;
          this.render();
        });
      });

      $('btn-profile').addEventListener('click', async () => {
        if (state.running) return;
        const handle = this.refreshDetection();
        if (!handle) { this.setNotice(t('open_manual'), 'warn'); return; }
        try {
          if (!isOwnProfileFeed(handle)) {
            const link = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
            if (link) { link.click(); await sleep(1500); }
          }
          const tab = document.querySelector('a[role="tab"][href$="/with_replies"]') || document.querySelector('a[href$="/with_replies"]');
          if (tab) tab.click();
          await sleep(800);
          if (isOwnProfileFeed(handle)) this.setNotice(t('profile_opened'), 'ok');
          else this.setNotice(t('fail_open_profile'), 'warn');
        } catch (err) {
          this.setNotice(t('critical_error', err?.message || err), 'warn');
        }
      });

      // Importar arquivo(s). Em Shadow DOM, e.target vira nulo após um await; por isso
      // o input é capturado em variável (a v5.0 usava e.target após await e quebrava).
      const fileInput = $('file-input');
      $('btn-pick').addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async () => {
        const files = Array.from(fileInput.files || []);
        try { fileInput.value = ''; } catch (_) { /* ignora */ }
        if (!files.length || state.running) return;
        $('file-desc').textContent = t('reading_files', files.length);
        const merged = [];
        const seen = new Set();
        const problems = [];
        const names = [];
        for (const f of files) {
          try {
            const parsed = parseArchiveFile(await f.text(), f.name);
            for (const id of parsed.ids) if (!seen.has(id)) { seen.add(id); merged.push(id); }
            names.push(f.name);
          } catch (err) {
            problems.push(`${f.name}: ${err?.message || err}`);
          }
        }
        if (!merged.length) {
          state.ids = [];
          state.source = null;
          state.loaded = false;
          state.fileDone = 0;
          $('file-desc').textContent = t('error_load');
          this.setNotice(problems.join(' | ') || t('no_valid_ids_found'), 'error');
        } else {
          state.ids = merged;
          state.source = makeSource(merged, id => ({ id, key: id, kind: 'post', src: 'file' }));
          state.loaded = true;
          state.fileDone = 0;
          state.sourceName = names.join(', ');
          $('input-skip').value = '0';
          $('file-desc').textContent = t('posts_loaded', fmt(merged.length), names.join(', '));
          this.setNotice(
            problems.length ? t('posts_ready_ignored', fmt(merged.length), problems.join(' | ')) : t('posts_ready', fmt(merged.length)),
            problems.length ? 'warn' : 'ok'
          );
          this.addLog('info', t('log_info'), t('file_loaded', fmt(merged.length)));
        }
        this.render();
      });

      $('btn-start').addEventListener('click', () => engine.start());
      $('btn-stop').addEventListener('click', () => {
        state.stopRequested = true;
        this.setNotice(t('stopping'), 'warn');
        this.render();
      });
      $('btn-retry').addEventListener('click', () => engine.retryFailed());
      $('btn-export').addEventListener('click', exportCSV);

      $('btn-min').addEventListener('click', () => this.$('card').classList.toggle('collapsed'));
      $('btn-close').addEventListener('click', () => {
        if (state.running) { this.setNotice(t('close_warn'), 'warn'); return; }
        destroy();
      });
    }
  };

  /* ==========================================================================
     EXPORTAÇÃO CSV (separador ";" para Excel pt-BR)
     ========================================================================== */
  const csvCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

  function exportCSV() {
    if (!state.results.size) return;
    const header = [t('csv_time'), t('csv_type'), t('csv_status'), t('csv_id'), t('csv_msg'), t('csv_url')];
    const lines = [header.join(';')];
    for (const r of state.results.values()) {
      const msg = /^[=+\-@]/.test(r.message) ? `'${r.message}` : r.message;
      lines.push([
        csvCell(r.time),
        csvCell(r.kind === 'repost' ? 'repost' : 'post'),
        csvCell(r.status),
        csvCell(`="${r.id}"`),   // força texto no Excel (evita 1,85E+18)
        csvCell(msg),
        csvCell(r.url)
      ].join(';'));
    }
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tweetxer-relatorio-${state.handle || 'x'}-${stamp()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  /* ==========================================================================
     ENCERRAMENTO
     ========================================================================== */
  function destroy() {
    state.destroyed = true;
    state.stopRequested = true;
    try { ui.host?.remove(); } catch (_) { /* ignora */ }
    if (window[GLOBAL_KEY]?.host === ui.host) delete window[GLOBAL_KEY];
  }

  /* ==========================================================================
     INICIALIZAÇÃO
     ========================================================================== */
  ui.init();
  ui.addLog('info', t('log_info'), `TweetXer Fork v${VERSION} ${t('ready')}`);
  console.info(`[TweetXer Fork v${VERSION}] ${t('panel_loaded')}. Fork by Fabricio Sasaki. Original: TweetXer, de Luca Hammer (https://github.com/lucahammer/tweetXer).`);
})();
