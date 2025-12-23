# RDP Insider (Scanner Game Free)

> **Status:** Em Produção
> **Atualização:** Diária (Automática)
> **Stack:** React, Python, GitHub Actions

## 📋 Visão Geral

O **RDP Insider** (anteriormente Scanner Game Free) é um portal de inteligência gamer focado em monitorar o ecossistema da Epic Games Store. O objetivo principal é identificar, validar e notificar sobre jogos gratuitos, vazamentos e notícias de hardware em primeira mão.

O projeto opera sob uma filosofia "No-Build", utilizando React nativo via CDN para simplicidade e performance, apoiado por um backend de dados estáticos gerado diariamente por crawlers em Python.

## 🚀 Arquitetura do Sistema

### 1. Data Engine (Crawler Python)
Um script Python sofisticado (`data_engine/crawler.py`) é executado todos os dias às 12:00 UTC via GitHub Actions.
*   **Fontes:** API da Epic Games, Feeds RSS (Eurogamer, TechPowerUp).
*   **Tradução:** Utiliza `deep-translator` para localizar conteúdo para PT-BR automaticamente.
*   **Sanitização:** Remove duplicatas, valida datas de expiração e classifica a confiabilidade das notícias (High/Low Reliability).
*   **Saída:** Gera um arquivo `data/db.json` que alimenta o frontend.

### 2. Frontend (React Modular)
A interface é construída com React mas sem a complexidade de `npm/webpack`.
*   **Componentização:** Os componentes (`EpicDashboard`, `NavBar`) são arquivos `.js` separados carregados no runtime.
*   **Estado:** Gerenciamento de estado local para filtros (Free Games, Hardware, Leaks).
*   **Design:** Utiliza Tailwind CSS e Glassmorphism para alinhar com a identidade visual RDP Studio.

### 3. Automação (CI/CD)
O arquivo `.github/workflows/scanner_daily.yml` orquestra a execução do crawler e o commit automático das atualizações no banco de dados JSON, garantindo que o site esteja sempre atualizado sem intervenção humana.

## 📂 Estrutura do Projeto

```
scanner-game-free/
├── data/
│   └── db.json            # Banco de dados (Gerado automaticamente)
├── data_engine/
│   └── crawler.py         # O "cérebro" da coleta de dados
├── js/
│   └── components/        # Componentes React (Header, Cards, Modal)
├── ARCHITECTURE.md        # Documentação legada/detalhada
├── index.html             # Ponto de entrada da aplicação
└── requirements.txt       # Dependências do Python
```

## 🛠️ Como Executar Localmente

1.  **Backend (Crawler):**
    ```bash
    pip install -r requirements.txt
    python data_engine/crawler.py
    ```
2.  **Frontend:**
    Como o projeto usa módulos ES6 e fetch local, você precisa de um servidor HTTP simples:
    ```bash
    python -m http.server 8000
    # Acesse: http://localhost:8000/projects/scanner-game-free/
    ```

---
**Desenvolvido por Marcelo Rodrigues (RDP Studio)**
