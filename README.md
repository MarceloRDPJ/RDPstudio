# TecnoIT - Hub de Projetos

## Visão Geral

Este repositório funciona como um portfólio e hub central para diversas ferramentas e scripts de automação desenvolvidos para otimizar os processos internos e as tarefas diárias da equipe TecnoIT. Cada projeto aqui listado foi criado para resolver uma necessidade específica, visando maior eficiência e agilidade.

## Projetos Atuais

Aqui estão as ferramentas disponíveis atualmente no hub:

1.  **Validador de MACs (`validador-firewall`)**
    *   **Descrição:** Uma ferramenta que converte listas de endereços MAC de formato CSV para scripts prontos para serem aplicados em firewalls. Ideal para configurações em massa.

2.  **Abertura de Chamados em Massa GLPI (`abertura-chamados-glpi`)**
    *   **Descrição:** Um script de automação que permite a abertura de múltiplos chamados no sistema GLPI de forma automatizada, economizando tempo em tarefas repetitivas.

## Como Acessar a Versão Online

Você pode acessar e utilizar todas as ferramentas através do seguinte link, hospedado no GitHub Pages:

**[https://marcelordpj.github.io/Tecnoit/](https://marcelordpj.github.io/Tecnoit/)**

## Instruções para Desenvolvedores

Se você deseja executar o hub de projetos localmente para testes ou para desenvolver novas ferramentas, siga os passos abaixo.

### Pré-requisitos

*   Python 3.x instalado em sua máquina.

### Executando Localmente

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/MarceloRDPJ/Tecnoit.git
    cd Tecnoit
    ```

2.  **Inicie um Servidor Web Local:**
    Como este é um projeto baseado em arquivos estáticos (HTML, CSS, JS), você pode usar o módulo `http.server` do Python para criar um servidor web simples na pasta raiz do projeto.
    ```bash
    python3 -m http.server 8000
    ```

3.  **Acesse no Navegador:**
    Abra seu navegador e acesse o seguinte endereço:
    ```
    http://localhost:8000
    ```

Agora você pode testar as funcionalidades existentes ou adicionar novos projetos à pasta `projects/`.
