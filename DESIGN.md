# Design System: Super Mario Galaxy (Real Tokens)

## 1. Visual Theme & Atmosphere
Um sistema cinematográfico com atmosfera cósmica, contraste alto e brilho controlado.  
A interface prioriza legibilidade em fundo profundo, com acentos estelares para orientar foco narrativo e ação.

- **Density:** 5/10 (equilibrado, sem poluição visual)
- **Variance:** 6/10 (assimetria moderada em hero e blocos editoriais)
- **Motion:** 6/10 (fluido, com microinterações contínuas e discretas)

## 2. Color Palette & Roles
- **Cosmic Deep** (`#000000`) — Fundo base global (`--bg-deep`)
- **Cosmic Mid** (`#0a0a1a`) — Fundo intermediário de seções (`--bg-mid`)
- **Cosmic Surface** (`#141340`) — Superfícies de componentes (`--bg-surface`)
- **Starlight Primary** (`#f5f0e8`) — Texto principal e headings (`--text-primary`)
- **Starlight Muted** (`rgba(245, 240, 232, 0.72)`) — Texto secundário e metadata (`--text-muted`)
- **Power Star** (`#ffd23f`) — Accent principal para CTA e foco (`--accent-star`)
- **Power Star Dim** (`rgba(255, 210, 63, 0.12)`) — Fundo de pills, badges e hover soft (`--accent-star-dim`)
- **Cosmic Cyan** (`#5ce0d8`) — Destaques secundários e glows internos (`--cosmic-cyan`)
- **Cosmic Purple** (`#6a3cbc`) — CTA secundário e overlays (`--cosmic-purple`)
- **Cosmic Rose** (`#c8508c`) — Acento narrativo complementar (`--cosmic-rose`)

## 3. Typography Rules
- **Display/Body:** `Outfit, sans-serif` (`--font-body`)
- **Hierarchy:** Títulos com peso 700–900; corpo entre 400–500
- **Reading rhythm:** Entrelinha confortável e largura ideal de 55–70 caracteres por linha
- **Utility labels:** Navegação e microcopy em caixa alta com leve letter-spacing
- **Fallback:** `sans-serif` quando `Outfit` não estiver disponível

## 4. Component Stylings
- **Buttons:** Primário em `Power Star`; secundário pode usar `Cosmic Purple`.  
  Active state com leve compressão vertical e transição suave.
- **Cards/Containers:** Base em `Cosmic Surface`; separação por contraste tonal, não por sombras pesadas.
- **Countdown/Metrics:** Dígitos com forte destaque; labels em `Starlight Muted`.
- **Badges/Pills:** Fundo `Power Star Dim` com texto de alto contraste.
- **Hero:** Composição espacial de alto impacto mantendo legibilidade acima de efeitos.

## 5. Layout Principles
- Arquitetura grid-first com alinhamento consistente entre seções
- Contenção por largura máxima (ex.: 1200–1400px) com respiro lateral progressivo
- Hero e blocos-chave podem operar com assimetria; áreas informativas seguem eixo estável
- Em mobile (< 768px), colapso obrigatório para coluna única sem overflow horizontal
- Escala de espaçamento vertical fluida via `clamp(...)`

## 6. Motion & Interaction
- **Primary easing:** `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`
- **Elastic easing:** `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Entrances:** Reveal em cascata com atraso curto
- **Microinteractions:** Hover/focus por opacidade, brilho interno e deslocamento sutil
- **Performance:** Animações em `transform` e `opacity` (evitar propriedades de layout)

## 7. Anti-Patterns (Banned)
- Não usar paleta inferida por screenshot quando existe token oficial
- Não trocar `Outfit` por `Inter` sem aprovação de branding
- Não usar `#FFFFFF` como texto padrão quando `--text-primary` está definido
- Não introduzir cinzas fora da paleta oficial
- Não aplicar glow externo agressivo em botões e cards
- Não criar gradientes fora do conjunto cósmico + Power Star

## 8. Canonical Token Snippet
```css
:root {
  --bg-deep: #000000;
  --bg-mid: #0a0a1a;
  --bg-surface: #141340;
  --text-primary: #f5f0e8;
  --text-muted: rgba(245, 240, 232, 0.72);
  --accent-star: #ffd23f;
  --accent-star-dim: rgba(255, 210, 63, 0.12);
  --cosmic-cyan: #5ce0d8;
  --cosmic-purple: #6a3cbc;
  --cosmic-rose: #c8508c;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --font-body: 'Outfit', sans-serif;
}