# Automação de Chamados GLPI

> **Status:** Case de Sucesso (Enterprise)
> **Versão:** 4.0
> **Tecnologia:** Python 3.10+, GLPI REST API

## 📋 Visão Geral

Este projeto é uma solução de automação robótica (RPA) desenvolvida para otimizar o fluxo de **Manutenção Preventiva** em grandes infraestruturas de TI.

Anteriormente, técnicos precisavam abrir manualmente centenas de chamados no sistema GLPI, anexando fotos de evidência uma a uma. Este script automatiza 100% desse processo, lendo uma estrutura de pastas padronizada e interagindo diretamente com a API do GLPI.

## 🚀 Impacto no Negócio

*   **Redução de Tempo:** De 4 horas/homem para ~15 minutos de execução autônoma.
*   **Padronização:** Garante que todos os chamados tenham o mesmo padrão de título, descrição e categoria.
*   **Conformidade:** Assegura que todas as evidências fotográficas sejam anexadas corretamente, evitando auditorias falhas.

## ⚙️ Como Funciona (Fluxo Técnico)

1.  **Scanner de Diretórios:**
    *   O script percorre recursivamente uma pasta raiz (ex: `Preventivas_2025`).
    *   Identifica subpastas que correspondem a nomes de equipamentos (ex: `PC-FINANCEIRO-01`).
    *   Coleta arquivos de imagem (`.jpg`, `.png`) dentro dessas pastas.

2.  **Interação com API GLPI:**
    *   **Autenticação:** Realiza login via `App-Token` e `User-Token` para obter um `Session-Token`.
    *   **Criação de Ticket:** Envia um POST para `/Ticket` criando o chamado vinculado ao equipamento.
    *   **Upload de Evidências:** Para cada foto encontrada, realiza um POST `multipart/form-data` para `/Document`, vinculando o documento ao Ticket recém-criado.

3.  **Logging e Auditoria:**
    *   Gera um arquivo de log detalhado (`execution.log`) informando quais chamados foram abertos e quais falharam (ex: equipamento não encontrado no inventário).

## 📂 Estrutura de Pastas Esperada

Para que a automação funcione, os técnicos apenas precisam organizar as fotos assim:

```text
/Preventivas_Outubro/
    ├── SRV-AD-01/
    │   ├── foto_frontal.jpg
    │   └── foto_traseira.jpg
    ├── PC-RH-05/
    │   └── limpeza_interna.jpg
    └── PRINTER-HALL/
        ├── contador.png
        └── limpeza.jpg
```

O script entende que `SRV-AD-01` é o nome do ativo e cria um ticket para ele contendo as duas fotos.

## 🛠️ Tecnologias Utilizadas

*   **Python 3:** Linguagem base.
*   **Requests:** Biblioteca para comunicação HTTP com a API REST.
*   **OS/Shutil:** Manipulação de sistema de arquivos.

---
**Nota:** Este repositório contém a página de apresentação do projeto (Landing Page). O código-fonte do script é proprietário e restrito ao ambiente do cliente, acessível apenas via solicitação autorizada.

**Desenvolvido por Marcelo Rodrigues (RDP Studio)**
