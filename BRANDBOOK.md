# RDP STUDIO Brand Book & Design System (Neuro-Strategy Edition)

## 1. Identidade & Core Principles

**RDP Studio** é uma consultoria de engenharia de software de alta performance, focada em transformar complexidade em soluções digitais elegantes.

### Princípios Neuro-Estratégicos
- **Redução da Carga Cognitiva**: Espaço em branco generoso, blocos visuais claros, diagramas ao invés de textos longos.
- **Direcionamento da Atenção**: Uso de padrões F (conteúdo) e Z (landing pages) para guiar o olhar do usuário.
- **Viés de Autoridade**: Design ultra-moderno, tipografia técnica e badging de certificações.

## 2. Logotipo e Uso da Marca

O logotipo da RDP Studio representa a fusão entre tecnologia e precisão.

- **Localização Oficial**: `assets/images/branding/logo.png`
- **Ícones do Sistema (Favicons)**:
  - `favicon-32x32.png`, `favicon-16x16.png` (Navegadores Desktop)
  - `apple-touch-icon.png` (iOS/MacOS)
  - `android-chrome-*.png` (Android/PWA - via `site.webmanifest`)
- **Uso Correto**:
  - Sempre manter a proporção original.
  - Usar sobre fundos escuros (`#020617` ou `#1E3A5F`) para garantir contraste.
  - Não aplicar sombras ou efeitos 3D que comprometam a legibilidade.

## 3. Paleta de Cores (Neurostrategic)

### Cores Primárias (Confiança & Estabilidade)
- **Deep Blue**: `#1E3A5F` (Headers, Títulos)
- **Tech Gray**: `#2D3748` (Textos secundários, Bordas)
- **Dark Slate**: `#020617` (Fundo Principal)

### Cores de Destaque (Ação & Inovação)
- **Vibrant Cyan**: `#00B4D8` (Botões, Links, Tags de Tecnologia)
- **Energetic Amber**: `#F59E0B` (Alertas, Destaques importantes - *Von Restorff effect*)

### Cores de Status
- **Trust Green**: `#10B981` (Sucesso, Métricas positivas, Uptime)
- **Error Red**: `#EF4444` (Erros, Falhas críticas)

### Gradientes
- **Texto Gradiente**: `linear-gradient(to right, #00B4D8, #38bdf8, #10B981)`
- **Fundo Imersivo**: Radial gradients sutis usando Deep Blue e Cyan com baixa opacidade.

## 4. Tipografia

- **Principal (UI)**: `Inter`, sans-serif. Otimizada para leitura em telas.
  - Pesos: 300 (Light), 400 (Regular), 600 (SemiBold), 700 (Bold).
- **Técnica (Código/Dados)**: `JetBrains Mono`, monospace. Transmite credibilidade técnica.
  - Pesos: 400 (Regular), 700 (Bold).

## 5. Componentes UI (Padrão)

### Glass Card
```css
.glass-card {
    background: rgba(30, 41, 59, 0.4);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Botões
- **CTA Principal**: Fundo Cyan Vibrante (`#00B4D8`), Texto Branco, Bold. Hover com leve brilho.
- **CTA Secundário**: Borda Cyan, Fundo Transparente.

## 6. Direitos Autorais e Licenciamento

Todo o código e design contidos neste repositório são de propriedade da RDP Studio.

- **Copyright**: "© 2025 RDP STUDIO. Desenvolvido por Marcelo Rodrigues."
- **Licença de Código**: MIT License (Permissive Open Source).

---
**RDP STUDIO** • *Engenharia de Alta Performance*
