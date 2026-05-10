# Especificação Técnica: Navegação Flutuante (Nav Section)

## 1. Objetivo
Prover uma navegação persistente e minimalista que surge após o impacto inicial do Hero. O componente deve atuar como uma âncora visual para as seções principais (`Personagens`, `Trailers`, `Estreia`), mantendo o usuário orientado sem poluir a atmosfera cinematográfica.

## 2. Estrutura HTML
A estrutura deve seguir o padrão de lista para semântica e acessibilidade.

- **Container:** `<nav id="floating-nav" class="nav-pill-container" aria-label="Navegação secundária">`
- **Lista:** `<ul class="nav-pill-list">`
- **Itens:**
    - `<li><a href="#hero" class="nav-link active">SMG</a></li>` (Identificador do projeto/topo)
    - `<li><a href="#personagens" class="nav-link">Personagens</a></li>`
    - `<li><a href="#trailers" class="nav-link">Trailers</a></li>`
    - `<li><a href="#estreia" class="nav-link">Estreia</a></li>`

## 3. Estados Visuais e Comportamento
- **Estado Inicial (Hidden):** `opacity: 0; transform: translateY(10px); visibility: hidden;`
- **Estado Ativo (.visible):** Ativado via JS. `opacity: 1; transform: translateY(0); visibility: visible;`
- **Scroll Spy:** A classe `.active` deve ser movida conforme o usuário atinge o ID da seção correspondente no scroll.

## 4. Mapeamento de Estilos (Tokens CSS)
| Propriedade | Token / Valor | Justificativa |
| :--- | :--- | :--- |
| **Fundo da Pill** | `--bg-surface` (#141340) | Superfície de componente definida no Design System. |
| **Borda** | `1px solid --border-strong` | Separação sutil do fundo profundo. |
| **Texto (Idle)** | `--text-muted` | Garante que o menu seja discreto. |
| **Texto (Active/Hover)** | `--accent-star` (#ffd23f) | Destaque em Power Star para foco e seleção. |
| **Tipografia** | `--font-body` (Outfit) | Peso 600-700, All Caps, Letter-spacing `0.06em`. |
| **Sombra** | `--shadow-md` | Cria profundidade sobre o conteúdo em scroll. |
| **Raio** | `--radius-full` (9999px) | Formato cápsula (Pill) conforme o print. |

## 5. Comportamento JavaScript
- **Threshold de Exibição:** - A classe `.visible` deve ser adicionada quando `window.scrollY > (height(#hero) * 0.6)`.
  - Se `#hero` não estiver presente no DOM, usar fallback fixo de `400px`.
- **Suavização:** Implementar `scroll-behavior: smooth` no CSS global.

## 6. Responsividade e Acessibilidade
- **Mobile (< 768px):** - Reduzir padding horizontal da Pill.
  - Ocultar labels se necessário ou converter para ícones simplificados (opcional, manter texto por padrão se couber).
- **Foco:** `focus-visible` deve disparar um outline de 2px em `--cosmic-cyan` com offset de 2px.

## 7. Checklist de Implementação
- [ ] Validar se a fonte 'Outfit' está carregada antes da exibição.
- [ ] Garantir que o `z-index` seja superior a todos os elementos, exceto modais de trailer.
- [ ] Verificar contraste do `--accent-star` sobre o `--bg-surface`.
- [ ] Testar performance de renderização (usar `will-change: transform, opacity`).

## 8. Critérios de Aceitação Visuais
- A navegação deve parecer "flutuar" suavemente ao aparecer (fade-in + slide-up).
- O item "SMG" deve ser visualmente distinto (cor `--accent-star` por padrão ou peso maior) conforme o print.
- As divisórias verticais entre os links devem usar `--border-subtle` com altura reduzida (ex: 50% da pill).
