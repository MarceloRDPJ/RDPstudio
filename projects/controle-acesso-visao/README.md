# Controle de Acesso Vision

> **Status:** Case reconstruido e refinado para portfolio
> **Base:** Artigo cientifico publicado na RBMC (2024)
> **Tecnologia da pagina:** HTML, Tailwind CDN, JavaScript, TensorFlow.js, COCO-SSD

**Artigo:** `https://rbmc.org.br/rbmc/article/view/175`

## Visao Geral

Este projeto transforma em case navegavel o TCC publicado como:

`Sistema de controle de acesso atraves de reconhecimento facial com monitoramento remoto`

Como o codigo original do trabalho nao esta mais disponivel, a entrega foi pensada como uma pagina de portfolio que preserva o nucleo tecnico do projeto e melhora a forma de apresentar a historia:

- o contexto do problema
- a arquitetura proposta no artigo
- os componentes de hardware e software utilizados
- os resultados, desafios e trabalhos futuros
- uma experiencia interativa com camera, leitura de objetos e sinais contextuais da cena

## O que esta pagina demonstra

1. Uma narrativa mais clara sobre o problema, a arquitetura e o valor do trabalho.
2. Explicacao da divisao entre `ESP32-CAM`, `ESP32 WROOM` e a aplicacao desktop em Python.
3. Uma experiencia de pagina mais viva, menos burocratica e mais proxima de produto.
4. Demo local em tempo real com webcam, deteccao de objetos e leitura contextual da cena.

## Nota Importante

Esta pagina **nao e o codigo original do TCC**.

Ela funciona como:

- reconstrucao documental
- apresentacao tecnica do case
- prova visual de capacidade em visao computacional no frontend
- ponte entre artigo academico e apresentacao profissional

O artigo cientifico continua sendo a fonte primaria das informacoes tecnicas e historicas do projeto.

## Arquitetura Resumida

### Camada embarcada
- `ESP32-CAM` para captura de imagem, servidor HTTP e processamento local.
- `ESP32 WROOM` para acionar rele, fecho eletromagnetico, sensor magnetico e buzzer.
- armazenamento local de identificadores faciais na flash do dispositivo.

### Camada desktop
- aplicacao Python com `face_recognition`, `OpenCV`, `tkinter` e `MySQL`.
- cadastro de usuarios com nome, e-mail e codificacao facial.
- verificacao de usuarios por webcam em ambiente de proposito geral.

### Camada de demonstracao web
- pagina editorial para portfolio.
- demo de webcam com deteccao de objetos no navegador.
- sinais contextuais de atencao baseados em heuristicas conservadoras.
- sem envio de imagem para backend.

## Stack da Demo

- `HTML5`
- `Tailwind CSS`
- `JavaScript Vanilla`
- `TensorFlow.js`
- `COCO-SSD`
- `MediaDevices.getUserMedia`
- `WebGL backend`

## Nota sobre custos

Os valores de materiais apresentados nesta reconstrucao seguem a Tabela 1 do artigo.

O texto da publicacao informa que os precos sao estimativas de mercado e podem variar conforme fornecedor e localizacao geografica, mas **nao informa explicitamente a data exata da cotacao**. Nesta documentacao, os valores foram mantidos como referencia da publicacao disponibilizada em `18/08/2024`.

## Nota sobre a demo

A demo atual nao tenta reproduzir literalmente o reconhecimento facial do TCC original.

Ela foi desenhada para cumprir um papel melhor dentro do portfolio:

- tornar o case vivo
- mostrar dominio de frontend e visao computacional web
- ser honesta sobre o que vem do artigo e o que foi acrescentado nesta reconstrucao

## Referencia

Lemos RP, Azevedo CH, Passos Junior MR, Kunzler JA. *Sistema de controle de acesso atraves de reconhecimento facial com monitoramento remoto*. Revista Brasileira Militar de Ciencias. 2024;10(24):e175.

DOI: `https://doi.org/10.36414/rbmc.v10i24.175`

Pagina do artigo: `https://rbmc.org.br/rbmc/article/view/175`

---
**Desenvolvido por Marcelo Rodrigues (RDP Studio)**
