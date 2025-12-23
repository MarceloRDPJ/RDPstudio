# Validador de Firewall (MAC Address)

> **Status:** Ativo / Estável
> **Versão:** 2.5
> **Tecnologia:** HTML5, CSS3 (Tailwind), JavaScript (Vanilla)

## 📋 Visão Geral

O **Validador de Firewall** é uma ferramenta essencial para administradores de rede que trabalham com equipamentos Fortigate. Ele automatiza a tarefa tediosa e propensa a erros de formatar endereços MAC para listas de controle de acesso (ACLs) e reservas DHCP.

O sistema aceita entradas "sujas" (copiadas de Excel, e-mails ou logs), limpa os dados, valida a integridade dos endereços MAC e gera scripts prontos para serem colados no terminal CLI do Fortigate.

## 🚀 Funcionalidades Principais

*   **Sanitização de Dados:** Remove caracteres inválidos, espaços extras e formata automaticamente para o padrão `XX:XX:XX:XX:XX:XX`.
*   **Validação Inteligente:**
    *   Verifica comprimento e caracteres hexadecimais válidos.
    *   Detecta duplicidade de Nomes (Objetos).
    *   Detecta duplicidade de Endereços MAC.
*   **Geração de Script (CLI):** Cria comandos `config firewall address` e `config firewall addrgrp` automaticamente.
*   **Feedback Visual:** Interface moderna com relatórios de erro detalhados e contadores em tempo real.

## 🛠️ Como Usar

1.  **Prepare seus dados:** O sistema aceita o formato `NOME;MAC` (separado por ponto e vírgula, vírgula ou tabulação).
    *   *Exemplo:* `Notebook-CEO; A1-B2-C3-D4-E5-F6`
2.  **Cole no Input:** Insira a lista completa na área de texto ou arraste um arquivo `.txt` / `.csv`.
3.  **Processar:** Clique em "Validar & Converter".
4.  **Resultados:**
    *   **Script de Objetos:** Comandos para criar os endereços individuais.
    *   **Script de Grupo:** Comandos para adicionar esses objetos a um grupo.
    *   **Relatório de Erros:** Lista de linhas que falharam na validação (útil para correção).

## 📂 Estrutura do Projeto

A estrutura de arquivos foi organizada para manter o código limpo e sustentável:

```
validador-firewall/
├── assets/           # Imagens e ícones (Logos, Exemplos)
├── css/              # Estilização (style.css - Customizações Tailwind)
├── js/               # Lógica de processamento (script.js - Engine de Regex)
├── index.html        # Interface do Usuário
└── README.md         # Documentação Técnica
```

## 🔍 Detalhes Técnicos

### Engine de Regex
A validação utiliza a seguinte expressão regular para garantir a integridade dos endereços MAC:
```javascript
/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/
```
Isso garante que apenas 6 pares de caracteres hexadecimais separados por dois pontos sejam aceitos.

### Performance
O processamento é feito inteiramente no lado do cliente (Client-Side) via JavaScript, garantindo privacidade total dos dados (nenhum dado é enviado para servidores externos) e velocidade instantânea mesmo para listas com milhares de entradas.

---
**Desenvolvido por Marcelo Rodrigues (RDP Studio)**
