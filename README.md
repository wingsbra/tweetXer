# tweetXer Fork – Extermine seus Posts do X (Twitter)

Fork oficial baseado no projeto de [Luca Hammer](https://github.com/lucahammer/tweetXer) (fonte original: [tweetXer.js](https://raw.githubusercontent.com/lucahammer/tweetXer/main/tweetXer.js)), adaptado e otimizado para exclusão em massa rápida com interface moderna em tema claro, suporte a múltiplos idiomas (PT-BR, EN, ES) e detecção automática do navegador.

> **Fork by:** Fabricio Sasaki  
> **Powered by AI:** ChatGPT, DeepSeek, Gemini, Claude

---

## 🎯 Objetivo
Excluir todos os posts da sua conta logada no **x.com** da forma mais rápida e segura possível, utilizando o console do navegador (`F12`) ou executando diretamente via script copiado em arquivo `.txt`.

---

## 🚀 Como Usar (Modo Rápido / Copiar e Colar)

1. Acesse e faça login na sua conta no [X (Twitter)](https://x.com).
2. Abra o console do desenvolvedor no navegador (`F12` ou `Ctrl+Shift+I` / `Cmd+Option+I`).
   * *Nota do Chrome:* Se o console bloquear a colagem de códigos, digite `allow pasting` e pressione `Enter` antes de colar.
3. Copie o código completo do script atualizado (`tweetXer.js`) do seu repositório para a área de transferência.
4. Cole o script inteiro no console e pressione `Enter`.
5. Um painel moderno e flutuante aparecerá no canto superior direito da tela.

---

## ⚙️ Modos de Exclusão Disponíveis

O painel oferece duas formas principais para apagar seus registros:

1. **Backup do X (Arquivo):** 
   * **Como funciona:** Você carrega o arquivo oficial do seu backup do X (selecionando `tweet-headers.js` ou `tweets.js`).
   * **Vantagem:** É o método mais rápido e recomendado, pois alcança posts antigos que o feed do perfil já não carrega na interface web.
2. **Live (Feed do Perfil):**
   * **Como funciona:** O script varre automaticamente o seu perfil na aba de respostas (`/seu-usuario/with_replies`), rolando o feed, excluindo os posts via API e desfazendo os reposts diretamente pela interface.

<img width="986" height="846" alt="image" src="https://github.com/user-attachments/assets/8e0599f9-cad2-42ee-be45-dc2c1d337995" />

---

## 📊 Principais Recursos do Fork

* **Interface Light e Limpa:** Painel flutuante adaptado em tema claro, ocupando proporção confortável (~50% da tela) sem pop-ups incômodos de confirmação.
* **Barra de Progresso com Métricas:** Acompanhe em tempo real a taxa de exclusão por segundo, tempo estimado restante (ETA), contadores de itens concluídos, ausentes e falhas.
* **Validação por ID (Links Diretos):** Cada linha do registro (*Log*) inclui o ID do post como um link interativo direto para checar no X e validar que o conteúdo foi realmente removido.
* **Exportação em CSV:** Permite exportar um relatório detalhado com formatação otimizada para planilhas (como o Excel, tratando IDs como texto para evitar notação científica).
* **Controle de Velocidade:** Alterne entre os modos **Normal (1x)** e **Turbo (3x)** com pausa inteligente e automática em caso de atingir limites de requisição (*Rate Limit* do X).
* **Suporte a Múltiplos Idiomas (i18n):** O script detecta automaticamente o idioma do seu navegador e exibe a interface em **Português (PT-BR)**, **Espanhol (ES)** ou **Inglês (EN)**.

---

## 📄 Licença
Este projeto mantém os termos originais da licença [Do No Harm License v0.3 (NoHarm)](https://github.com/raisely/NoHarm). Consulte o arquivo `LICENSE` no repositório para mais detalhes.
