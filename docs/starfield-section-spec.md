Com base nas diretrizes do `DESIGN.md` e nos tokens definidos no `styles.css`, aqui está a especificação técnica para a implementação da camada de fundo estelar.

---

# Especificação Técnica: Camada Starfield (Sistema de Partículas)

## 1. Objetivo

Criar uma camada de fundo dinâmica, porém discreta, que reforce a atmosfera de "contraste alto e brilho controlado". O sistema deve operar em segundo plano, sem interferir na legibilidade do conteúdo ou na performance de rolagem.

* **Natureza:** Elemento decorativo, não interativo.
* **Acessibilidade:** Deve possuir `aria-hidden="true"` para ser ignorado por tecnologias assistivas.
* **Desempenho:** Renderização via Canvas API para otimizar o uso de CPU/GPU em comparação a múltiplos elementos DOM.

---

## 2. HTML — Posicionamento

O elemento `<canvas>` deve ser o primeiro filho direto do `<body>` no `index.html`, garantindo que ele sirva como a base visual para todas as outras seções.

```html
<body>
  <canvas id="starfield" aria-hidden="true"></canvas>
  <main>...</main>
</body>

```

---

## 3. CSS — Estilização e Camadas

O comportamento do canvas deve ser fixo, cobrindo toda a viewport sem reagir a eventos de clique ou toque (evitando interferência na navegação).

* **ID:** `#starfield`
* **Posicionamento:** `fixed`, `inset: 0`
* **Empilhamento:** `z-index: -1` (abaixo de `--z-base`)
* **Interação:** `pointer-events: none`
* **Fundo Base:** O CSS deve manter o `background-color: var(--bg-deep)` no `body` para evitar flashes visuais antes do carregamento do JS.

---

## 4. JS — Contrato de `initStarfield()`

A lógica de animação deve ser encapsulada em um módulo independente que gerencie o ciclo de vida do elemento.

* **Responsividade:** O script deve escutar o evento `resize` e atualizar as dimensões do canvas.
* **Resolução:** Utilizar `window.devicePixelRatio` para evitar que as partículas fiquem borradas em telas de alta densidade (Retina).
* **Loop de Animação:** Implementar via `requestAnimationFrame`.
* **Cleanup:** Exportar uma função de destruição para remover listeners de evento caso a aplicação cresça para um modelo SPA.

---

## 5. Parâmetros Visuais (Alinhamento Design System)

As partículas e elementos visuais devem seguir estritamente a paleta e os princípios de movimento do sistema.

### Densidade e Estrelas

* **Quantidade:** Moderada (alinhar com *Density 5/10*).
* **Cores das Partículas:** Variar aleatoriamente entre `var(--text-primary)`, `var(--cosmic-cyan)` e `var(--accent-star)`.
* **Movimento:** Drift lento e contínuo (paralaxe suave baseado no scroll ou movimento automático discreto).

### Nebulosas e Meteoros

* **Nebulosas:** Gradientes radiais estáticos ou com rotação imperceptível usando `var(--cosmic-purple)` e `var(--cosmic-rose)` com opacidade baixa (< 15%).
* **Meteoros (Opcional):** Gatilhos raros de movimento rápido usando `--ease-out-expo` para o rastro.

---

## 6. Checklist e Critérios de Aceitação

* [ ] O canvas não cria barras de rolagem horizontal ou vertical.
* [ ] O consumo de CPU permanece abaixo de 5% em estado ocioso em dispositivos desktop.
* [ ] A cor de fundo dominante do canvas é `#000000` (`--bg-deep`).
* [ ] O texto sobre o starfield mantém contraste suficiente para conformidade WCAG AA.
* [ ] As estrelas não possuem "glow externo agressivo", conforme proibido nos *Anti-Patterns*.
* [ ] O redimensionamento da janela não distorce as proporções das partículas.