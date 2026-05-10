# Especificação — Contador Regressivo Animado
## Super Mario Galaxy: O Filme

---

## 1. Visão Geral

Contador regressivo para estreia de filme, exibido como hero section de landing page.  
Tema: espaço sideral escuro com estrelas animadas, nuvens coloridas (rosa/roxo) e estrelas flutuantes estilo Mario.

**Data alvo:** 25 de Dezembro de 2026

---

## 2. Layout

### Estrutura geral
```
[ Indicadores de slide (dots) ]
────────────────────────────────────────
[ HERO SECTION ]
  - Background: espaço profundo (dark navy/preto)
  - Nebulosas decorativas: rosa (esq.) e roxo (dir.)
  - Estrelas decorativas: ⭐ emoji / SVG espalhados
  - Galáxia espiral: canto inferior direito

  [ Headline ]
    "Cada estrela guarda uma historia. A sua começa agora."
    Sublinha: "SUPER MARIO GALAXY: O FILME"

  [ Label ]
    "ESTREIA NOS CINEMAS EM"

  [ CONTAINER DO CONTADOR ]
    ┌─────────────────────────────────────────┐
    │   244    :   10    :   09    :   09     │
    │   DIAS       HORAS     MIN       SEG    │
    └─────────────────────────────────────────┘

  [ Data por extenso ]
    "Dia 25 de Dezembro, 2026"

────────────────────────────────────────
[ FOOTER ]
  "Super Mario Galaxy: O Filme"
  Disclaimer legal (Nintendo)
```

---

## 3. Tipografia

| Elemento             | Estilo                                      |
|----------------------|---------------------------------------------|
| Headline             | Bold, ~2.5rem, branco                       |
| "estrela" destaque   | Laranja/amarelo dourado                     |
| "agora." destaque    | Laranja, itálico                            |
| Subtitle filme       | Caps, spacing largo, branco ~0.7rem         |
| Label "ESTREIA"      | Caps, spacing largo, branco/amarelo ~0.7rem |
| Números do contador  | Bold display, ~4.5rem, branco               |
| Labels (DIAS, etc.)  | Caps, ~0.65rem, cinza claro                 |
| Data por extenso     | ~0.85rem, branco/cinza claro                |

---

## 4. Cores

```css
--bg-deep:        #050818   /* fundo escuro profundo */
--bg-card:        #0d1224   /* card do contador, semi-transparente */
--border-card:    rgba(255,255,255,0.08)
--text-primary:   #ffffff
--text-muted:     #8899bb
--accent-orange:  #f5a623   /* "estrela", números destaque */
--accent-red:     #e84040   /* "agora." */
--nebula-pink:    rgba(220, 80, 180, 0.35)
--nebula-purple:  rgba(100, 60, 200, 0.35)
--separator:      rgba(255,255,255,0.25)
```

---

## 5. Animação do Contador — Comportamento

### Regra principal
> **Transição limpa de número** — sem efeito elaborado.  
> A cada segundo, o dígito simplesmente troca, com uma leve transição de opacidade/posição vertical (flip sutil).

### Sequência de atualização
1. **SEG** — atualiza a cada 1 segundo  
2. **MIN** — atualiza quando SEG chega a 00  
3. **HORAS** — atualiza quando MIN chega a 00  
4. **DIAS** — atualiza quando HORAS chega a 00  

### Efeito de transição (por dígito)
```
Estado atual  →  fade-out + translateY(-8px)   (duração: 150ms)
Novo número   →  fade-in  + translateY(+8px→0) (duração: 150ms)
```
- Sem flip 3D, sem blur, sem scale exagerado
- Transição leve, clean, quase imperceptível — apenas indica mudança

### Comportamento visual
- Números sempre formatados com zero à esquerda: `09`, `00`, `244`
- DIAS sem zero à esquerda (pode ser 3 dígitos)
- Separador `:` fixo, sem piscar

---

## 6. Elementos Decorativos

| Elemento         | Descrição                                              |
|------------------|--------------------------------------------------------|
| Estrelas de fundo| Pontos brancos pequenos, estáticos ou twinkle leve    |
| Nebulosa rosa    | Blur radial, canto esquerdo, ~opacity 0.4             |
| Nebulosa roxa    | Blur radial, canto direito, ~opacity 0.35             |
| ⭐ Mario stars   | 4–6 estrelas emoji/SVG animadas, float suave           |
| Galáxia espiral  | Imagem/SVG canto inferior direito, baixa opacidade    |

---

## 7. Responsividade

| Breakpoint | Comportamento                               |
|------------|---------------------------------------------|
| Desktop    | Layout centralizado, fonte ~4.5rem números  |
| Tablet     | Fonte reduzida ~3rem                        |
| Mobile     | Números ~2rem, labels menores               |

---

## 8. Estrutura de Arquivos

```
/
├── index.html       ← estrutura semântica
├── style.css        ← visual, tema, layout
└── countdown.js     ← lógica do contador + animação
```

---

## 9. Acessibilidade

- `aria-live="polite"` no container do contador
- `aria-label` descritivo em cada unidade: "244 dias"
- Contraste adequado texto/fundo (WCAG AA)

---

## 10. Notas de Implementação

- Calcular diferença entre `Date.now()` e `new Date('2026-12-25T00:00:00')`
- `setInterval` de 1000ms
- Ao trocar número: adicionar classe `.changing` → remover após 300ms
- CSS transition controlada pela classe, não por JS inline
- Disclaimer: "Projeto criado para fins educacionais. Nintendo, Mario e personagens relacionados são marcas registradas da Nintendo Co., Ltd."
