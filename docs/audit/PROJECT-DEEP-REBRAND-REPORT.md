# Revisão aprofundada dos projetos

Data da revisão: 29 de julho de 2026.

## Escopo

Sete projetos foram tratados de acordo com sua natureza. A revisão não transformou
ferramentas em páginas estáticas e não expôs código ou dados restritos.

## Resultado por projeto

### Relatório Interativo

- Página de produto separada da ferramenta.
- Experiência direcionada a dados do TOTVS RM.
- Importação, análise, conferência e exportação preservadas.
- Arquivo de demonstração e documentação de validação disponíveis no projeto.

### Controle de Acesso Vision

- Apresentação separada da demonstração com câmera.
- Diferença entre o TCC original e a demonstração atual documentada.
- TensorFlow.js/COCO-SSD carregados somente quando a demonstração é iniciada.
- Permissão de câmera, falha de modelo e tentativa novamente possuem estados visíveis.

### Igreja Casa Hub

- Página reconstruída a partir das três capturas reais disponíveis.
- Navegação por administração, formulários e portal Wi-Fi.
- Links públicos para site e plataforma mantidos sem criar uma segunda prévia falsa.
- Limites de privacidade e escopo operacional declarados.

### RDP Insider

- Bundle visual antigo substituído por dashboard editorial de dados.
- Oferta atual, próximas ofertas e acervo são camadas distintas.
- Busca, filtros e carregamento progressivo funcionam sobre o JSON local.
- Entradas duplicadas são removidas na renderização.
- Logs, latência simulada, linguagem de espionagem e proxy público foram removidos.
- Imagens externas que falham não exibem uma captura recursiva do próprio site.

### Validador FortiGate

- Processador original preservado.
- Entrada válida, duplicidade, erro e geração dos dois scripts foram testados.
- Hierarquia visual reduzida a entrada, leitura, validação e saída.
- Interface ganhou maior largura útil, cantos menores e reflow mobile.

### GLPI Automator

- Terminal cenográfico e execução simulada removidos.
- Contrato de entrada por diretórios e evidências passou a ser o elemento central.
- Fluxo de validação, criação, anexo e registro documentado.
- Código permanece restrito; não foram expostas credenciais, entidades ou regras internas.

### Assistente de Vendas

- Laboratório interativo substituiu o telefone e a conversa automática.
- Quatro roteiros demonstram descoberta, estoque, carrinho e limite financeiro.
- Conversa e rastro de funções aparecem lado a lado.
- Catálogo e carrinho locais respondem sem chamar serviços externos.
- Variações simples de escrita são normalizadas durante a interpretação.
- Limites entre canal, modelo, controlador, dados e execução foram explicitados.
- A página não afirma aprovação automática de pagamentos ou escala não comprovada.

## Validação executada

- Viewports: 390 px e 1440 px.
- Todas as sete rotas responderam HTTP 200.
- Nenhuma exceção JavaScript encontrada.
- Nenhum overflow horizontal encontrado.
- Shell único e launcher do ROD nas seis páginas que usam o shell compartilhado.
- Logo clara/escura verificada: a versão preta é aplicada no tema claro.
- Troca para inglês verificada em conteúdo específico de projeto.
- Igreja Casa: alternância das três áreas validada.
- RDP Insider: filtro de hardware e deduplicação validados.
- Validador: duas entradas válidas e uma inválida produziram objetos, grupo e relatório.
- Assistente de Vendas: consulta com erro de escrita retornou o item do catálogo.

O resultado detalhado da automação está em `review/project-suite-results.json`.

## Limitações conhecidas

- O RDP Insider depende de URLs de imagem e fontes externas coletadas pelo crawler.
  Quando uma imagem deixa de existir, a interface mantém a informação textual sem
  substituir por uma imagem fictícia.
- O código e o ambiente real do GLPI Automator não são públicos; a validação se
  limita à apresentação e ao contrato documentado.
- O Assistente de Vendas é uma prova de conceito local. Telegram, Gemini e Supabase
  aparecem como arquitetura prevista e não são chamados pela página pública.
- A inferência real do Controle de Acesso depende do CDN do modelo e de permissão
  de câmera do navegador.
- O Igreja Casa não expõe ambiente administrativo nem dados reais de usuários.

## Pendências de conteúdo

- Capturas adicionais autorizadas do GLPI Automator.
- Capturas ou gravação de uma integração real do Assistente de Vendas.
- Imagens locais permanentes para notícias do RDP Insider, caso a política de uso
  e armazenamento das fontes permita.
- Resultados quantitativos só devem ser publicados quando houver período, método
  de medição e fonte.
