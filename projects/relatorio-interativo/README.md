# RDP Visão RM

Camada independente de leitura e conferência para o fluxo de caixa exportado do TOTVS Gestão Financeira.

## Estrutura

- `index.html`: página explicativa do produto;
- `app.html`: analisador funcional;
- `rm-analyzer.js`: importação, reconhecimento, cálculos e apresentação;
- `rm-product.css`: sistema visual responsivo;
- `demo/fluxo-rm-demonstracao.csv`: base fictícia para teste;
- `tecnoit.html`: redirecionamento de compatibilidade para a aplicação atual.

## Fluxo de uso

1. Exportar o Fluxo de Caixa no RM.
2. Importar XLS, XLSX ou CSV.
3. Conferir colunas, meses e pendências reconhecidas.
4. Analisar entradas, saídas, saldo, naturezas e movimentos.
5. Imprimir ou salvar o resumo.

O arquivo é processado no navegador e não é enviado para um servidor da RDP Studio. A leitura de XLS/XLSX carrega o SheetJS sob demanda; CSV funciona sem essa dependência.

## Limites atuais

- O importador reconhece natureza, centro de custo, tipo e meses por nomes de cabeçalho.
- Linhas de totalização são ignoradas para evitar dupla contagem.
- Tipos não reconhecidos ficam fora dos totais e aparecem na conferência.
- Variações de layout do RM podem precisar de um perfil específico.
- A compatibilidade final ainda deve ser validada com exportações reais anonimizadas.
- A ferramenta não grava dados no RM, não recalcula regras contábeis e não substitui a conferência com o relatório de origem.

TOTVS e RM são marcas de seus respectivos proprietários. Este projeto é independente.
