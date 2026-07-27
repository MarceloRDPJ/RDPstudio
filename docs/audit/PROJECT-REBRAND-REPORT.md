# Relatório de revisão dos projetos

## Direção adotada

O sistema compartilhado usa a paleta verde da RDP Studio, tipografia Manrope, superfícies sólidas, bordas discretas e raios entre 4 e 9 px. Cada projeto mantém uma composição adequada à sua natureza, em vez de receber o mesmo modelo de página.

Foram estudados Open Props, Pico CSS, Spectrum Web Components e Shoelace. Nenhum kit visual completo foi incorporado. O repositório já contém ferramentas com diferentes arquiteturas; adicionar uma biblioteca geral aumentaria dependências e poderia interferir em câmera, upload, gráficos, planilhas e aplicações React. As referências foram usadas para consolidar tokens, temas, estados de foco e componentes sem alterar as regras de negócio.

## Resultado por projeto

### Controle de Acesso Vision

- Estado: estudo de caso e demonstração preservados.
- Melhorias: título factual, distinção mais clara entre protótipo original e demonstração atual, tipografia, cores, superfícies, botões e navegação.
- Preservado: câmera, TensorFlow.js, COCO-SSD, controles de confiança, arquitetura, log, materiais e referência acadêmica.
- Falta: fotografias originais do protótipo físico e código-fonte original.

### Igreja Casa Hub

- Estado: apresentação da plataforma preservada.
- Melhorias: copy orientada à rotina da comunidade, paleta mais sóbria, módulos, links e screenshots mantidos.
- Preservado: painel, formulário, portal Wi-Fi, CRM, indicadores, escalas, DOMUM e arquitetura.
- Falta: captura autenticada atual do painel com dados demonstrativos autorizados.

### RDP Insider

- Estado: aplicação React e banco JSON funcionando.
- Melhorias: linguagem menos cenográfica, estado de falha compreensível, título do feed mais direto, bordas e superfícies alinhadas ao sistema.
- Preservado: filtros, feed, imagens, Epic Dashboard, dados e atualização.
- Falta: dados de algumas fontes podem conter registros repetidos; o catálogo deve ser revisado na origem.

### Validador Fortigate

- Estado: ferramenta funcional.
- Melhorias: objetivo explicado pela entrada e pela saída, área de trabalho mais legível, redução de efeitos e arredondamentos.
- Preservado: CSV/TXT, texto colado, parsing, validação, duplicidades, scripts, erros, visualização e downloads.
- Teste: duas entradas válidas geraram dois objetos.
- Falta: conjunto público maior de amostras anonimizadas para testar casos extremos.

### GLPI Automator

- Estado: apresentação funcional com código restrito.
- Melhorias: copy baseada no fluxo real, hierarquia de diretórios valorizada e redução da aparência de terminal.
- Preservado: árvore, evidências, tickets, anexos, auditoria e solicitação de acesso.
- Falta: captura real de uma execução anonimizada e código público para reprodução completa.

### Assistente de Vendas

- Estado: demonstração e arquitetura preservadas.
- Melhorias: capacidades descritas como demonstração, simulador tratado como principal evidência e seção de impacto substituída por critérios de avaliação.
- Preservado: Telegram, serviço Python, consulta a dados, regras comerciais e conversa simulada.
- Falta: ambiente público conectado e evidência autorizada de uma operação completa.

### Relatório Interativo

- Estado: importação e aplicação preservadas.
- Melhorias: título e instruções orientados à tarefa, indicação de processamento local e estilo de aplicação mais calmo.
- Preservado: XLSX/XLS/CSV, múltiplos arquivos, entrada manual, indicadores, gráficos, auditoria, relatório, PDF e modo TecnoIT.
- Falta: planilha demonstrativa anonimizada para gerar screenshots preenchidos e validar todos os estados sem usar dados particulares.

## Componentes compartilhados

- Tema Sistema, Claro, Escuro e Alto Contraste.
- Português e inglês persistentes.
- Logo adaptada automaticamente no tema claro.
- Shell comum com navegação e controles compactos.
- Novo ROD em forma de esfera neural e mapa contextual.
- Foco visível e suporte a movimento reduzido.
- Imagens dos projetos atualizadas a partir das páginas em execução.

## Validações executadas

- Sete páginas em desktop.
- Quatro páginas críticas em celular.
- Resolução desktop: 1440 × 900.
- Resolução móvel: 390 × 844.
- Sem overflow horizontal nos casos testados.
- Sem erros de execução durante os testes.
- Tema escuro e idioma inglês aplicados em todas as páginas avaliadas.
- Validador Fortigate testado com dados reais de demonstração.
- RDP Insider testado com filtro de hardware.
- ROD aberto e validado na Home e em Projetos.

## Pontos ainda necessários antes da publicação

1. Revisão visual final em 320, 768, 980 e 1280 px.
2. Teste de zoom em 200%.
3. Teste manual da câmera com permissão real.
4. Teste de importação e PDF com uma planilha demonstrativa autorizada.
5. Teste dos downloads do Validador em navegador real.
6. Revisão completa das traduções específicas de cada projeto.
7. Captura autenticada e anonimizada do Igreja Casa.
8. Captura anonimizada de execução do GLPI Automator.
9. Aprovação visual das novas páginas e do ROD.

## Limitações da infraestrutura de teste

- O verificador legado `verify_mobile_standardization.py` citado no fluxo anterior não existe mais com esse nome no repositório.
- O verificador visual legado em Python requer Playwright no ambiente Python atual.
- A validação equivalente foi executada pela suíte em navegador `tools/validate-project-rebrand.cjs`, usando as páginas reais e as dependências externas originais.
