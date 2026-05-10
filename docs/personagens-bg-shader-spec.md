# Especificação Técnica: Background Animado da Seção Personagens

## 1. Objetivo

Implementar um background dinâmico e imersivo para a seção `#personagens` usando um shader visual baseado em ruído Perlin (FBM - Fractional Brownian Motion), simulando uma aurora galáctica ou nebulosa em movimento contínuo.

## 2. Tipo de Background

**Canvas Shader (2D/GLSL-inspired):** O background é renderizado em um `<canvas>` com algoritmos de ruído e animação temporal, criando um efeito visual fluido e responsivo.

## 3. Componentes Visuais

### 3.1 Ruído Base (FBM - Fractional Brownian Motion)
- **Função:** `fbm(vec2 p)`
- **Octavas:** 3 camadas de ruído superpostas
- **Amplitude inicial:** 0.3
- **Redução por octava:** 0.4x
- **Rotação:** Aplicada a cada iteração para criar textura orgânica

### 3.2 Animação Temporal
- **Shake/Tremor:** Movimento sutil na tela
  - Eixo X: `sin(iTime * 1.2) * 0.005`
  - Eixo Y: `cos(iTime * 2.1) * 0.005`
- **Velocidade FBM:** Avança com `iTime * 5.0` no eixo X
- **Loop:** Contínuo e infinito

### 3.3 Trajetórias de Aurora
- **Número de linhas/raios:** 35 traços independentes
- **Fórmula de posição:** Baseada em funções trigonométricas com fase por índice
- **Offset dinâmico:** Aplica ruído variável a cada raio
- **Redução de opacidade:** Gradual de 1.0 (base) a 0.0 (ponta)

### 3.4 Paleta de Cores

Gradiente dinâmico variando ao longo do tempo e índice:

| Canal | Fórmula | Intervalo |
|-------|---------|-----------|
| **Red (R)** | `0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4)` | [0.1, 0.4] (ciano-rosado) |
| **Green (G)** | `0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5)` | [0.3, 0.8] (verde-amarelo) |
| **Blue (B)** | `0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3)` | [0.7, 1.0] (ciano-roxo) |
| **Alpha (A)** | `1.0` (constante) | Opacidade total |

**Dominância:** Predominantemente ciano → roxo → rosa, simulando aurora boreal.

### 3.5 Composição Final (Tone Mapping)

- **Exponenciação:** `pow(o / 100.0, vec4(1.6))` → Contraste e saturação
- **Aplicação Tanh:** `tanh(...)` → Compressão de valores extremos
- **Ganho final:** `* 1.5` → Intensidade luminosa

## 4. Tokens de Design (:root)

| Token | Uso | Padrão |
|-------|-----|--------|
| `--bg-deep` | Cor de fundo base | `#0a0e27` |
| `--cosmic-cyan` | Matiz primário da aurora | `#5ce0d8` |
| `--cosmic-purple` | Matiz secundário | `#6a3cbc` |
| `--cosmic-rose` | Matiz complementar | `#c8508c` |
| `--text-primary` | Referência geral | `#f5f0e8` |

## 5. Performance e Otimização

### 5.1 Renderização
- **Canvas Size:** Responsive (`window.innerWidth`, `window.innerHeight`)
- **Formato de Imagem:** `ImageData` com cálculo de pixel direto (no WebGL)
- **Taxa de frames:** 60 FPS (via `requestAnimationFrame`)

### 5.2 Redimensionamento
- **Listener:** `window.addEventListener('resize', ...)`
- **Ação:** Atualizar dimensões do canvas e uniforms de resolução
- **Debounce:** Nenhum (efeito contínuo)

### 5.3 Limpeza
- **Cancelamento:** `cancelAnimationFrame(frameId)`
- **Remoção:** DOM element removido ao desmontar

## 6. Propriedades da Seção

```css
.personagens-section {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: var(--bg-deep);
}

#personagens-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
```

## 7. Integração com Conteúdo

- **Z-index do Canvas:** 0 (fundo)
- **Z-index do Conteúdo:** ≥ 10 (acima do background)
- **Interatividade:** `pointer-events: none` no canvas → não interfere com clicks

## 8. Comportamento Responsivo

- **Redimensionamento dinâmico:** Canvas se adapta automaticamente
- **Proporção:** Mantém aspect ratio viewport (1:1 com altura da janela)
- **Sem scrolling:** Background é `position: fixed`

## 9. Critérios de Aceitação Visuais

- [ ] Aurora animada com 35 raios dinâmicos
- [ ] Cores predominantemente ciano-roxo-rosa
- [ ] Tremor suave na tela (shake)
- [ ] Ruído Perlin visível na composição
- [ ] Fade gradual nos raios (ponta transparente)
- [ ] Nenhum travamento ou piscadas
- [ ] Sem interferência com cliques em personagens
- [ ] Responsivo a redimensionamento de janela

## 10. Notas de Implementação

- **Sem bibliotecas externas:** Apenas Canvas 2D nativo (sem THREE.js)
- **Compatibilidade:** Moderno (Chrome, Firefox, Safari, Edge)
- **Fallback:** Se Canvas não for suportado, mostrar `--bg-deep` sólido
- **Acessibilidade:** `aria-hidden="true"` ou `role="presentation"`
