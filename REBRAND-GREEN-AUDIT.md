# Auditoria do rebrand verde — RDP Studio

Data da revisão: 27 de julho de 2026  
Branch de trabalho: `rebrand/green-palette-review`  
Base: `6c856051295e6ccd374d7f6e1a0220d25cf8f256`

## O que foi alterado

- Removido o subtítulo “projetos de Marcelo Rodrigues” da marca no cabeçalho.
- Reduzidos a altura e o tamanho tipográfico da primeira dobra.
- Substituída a chamada “Projetos que nascem do trabalho real” por uma descrição objetiva do acervo.
- Substituídos os seletores nativos de tema e idioma por controles próprios, alinhados e acessíveis.
- Criados quatro modos visuais: Sistema, Pistache, Eucalipto e Contraste.
- Aplicada a paleta Black Glaze (`#061611`), Eucalyptus (`#166b5d`) e Pistachio (`#b2d98b`).
- O catálogo agora abre diretamente a experiência real de cada projeto.
- Os destaques da home também levam diretamente à ferramenta, produto ou apresentação correspondente.
- A camada compartilhada dos sete projetos passou a usar a mesma paleta e a mesma família tipográfica, sem alterar a lógica interna das ferramentas.
- Adicionadas imagens provisórias para todos os projetos e teste automatizado de responsividade.

## Decisão sobre bibliotecas de tema

Foram avaliados daisyUI Theme Controller, Open Props e Radix Colors.

- daisyUI foi descartado porque exigiria adotar sua camada visual e aumentaria a semelhança com templates.
- Open Props e Radix Colors são boas fontes de escalas e tokens, mas não resolvem o problema específico dos controles.
- A implementação escolhida usa `details`, botões nativos, custom properties e `color-scheme`. Isso reduz dependências, mantém teclado e foco e permite que a identidade continue própria.

## Teoria de cor aplicada

As três cores não são usadas com o mesmo peso:

- Black Glaze é o fundo principal do modo escuro.
- Eucalyptus organiza superfícies, ações e separações.
- Pistachio é reservado para foco, seleção e destaques.
- No modo claro, o fundo é um branco esverdeado, evitando transformar o Pistachio em uma grande área de baixo contraste.
- O modo Contraste aumenta separação entre texto, superfícies e bordas.

O sistema usa cor como reforço, não como única forma de comunicar estado.

## Mapa de destinos

| Projeto | Ação principal | Destino |
| --- | --- | --- |
| Controle de Acesso Vision | Abrir estudo de caso | `projects/controle-acesso-visao/index.html` |
| Igreja Casa Hub | Ver apresentação | `projects/igreja-casa/index.html` |
| RDP Insider | Abrir dashboard | `projects/scanner-game-free/index.html` |
| Validador Fortigate | Usar ferramenta | `projects/validador-firewall/index.html` |
| GLPI Automator | Ver automação documentada | `projects/abertura-chamados-glpi/index.html` |
| Assistente de Vendas IA | Abrir demonstração | `projects/assistente-vendas-ia/index.html` |
| Relatório Interativo | Abrir dashboard | `projects/relatorio-interativo/index.html` |

A página intermediária `hub/projeto.html` permanece por compatibilidade com links existentes, mas deixou de ser o caminho principal.

## Resultado dos testes

### Hub

- Home desktop: sem erro JavaScript e sem rolagem horizontal.
- Home mobile em 390 px: sem sobreposição e sem rolagem horizontal.
- Catálogo desktop: sete projetos renderizados.
- Catálogo mobile em 390 px: sete projetos renderizados e sem sobreposição.
- Quatro opções de tema detectadas.
- Português e inglês persistem no armazenamento local.

### Projetos

Todos os sete endereços locais responderam com HTTP 200. A execução offline revelou dependências externas críticas.

