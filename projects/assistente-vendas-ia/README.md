# Assistente de Vendas IA

![Status](https://img.shields.io/badge/status-production-success.svg?style=flat-square)
![AI](https://img.shields.io/badge/AI-Gemini_Pro-purple.svg?style=flat-square)
![Platform](https://img.shields.io/badge/Telegram-Bot-blue.svg?style=flat-square)

> **Agente de IA Autônomo para Vendas e Gestão.**
> Atendimento 24/7, gestão de estoque e validação de pagamentos via visão computacional.

---

## 📋 Visão Geral

Desenvolvido para a **Lume Beauty**, este bot revoluciona o atendimento ao cliente no Telegram. Diferente de chatbots baseados em regras simples, ele utiliza **LLMs (Gemini 1.5 Pro)** para entender contexto, negociar e fechar vendas de forma natural.

### Principais Funcionalidades
- 💬 **NLP Avançado:** Conversação natural e contextual.
- 📦 **Gestão de Estoque:** Consulta e baixa de produtos em tempo real (Supabase).
- 👁️ **Visão Computacional:** Lê comprovantes de PIX enviados por foto para validar pagamentos.
- 🚀 **Alta Disponibilidade:** Arquitetura Serverless.

---

## 🏗️ Arquitetura

```mermaid
sequenceDiagram
    participant User as Usuário
    participant TG as Telegram
    participant Py as Backend Python
    participant AI as Gemini Pro
    participant DB as Supabase

    User->>TG: Envia Mensagem
    TG->>Py: Webhook Update
    Py->>DB: Busca Contexto/Estoque
    Py->>AI: Envia Prompt + Contexto
    AI-->>Py: Resposta Gerada
    Py->>TG: Envia Resposta
    TG-->>User: Exibe Mensagem
```

## 🛠️ Stack Tecnológica

- **Core:** Python 3.11, Aiogram
- **AI Model:** Google Gemini 1.5 Pro
- **Database:** Supabase (PostgreSQL + Vector)
- **Deploy:** Render / Docker

---

**© 2025 RDP STUDIO.** Desenvolvido por Marcelo Rodrigues.
