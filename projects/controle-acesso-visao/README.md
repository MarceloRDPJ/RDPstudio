# Controle de Acesso Vision

> **Status:** Case reconstruído e refinado para portfólio
> **Base:** Artigo científico publicado na RBMC (2024)
> **Tecnologia da página:** HTML, Tailwind CDN, JavaScript, TensorFlow.js, COCO-SSD

**Artigo:** `https://rbmc.org.br/rbmc/article/view/175`

## Visão Geral

Este projeto transforma em case navegável o TCC publicado como:

`Sistema de controle de acesso através de reconhecimento facial com monitoramento remoto`

Como o código original do trabalho não está mais disponível, a entrega foi pensada como uma página de portfólio que preserva o núcleo técnico do projeto e melhora a forma de apresentar a história:

- o contexto do problema
- a arquitetura proposta no artigo
- os componentes de hardware e software utilizados
- os resultados, desafios e trabalhos futuros
- uma experiência interativa com câmera, leitura de objetos e sinais contextuais da cena

## O que esta página demonstra

1. Uma narrativa mais clara sobre o problema, a arquitetura e o valor do trabalho.
2. Explicação da divisão entre `ESP32-CAM`, `ESP32 WROOM` e a aplicação desktop em Python.
3. Uma experiência de página mais viva, menos burocrática e mais próxima de produto.
4. Demo local em tempo real com webcam, detecção de objetos e leitura contextual da cena.

## Nota Importante

Esta página **não é o código original do TCC**.

Ela funciona como:

- reconstrução documental
- apresentação técnica do case
- prova visual de capacidade em visão computacional no frontend
- ponte entre artigo acadêmico e apresentação profissional

O artigo científico continua sendo a fonte primária das informações técnicas e históricas do projeto.

## Arquitetura Resumida

### Camada embarcada
- `ESP32-CAM` para captura de imagem, servidor HTTP e processamento local.
- `ESP32 WROOM` para acionar relé, fecho eletromagnético, sensor magnético e buzzer.
- armazenamento local de identificadores faciais na flash do dispositivo.

### Camada desktop
- aplicação Python com `face_recognition`, `OpenCV`, `tkinter` e `MySQL`.
- cadastro de usuários com nome, e-mail e codificação facial.
- verificação de usuários por webcam em ambiente de propósito geral.

### Camada de demonstração web
- página editorial para portfólio.
- demo de webcam com detecção de objetos no navegador.
- sinais contextuais de atenção baseados em heurísticas conservadoras.
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

Os valores de materiais apresentados nesta reconstrução seguem a Tabela 1 do artigo.

O texto da publicação informa que os preços são estimativas de mercado e podem variar conforme fornecedor e localização geográfica, mas **não informa explicitamente a data exata da cotação**. Nesta documentação, os valores foram mantidos como referência da publicação disponibilizada em `18/08/2024`.

## Nota sobre a demo

A demo atual não tenta reproduzir literalmente o reconhecimento facial do TCC original.

Ela foi desenhada para cumprir um papel melhor dentro do portfólio:

- tornar o case vivo
- mostrar domínio de frontend e visão computacional web
- ser honesta sobre o que vem do artigo e o que foi acrescentado nesta reconstrução

## Referência

Lemos RP, Azevedo CH, Passos Junior MR, Kunzler JA. *Sistema de controle de acesso através de reconhecimento facial com monitoramento remoto*. Revista Brasileira Militar de Ciências. 2024;10(24):e175.

DOI: `https://doi.org/10.36414/rbmc.v10i24.175`

Página do artigo: `https://rbmc.org.br/rbmc/article/view/175`

---
**Desenvolvido por Marcelo Rodrigues (RDP Studio)**