| Projeto | HTML abre | Funciona totalmente offline | Observação |
| --- | --- | --- | --- |
| Controle de Acesso Vision | Sim | Não | Tailwind, Font Awesome, TensorFlow.js e COCO-SSD externos; câmera exige permissão e contexto seguro. |
| Igreja Casa Hub | Sim | Não | Tailwind, fontes e Font Awesome externos. A aplicação publicada é externa ao repositório. |
| RDP Insider | Sim | Não | React, ReactDOM, Babel, Tailwind e Font Awesome externos. Sem eles, o produto não monta. |
| Validador Fortigate | Sim | Parcial | Lógica local existe, mas apresentação depende de Tailwind, fontes e ícones externos. |
| GLPI Automator | Sim | Não aplicável | É uma apresentação; o código Python real e as credenciais não estão no repositório. |
| Assistente de Vendas IA | Sim | Parcial | O simulador abre, mas Mermaid, Tailwind, fontes e ícones são externos; backend real não está completo no repositório. |
| Relatório Interativo | Sim | Não | SheetJS, PapaParse, Chart.js, jsPDF, html2canvas, Tailwind e ícones são externos. |

## Imagens

### Imagens reais disponíveis

- Igreja Casa Hub: painel administrativo, área do cliente, portal Wi-Fi e logos.
- Validador Fortigate: exemplo de entrada e imagem de feedback.
- Relatório Interativo: identidade TecnoIT, sem captura completa do dashboard.

### Imagens ainda faltantes

- Controle de Acesso Vision: captura aprovada da demonstração com modelo carregado.
- RDP Insider: captura do feed e do Epic Dashboard com dados carregados.
- Validador Fortigate: captura da ferramenta após uma conversão bem-sucedida.
- GLPI Automator: evidência anonimizada do fluxo real ou captura documental aprovada.
- Assistente de Vendas IA: captura do simulador e indicação clara do que é demonstração.
- Relatório Interativo: dashboard preenchido, conferência e prévia do PDF.

As capturas em `assets/images/projects/` foram geradas a partir das páginas locais e são provisórias. Como as bibliotecas externas foram bloqueadas no ambiente de teste, algumas ficaram incompletas e não devem ser tratadas como material final.

## Código ausente ou restrito

- Código original do TCC de Controle de Acesso Vision: não está disponível.
- Código operacional do GLPI Automator: privado/restrito.
- Backend, regras comerciais e integrações completas do Assistente de Vendas: parciais ou externos.
- Código da aplicação hospedada do Igreja Casa: não está integralmente neste repositório.
- Dependências front-end dos projetos: não estão empacotadas localmente.

## Projetos incompletos ou dependentes de validação

- Controle de Acesso Vision é uma reconstrução documental; a demo atual não reproduz integralmente o sistema original.
- Assistente de Vendas é uma demonstração e não deve ser descrito como operação comercial autônoma sem evidência adicional.
- GLPI Automator não pode ser testado ponta a ponta sem código, GLPI de teste e credenciais.
- RDP Insider depende de dados e bibliotecas externas para montar a interface.
- Relatório Interativo precisa de arquivos de exemplo aprovados para um teste repetível de importação, auditoria e PDF.

## O que não foi possível concluir

- Testar câmera e inferência do Controle de Acesso com TensorFlow/COCO-SSD.
- Testar o RDP Insider montado em React no ambiente offline.
- Executar GLPI Automator contra um GLPI real.
- Validar integrações reais de Telegram, Gemini, Supabase e pagamento.
- Validar importação e PDF do Relatório sem carregar as bibliotecas externas.
- Produzir capturas finais dos seis projetos que não possuem screenshots completos no repositório.

## Próxima etapa recomendada

1. Empacotar as dependências externas e remover o Tailwind Play CDN.
2. Criar dados de demonstração locais e anonimizados.
3. Gerar as seis capturas finais em ambiente controlado.
4. Revisar cada copy com Marcelo, principalmente estados, resultados e integrações.
5. Validar teclado, contraste, tema e idioma dentro de cada ferramenta, não apenas na barra compartilhada.
6. Reexecutar câmera, importação de planilhas, geração de scripts, dashboards e exportação de PDF.
