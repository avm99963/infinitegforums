# Features

The TW Power Tools extension offers the following features:

[TOC]

## Geral

### Tema escuro

Permite escolher entre um tema escuro personalizado e o tema claro vanilla no Console da Comunidade.

*** promo
_Automatic:_ usará o tema definido nas configurações do sistema.  
_Manual:_ adicionará um botão ao Console da Comunidade que permite alternar o tema.
***

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/ccDarkTheme/presentation/options/assets/screenshot.avif)

### Redirecionar para o Console da Comunidade

Redireciona todos os threads abertos no Tailwind Basic para o Console da Comunidade.

_Vento favorável básico_

### Modo compacto

Reduza os espaços em branco na interface do usuário.

_Vento favorável básico, Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/uiSpacing/presentation/options/assets/screenshot.avif)

### Attempt to fix performance issues

Best-effort workaround for the issues discussed at [pekb/381989895](https://support.google.com/s/community/forum/51488989/thread/381989895).

_Console da comunidade_

### Pequenas melhorias na interface do usuário

#### Cabeçalhos da barra lateral fixa

Torna os cabeçalhos das seções recolhíveis na barra lateral fixos para que não desapareçam ao rolar para baixo.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/stickySidebarHeaders/presentation/options/assets/demo.avif)

#### Ocultar barra lateral por padrão

Oculta a barra lateral ao abrir o Console da Comunidade.

_Console da comunidade_

#### Ponto de notificação de anúncios em destaque

Mostra com mais destaque o ponto que aparece no Console da Comunidade quando os Googlers publicam um novo anúncio.

_Console da comunidade_

## Listas de tópicos

### Avatares

Mostra avatares dos participantes ao lado de cada tópico.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/avatars/presentation/options/assets/screenshot.avif)

### Notificar atualizações

Exibe uma notificação não intrusiva quando uma lista de tópicos tem novas atualizações.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/autoRefresh/presentation/options/assets/screenshot.avif)

### Rolagem infinita

Carrega mais tópicos automaticamente ao rolar para baixo.

*** promo
O Community Console já tem esse recurso integrado, sem a necessidade da extensão.
***

_Vento favorável básico_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread_list.avif)

### Ações massivas

#### Bloqueio em massa

Adiciona um botão para bloquear todos os tópicos selecionados de uma só vez.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/batchLock/presentation/options/assets/demo.avif)

#### Movimento em massa

Adiciona um botão para mover todos os tópicos selecionados de uma só vez.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkMove/presentation/options/assets/demo.avif)

### Pequenas melhorias na interface do usuário

#### Barra de ferramentas de ações em massa fixas

Makes the toolbar not disappear when scrolling down.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/fixedToolbar/presentation/options/assets/demo.avif)

#### Coloque o botão de expansão à esquerda

Coloca o botão "expandir tópico" totalmente à esquerda.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/repositionExpandThread/presentation/options/assets/screenshot.avif)

#### Aumentar o contraste

Aumenta o contraste entre o fundo de tópicos lidos e não lidos.

_Console da comunidade_

## Tópicos

### Achatar respostas

Mostra uma alternância que permite desabilitar a visualização aninhada para exibir as respostas simplificadas.

_Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/flattenThreads/presentation/options/assets/demo.avif)

### Contagem de mensagens OP

Exibe um emblema ao lado do nome de usuário do OP com o número de mensagens postadas por ele.

_Vento favorável básico, Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/profileIndicator/presentation/options/assets/screenshot.avif)

### Rolagem infinita

Carrega automaticamente mais respostas ao rolar para baixo.

_Vento favorável básico, Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread.avif)

### Alterar o design da página do tópico

Força a exibição do design da página do tópico novo ou antigo.

*** promo
O antigo design da página de tópicos está parcialmente quebrado, mas esse recurso foi mantido, pois alguns PEs dependem dele para acessar alguns recursos que estão faltando no novo design.
***

_Console da comunidade_

### Ações massivas

#### Relate respostas rapidamente

Adiciona botões de relatório rápido a todas as respostas, para que você possa denunciar cada uma com um único clique.

_Vento favorável básico, Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkReportReplies/presentation/options/assets/demo.avif)

### Pequenas melhorias na interface do usuário

#### Limitar o tamanho da imagem

Evita que imagens embutidas em mensagens sejam maiores que a janela atual.

_Vento favorável básico, Console da comunidade_

## Editor de mensagens

### Corrigir o diálogo de links.

Corrige o erro que faz com que a janela de diálogo de links seja aberta incorretamente várias vezes ao adicionar ou editar um link.

_Console da comunidade_

## Editor de texto antigo

*** promo
Esses recursos afetam apenas o antigo compositor de mensagens do Console da Comunidade, que é exibido ao criar uma nova discussão ou resposta pronta, ao pressionar `r` dentro de uma discussão ou ao criar uma nova resposta na visualização de discussão antiga. O novo compositor de mensagens não sofre com esses problemas.
***

### Corrigir links de arrastar e soltar

Permite arrastar e soltar links para o editor de texto, preservando o texto do link.

_Console da comunidade_

### Bloquear salvamento de rascunhos

Bloqueia o salvamento de rascunhos das suas respostas enquanto você digita nos servidores do Google no Console da Comunidade.

_Console da comunidade_

### Carregar rascunhos de mensagens ao responder

Habilita o sinalizador `enableLoadingDraftMessages` do Console da Comunidade, que permite recuperar um rascunho existente salvo nos servidores do Google quando você inicia uma nova resposta.

_Console da comunidade_

## Perfis

### Atividade por fórum

Exibe um gráfico de atividades por fórum nos perfis.

_Vento favorável básico, Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/extraInfo/presentation/options/assets/per_forum_stats.avif)

### Postagens anteriores

Exibe um link "postagens anteriores" nos perfis dos usuários.

_Vento favorável básico, Console da comunidade_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/previousPosts/presentation/options/assets/screenshot.avif)

