# 🚀 TweetXer Fork v7.7 - O "Megazord" Definitivo

Um script poderoso, inteligente e seguro para excluir todos os seus posts e retweets do X (antigo Twitter) diretamente pelo console do navegador. 

Este fork foi aprimorado com a ajuda de IAs (ChatGPT, DeepSeek, Gemini e Claude) para unir as melhores ideias de dezenas de outros forks em uma única ferramenta definitiva.

---

## ✨ O que há de novo na v7.7? (Recursos Exclusivos)

Diferente de scripts antigos que travam ou gastam seu limite de requisições à toa, esta versão possui algoritmos avançados para economizar seu tempo e proteger sua conta:

*   🧠 **Smart Cache (Memória Inteligente):** O script salva os IDs dos tweets deletados no seu navegador. Se você parar e voltar amanhã, ele ignora instantaneamente o que já foi apagado, sem gastar requisições.
*   🚀 **Sonda Exponencial (Smart Probe):** Já usou outro app para apagar tweets no passado? O script detecta "zonas fantasmas" e pula exponencialmente (100, 200, 400, 800 IDs de uma vez) gastando apenas 1 requisição do seu limite para pular milhares de tweets inexistentes.
*   ⏳ **Auto-Resume com Cronômetro:** Se você atingir o *Rate Limit* (limite do X), o script não trava. Ele exibe um cronômetro visual no botão (ex: `Pausado (15m)`) e retoma a exclusão automaticamente quando o tempo acaba.
*   🔄 **Fallback Inteligente (Erro 403):** Se a API padrão falhar ao tentar apagar um Retweet antigo, o script tenta automaticamente a API de `DeleteRetweet`.
*   🎛️ **Filtros na Interface:** Sem precisar editar código, você pode:
    *   Pular Retweets.
    *   Preservar tweets recentes (ex: manter os últimos 30 dias).
    *   Preservar tweets populares (ex: manter tweets com mais de 100 curtidas).
*   📊 **Exportação de Log:** Acompanhe o progresso em tempo real e exporte um arquivo `.csv` com o status de cada ID deletado.
*   🌍 **Multilíngue e Interface Clean:** Painel flutuante, arrastável e minimizável. Detecta automaticamente o idioma do seu navegador (PT-BR, EN, ES).

---

## 🛠️ Como usar

Você pode usar o script de duas maneiras: **Modo Arquivo (Recomendado)** ou **Modo Live**.

### Passo 1: Preparação
1. Abra o [X.com](https://x.com) no seu computador e certifique-se de estar logado.
2. Pressione `F12` no teclado para abrir as Ferramentas de Desenvolvedor (Developer Tools).
3. Vá até a aba **Console**.
4. Copie todo o código do arquivo [`tweetXer.js`](https://github.com/wingsbra/tweetXer/blob/main/tweetXer.js) deste repositório.
5. Cole o código no Console e aperte `Enter`.
   > ⚠️ **Aviso do Chrome:** Se o navegador não deixar você colar e exibir um aviso de segurança, digite `allow pasting` no console, aperte Enter, e depois cole o código do script.

### Passo 2: Escolha o Modo no Painel

#### Opção A: Modo Backup (Arquivo) - *Mais rápido e completo*
1. Peça o arquivo de dados da sua conta no X (Configurações > Sua conta > Faça o download de um arquivo com seus dados).
2. Extraia o arquivo `.zip` baixado.
3. No painel do TweetXer, clique em **Escolher arquivo** e selecione o arquivo `tweets.js` (ou `tweet-headers.js`) que está dentro da pasta `data` do seu backup.
4. Ajuste os filtros se desejar (Pular RTs, preservar dias/curtidas).
5. Clique em **Iniciar Exclusão**.

#### Opção B: Modo Live (Feed) - *Para quem não tem o backup*
1. No painel do TweetXer, clique na aba **Live (Feed)**.
2. Clique no botão **Abrir meu perfil** (ele te levará para a aba `/with_replies`).
3. Clique em **Iniciar Exclusão**. O script vai rolar a tela automaticamente e apagar tudo o que aparecer pela frente.

---

## ⚠️ Limites do X (Rate Limits)
O X permite deletar cerca de **200 a 300 tweets a cada 15 minutos**. 
Não se preocupe: o TweetXer v7.7 gerencia isso para você. Quando o limite for atingido, ele entrará em modo de pausa, mostrará o cronômetro e voltará a trabalhar sozinho. Deixe a aba aberta e vá tomar um café!

---

## ☕ Apoie o Projeto

Este fork deu muito trabalho para ser refinado com algoritmos de busca exponencial e cache inteligente. Se ele salvou sua vida (e sua conta), considere pagar um café!

<a href='https://ko-fi.com/V7V3BQZHM' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

## 📜 Créditos
* **Fork e Melhorias (v7.x):** Fabricio Sasaki ([@wingsbra](https://github.com/wingsbra)) com auxílio de IAs (ChatGPT, DeepSeek, Gemini, Claude).
* **Script Original:** Criado por [Luca Hammer](https://github.com/lucahammer/tweetXer).
* Inspirado em melhorias da comunidade open-source.
