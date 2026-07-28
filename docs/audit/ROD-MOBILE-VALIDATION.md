# ROD e experiência mobile — relatório de validação

## Entrega

- O ROD deixou de abrir como janela de chat.
- A nova página `hub/rod.html` apresenta um núcleo visual próprio, perguntas sugeridas e respostas contextuais.
- O processamento permanece local: a base publicada em `rod-knowledge.json` é consultada no navegador e a conversa não é enviada a um serviço externo.
- Nas demais páginas, o ROD aparece como um lançador compacto com a logo da RDP Studio.
- Ao partir de um projeto, o link preserva o contexto desse projeto.
- Tema, idioma e logo acompanham automaticamente a preferência atual.

## Experiência mobile

- Cabeçalho institucional reduzido para 64 px.
- Cabeçalho das páginas de projetos reduzido para 65 px.
- Menus de navegação e tema permanecem dentro da largura da tela em 320 e 390 px.
- Controles interativos possuem área mínima de 40 px; os controles principais usam 44 a 48 px.
- Títulos, espaçamentos, imagens e botões foram recalibrados para telas estreitas.
- Não há posicionamento absoluto estrutural no conteúdo mobile.
- `prefers-reduced-motion` interrompe os movimentos não essenciais.

## Cenários executados

- Home, Projetos, Sobre e ROD em 320 × 640, 390 × 844 e 1440 × 900.
- Português e inglês.
- Tema claro, escuro, sistema e alto contraste.
- Menu principal e seletor de tema em 320 e 390 px.
- Pergunta livre, resposta, sugestões e ações do ROD.
- As sete páginas de projetos em 390 × 844.

## Resultado

- Zero overflow horizontal nas páginas testadas.
- Zero sobreposição encontrada.
- Zero controles institucionais abaixo da área mínima definida.
- Zero ocorrência do painel de chat antigo.
- Zero erro JavaScript na Home, Projetos, Sobre e ROD.
- ROD responde em português e inglês e expõe estado acessível durante o processamento.
- Todas as sete páginas carregam o shell compartilhado e o acesso contextual ao ROD.

## Dependências dos projetos

As ferramentas existentes continuam preservadas. Algumas páginas ainda carregam bibliotecas externas diretamente de CDNs:

- Tailwind Play CDN;
- React, ReactDOM e Babel;
- TensorFlow.js e COCO-SSD;
- Chart.js, SheetJS, PapaParse, jsPDF e html2canvas;
- Mermaid;
- Font Awesome e fontes do Google.

O navegador isolado usado na validação bloqueia essas conexões por política. Por isso, os testes locais confirmaram layout, navegação e integração do ROD, mas não substituem um teste conectado das bibliotecas externas. Essa dependência já existia e não foi introduzida pelo novo ROD.

## Pendências de conteúdo e evidência

- Controle de Acesso Vision: faltam fotografias originais do protótipo físico e o código original do TCC.
- Igreja Casa Hub: falta uma captura autenticada recente com dados demonstrativos autorizados.
- RDP Insider: algumas fontes podem produzir registros repetidos; a origem dos dados deve ser revisada periodicamente.
- Validador Fortigate: falta um conjunto público maior de entradas anonimizadas para casos extremos.
- GLPI Automator: faltam captura anonimizada de execução e código público para reprodução.
- Assistente de Vendas: falta um ambiente público conectado e uma operação completa autorizada.
- Relatório Interativo: falta uma planilha demonstrativa anonimizada para validar e ilustrar todos os estados.

## Próxima melhoria técnica recomendada

Versionar localmente as bibliotecas críticas e substituir o Tailwind Play CDN por CSS compilado. Isso reduz risco de indisponibilidade externa e permite executar a suíte funcional completa sem depender da rede.
