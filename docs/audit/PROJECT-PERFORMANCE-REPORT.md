# Revisão de desempenho dos projetos

## Problema encontrado

As sete páginas carregavam o visual original e aplicavam o rebrand somente no fim do HTML, por JavaScript. Isso causava troca visível de tema, recálculo de layout e múltiplas folhas concorrentes.

Cada página também carregava:

- Tailwind Play CDN e sua compilação em tempo de execução;
- configuração Tailwind inline;
- CSS e JavaScript do antigo painel ROD;
- CSS, definições e JavaScript do antigo tour;
- shell e tema compartilhados depois da renderização.

O RDP Insider ainda compilava sete arquivos JSX no navegador com Babel. O Relatório Interativo baixava seis bibliotecas antes de qualquer arquivo ser selecionado. O Controle de Acesso carregava TensorFlow e COCO-SSD mesmo durante a leitura do estudo de caso.

## Alterações aplicadas

### Base visual

- Tailwind passou a ser compilado antes da publicação.
- Utilitários, shell e rebrand foram consolidados em `project-base.css`.
- O CSS definitivo passou a ser carregado no `<head>`.
- Tailwind Play CDN, configurações inline e fontes do Google foram removidos dos sete projetos.
- A página não troca mais do tema antigo para o tema novo depois de abrir.

### ROD

- O motor completo e o tour deixaram de ser carregados em cada projeto.
- O shell cria um único lançador leve com contexto do projeto.
- A logo acompanha automaticamente o tema claro ou escuro.

### RDP Insider

- Babel foi removido.
- Os sete arquivos JSX foram pré-compilados em um bundle de aproximadamente 22 KB.
- React e ReactDOM 18.3.1 passaram a ser servidos localmente.
- Imagens do feed usam `loading="lazy"` e `decoding="async"`.
- Falhas de imagens externas recebem fallback local.
- O fundo externo do Unsplash foi removido.

### Relatório Interativo

- PapaParse, SheetJS, Chart.js e o adaptador de datas são carregados apenas ao processar dados.
- html2canvas e jsPDF são carregados apenas ao exportar PDF.
- A abertura do dashboard não baixa antecipadamente essas seis bibliotecas.
- Falhas de conexão recebem uma mensagem compreensível e não quebram a página.

### Controle de Acesso Vision

- TensorFlow.js, backend WebGL e COCO-SSD são carregados apenas ao iniciar a câmera.
- A leitura do case não baixa o modelo de visão computacional.
- Falhas de rede ou permissão permanecem contidas no estado da demonstração.

### Assistente de Vendas e Igreja Casa

- A simulação de conversa só executa quando está visível.
- A animação respeita `prefers-reduced-motion`.
- O relógio deixou de atualizar a cada segundo.
- As partículas decorativas da página Igreja Casa deixaram de ser criadas.

## Resultado medido

Teste executado com rede externa bloqueada, em 390 × 900 e 1440 × 900:

- 14 de 14 cenários com HTTP 200;
- abertura entre aproximadamente 0,9 e 1,7 segundo;
- zero erro JavaScript;
- zero overflow horizontal;
- zero carregamento de Tailwind Play CDN;
- zero Babel no navegador;
- zero painel ou tour ROD legado;
- uma única folha-base compartilhada por projeto;
- um único shell e um único lançador ROD.

O Validador Fortigate continuou processando duas entradas válidas. O RDP Insider renderizou o banco local mesmo sem rede externa. Temas e idioma continuaram funcionando.

## Dependências que continuam externas

- Font Awesome, usado pelos ícones das páginas legadas;
- Mermaid, usado pela arquitetura do Assistente de Vendas;
- bibliotecas carregadas sob demanda pelo Relatório;
- TensorFlow e COCO-SSD, carregados sob demanda pela demonstração de câmera;
- imagens e links editoriais provenientes das fontes do RDP Insider.

Essas dependências não bloqueiam mais a abertura das ferramentas críticas. Uma etapa futura pode versionar Font Awesome e Mermaid localmente.

## Reprodução

Gerar novamente o CSS estático:

```powershell
npx.cmd --yes tailwindcss@3.4.17 -c tailwind.projects.config.cjs -i assets/css/project-utilities.source.css -o assets/css/project-utilities.css --minify
node tools\optimize-project-assets.cjs
```

Gerar novamente o bundle do RDP Insider:

```powershell
npx.cmd --yes esbuild@0.25.8 projects/scanner-game-free/js/app-entry.jsx --bundle --minify --loader:.js=jsx --format=iife --outfile=projects/scanner-game-free/js/app.bundle.js
```

Validar:

```powershell
node tools\validate-project-performance.cjs
```
