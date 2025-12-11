# RDP STUDIO Brand Book & Design System (Neuro-Strategy Edition)

## 1. Core Principles (Neuro-Strategy)
- **Reduction of Cognitive Load**: Generous whitespace, clear visual blocks, diagrams over long text.
- **Attention Direction (Eye Tracking)**:
  - F-Pattern for content pages.
  - Z-Pattern for action pages (Home).
  - Key information (taglines, metrics, CTAs) positioned at fixation points.
- **Decision Making & Biases**:
  - **Von Restorff Effect**: Highlight key items with Energetic Amber.
  - **Neuroquantified Social Proof**: Specific metrics (e.g., "+40% availability").
  - **Authority Bias**: Professional imagery and certification badges.
- **Ultra Modern Aesthetic**: Glassmorphism, gradients, and subtle animations (Micro-interactions).

## 2. Color Palette (Neurostrategic)

### Primary Colors (Confidence & Stability)
- **Deep Blue**: `#1E3A5F` (Headers, Titles)
- **Tech Gray**: `#2D3748` (Text, Borders)
- **Dark Slate**: `#020617` (Background Base for Dark Mode)

### Highlight Colors (Action & Innovation)
- **Vibrant Cyan**: `#00B4D8` (Main CTAs, Technology tags)
- **Energetic Amber**: `#F59E0B` (Alerts, Von Restorff highlights)

### Success Colors (Metrics & Confirmation)
- **Trust Green**: `#10B981` (Positive KPIs, Status)

### Backgrounds & Gradients
- **Main Background**: `#020617` (Slate 950)
- **Immersive Gradients**:
  - Radial gradients using Deep Blue and Slate variants to create depth without noise.

### Text Gradients
- `linear-gradient(to right, #00B4D8, #38bdf8, #10B981)` (Cyan -> Sky -> Green) for innovation/tech feel.

## 3. Typography
- **Primary Font**: `Inter`, sans-serif (UI, Text) - Optimized for screen reading.
- **Monospace**: `JetBrains Mono` (Code, IDs, Data) - For technical credibility.
- **Headings**: ExtraBold Inter for strong hierarchy.

## 4. UI Components (CSS)

### Global Background
```css
body {
    font-family: 'Inter', sans-serif;
    background-color: #020617; /* Dark Slate */
    background-image:
        radial-gradient(circle at 15% 50%, rgba(30, 58, 95, 0.15), transparent 25%),
        radial-gradient(circle at 85% 30%, rgba(0, 180, 216, 0.1), transparent 25%);
    background-attachment: fixed;
    color: #F8FAFC; /* Soft White */
    overflow-x: hidden;
}
```

### Glass Card (Refined)
```css
.glass-card {
    background: rgba(30, 41, 59, 0.4); /* Slate 800 with opacity */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-card:hover {
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(0, 180, 216, 0.3); /* Cyan tint */
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}
```

### Buttons
- **Primary CTA**: `bg-[#00B4D8] hover:bg-[#0096B4] text-white font-bold`
- **Secondary**: `border border-[#00B4D8] text-[#00B4D8] hover:bg-[#00B4D8]/10`

### "Back to Hub" Button (Standard)
```html
<header class="flex justify-between items-center mb-16 fade-in-up">
    <a href="../../index.html" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
        <div class="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#00B4D8]/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
        </div>
        <span class="text-sm font-semibold tracking-wide uppercase">Voltar ao Hub</span>
    </a>
</header>
```
