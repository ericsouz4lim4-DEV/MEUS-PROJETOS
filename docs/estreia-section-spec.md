# Especificação Técnica: Seção Estréia / Contador

## 1. Objetivo
Apresentar o marco de lançamento do filme com uma **contagem regressiva** legível e cinematográfica: dígitos em destaque (métrica principal) e rótulos discretos (metadata), usando exclusivamente tokens do `:root` e o guia em `DESIGN.md`. A âncora `#estreia` integra-se à navegação flutuante (`docs/docs_nav-section-spec.md`).

## 2. Posicionamento no DOM
- A `<section id="estreia">` deve aparecer **imediatamente após** o `</section>` de `#trailers`.
- Não alterar o markup das seções anteriores (`#hero`, `#personagens`, `#trailers`) apenas para acomodar esta seção.

## 3. Contrato HTML
- **Raiz da seção:** `<section id="estreia" class="estreia-section" aria-labelledby="titulo-estreia" data-target-date="…">`
  - `data-target-date`: data/hora ISO ou string parseável por `Date` no fuso desejado (ex.: `2026-12-25T00:00:00-03:00`). Placeholder de projeto: `[DATA_DA_ESTREIA]` até definição oficial.
- **Cabeçalho editorial:** `<header class="estreia-head">` contendo:
  - `<p class="estreia-eyebrow">` (microcopy em caixa alta via CSS)
  - `<h2 id="titulo-estreia">` (título da seção — associado a `aria-labelledby` da section)
  - `<p class="estreia-lede">` (parágrafo de apoio; corpo secundário via token)
- **Contador:** `<div class="estreia-countdown" role="timer" aria-label="…">` envolvendo **quatro células**, cada uma com:
  - `<span class="estreia-countdown__num" data-countdown="…">00</span>`
  - `<span class="estreia-countdown__label">…</span>`
- **Valores de `data-countdown` (contrato para JS futuro):** `days` | `hours` | `minutes` | `seconds`.
- **Separadores visuais:** `<span class="estreia-countdown__sep" aria-hidden="true">:</span>` entre células no layout desktop; podem ser omitidos no CSS em viewports estreitas.

## 4. Comportamento (etapas)
- **Etapa HTML + CSS (atual):** os números permanecem como `00` ou valor estático definido no markup; nenhum script obrigatório.
- **Etapa JavaScript (futura):** ler `#estreia[data-target-date]` (ou equivalente), calcular delta até a data e atualizar **apenas** o `textContent` dos `[data-countdown="…"]`. Manter `tabular-nums` e padding mínimo nos dígitos para evitar “salto” de layout ao passar de um dígito a dois.

## 5. Mapeamento de Estilos (Tokens CSS)
Estilos em `css/styles.css`, escopados sob `.estreia-section`.

| Bloco / elemento | Tokens / decisões | Justificativa (DESIGN.md) |
| :--- | :--- | :--- |
| Eyebrow | `--text-xs`, `--font-weight-semibold`, `--tracking-wide`, `--cosmic-cyan` | Destaque secundário cósmico sem competir com o título |
| Título | herdado de `section[id]:not(#hero) h2` + tokens de tipo | Hierarquia consistente com outras seções |
| Lede | `--text-base`, `--font-weight-medium`, `--text-muted`, `--leading-relaxed`, `--prose-max-width` | Corpo informativo |
| Cartão do contador | `--bg-surface`, `--border-subtle`, `--radius-xl`, `--shadow-sm`, `--shadow-inner-soft`, `--gradient-star-field` + `background-blend-mode: soft-light` | Superfície de componente com atmosfera estelar controlada |
| Dígitos | `--accent-star`, `--font-weight-black`, `font-variant-numeric: tabular-nums`, `clamp` com `--text-5xl` | *Countdown / métricas*: forte destaque |
| Labels | `--text-xs`, `--text-muted`, uppercase + `--tracking-wide` | *Utility labels* discretas |
| Separador | `--text-muted`, opacidade moderada | Ritmo visual sem poluir |
| Mobile estreito (< 480px) | grid 2×2, separadores ocultos | Coluna única / sem overflow (`DESIGN.md` §5) |

Proibido pela diretriz global: cores fora da paleta oficial, glow externo agressivo em cartões, cinzas arbitrários.

## 6. Acessibilidade
- `aria-labelledby="titulo-estreia"` na section.
- `role="timer"` e `aria-label` descritivos no bloco do contador (ajustar cópia quando o JS passar a atualizar valores, se necessário para leitores de tela).
- Separadores `:` com `aria-hidden="true"`.
- Foco: links fora desta seção seguem o padrão global; qualquer controle futuro na seção deve usar `focus-visible` com anel em `--cosmic-cyan` quando aplicável.

## 7. Checklist de Implementação
- [ ] `id="estreia"` único e navegável via `#estreia`.
- [ ] `data-target-date` preenchido com data real antes do go-live.
- [ ] Quatro spans `.estreia-countdown__num` com `data-countdown` e conteúdo inicial `00` (ou valor estático acordado).
- [ ] Estilos confinados a `css/styles.css` com prefixo `.estreia-section` / BEM `estreia-countdown__*`.
- [ ] Nenhuma dependência de JavaScript na entrega estática desta seção.
- [ ] Conferir contraste de `--accent-star` sobre `--bg-surface` nos dígitos.

## 8. Referências
- `DESIGN.md` — paleta, tipografia, countdown/métricas, layout, motion e anti-patterns.
- `css/styles.css` — tokens em `:root` e regras `.estreia-section`.
- `index.html` — markup canônico da seção.
