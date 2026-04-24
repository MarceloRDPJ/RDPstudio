# Sistema de Controle de Acesso por Reconhecimento Facial

> **Status:** Reconstrucao documental interativa
> **Base:** Artigo cientifico publicado na RBMC (2024)
> **Tecnologia da pagina:** HTML, Tailwind CDN, JavaScript, TensorFlow.js, COCO-SSD

## Visao Geral

Este projeto documenta e apresenta uma reconstrucao visual do TCC publicado como:

`Sistema de controle de acesso atraves de reconhecimento facial com monitoramento remoto`

Como o codigo original do trabalho nao esta mais disponivel, esta entrega foi estruturada como uma pagina de portfolio tecnico que preserva:

- o contexto do problema
- a arquitetura proposta no artigo
- os componentes de hardware e software utilizados
- os resultados, desafios e trabalhos futuros
- uma previa interativa com visao computacional usando a camera do usuario

## O que esta pagina demonstra

1. Documentacao do projeto no padrao do repositorio.
2. Explicacao da arquitetura distribuida entre `ESP32-CAM`, `ESP32 WROOM` e software desktop em Python.
3. Resumo do fluxo de autenticacao e monitoramento remoto.
4. Demo em tempo real de reconhecimento de objetos com webcam usando o navegador.

## Nota Importante

Esta pagina **nao e o codigo original do TCC**.

Ela funciona como:

- reconstrucao documental
- apresentacao tecnica do case
- prova visual de capacidade em visao computacional no frontend

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
- pagina estatica para portfolio.
- demo de webcam com deteccao de objetos no navegador.
- sem envio de imagem para backend.

## Stack da Demo

- `HTML5`
- `Tailwind CSS`
- `JavaScript Vanilla`
- `TensorFlow.js`
- `COCO-SSD`
- `MediaDevices.getUserMedia`

## Referencia

Lemos RP, Azevedo CH, Passos Junior MR, Kunzler JA. *Sistema de controle de acesso atraves de reconhecimento facial com monitoramento remoto*. Revista Brasileira Militar de Ciencias. 2024;10(24):e175.

DOI: `https://doi.org/10.36414/rbmc.v10i24.175`

---
**Desenvolvido por Marcelo Rodrigues (RDP Studio)**
