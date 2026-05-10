content = """# Spec: Trailers Section (Trailers oficiais)

## 1. Objetivo
Apresentar conteúdo audiovisual de alto impacto (trailers e clipes) através de um carrossel interativo, mantendo a atmosfera cósmica e a hierarquia visual definida no DESIGN.md. A seção serve como o principal ponto de engajamento narrativo da página.

## 2. Inventário de Elementos
* **Label/Kicker**: Texto "ASSISTA AGORA" em caixa alta, cor amarela (`--accent-star`).
* **Título Principal (H1/H2)**: "Trailers oficiais" (fonte Outfit, peso bold, cor branca).
* **Subtítulo**: "CLIPES DA AVENTURA NO ESPAÇO" (caixa alta, cor branca com opacidade).
* **Player de Vídeo (Componente Card)**:
    * Container com borda gradiente neon e cantos arredondados (`--radius-2xl`).
    * Thumbnail de alta resolução mostrando personagens.
    * Overlay de informações: "The Super Mario Bros. Movie | O...".
    * Controles customizados: Ícone Play central do YouTube, Botão de Link (canto inferior esquerdo) e Botão "Assista no YouTube" (canto inferior direito).
* **Controles de Navegação**:
    * Setas de direção (Anterior/Próximo) em círculos de destaque.
    * Indicadores de paginação (4 pontos), com o primeiro ativo em ciano (`--cosmic-cyan`).

## 3. Estrutura HTML (Semântica)
```html
<section id="trailers" class="trailers-section">
  <header class="trailers-header">
    <span class="trailers-kicker">ASSISTA AGORA</span>
    <h2 class="trailers-title">Trailers oficiais</h2>
    <p class="trailers-subtitle">CLIPES DA AVENTURA NO ESPAÇO</p>
  </header>

  <div class="trailers-carousel">
    <article class="video-card">
      <div class="video-container">
        <iframe 
          src="[TRAILER_URL_1]" 
          title="The Super Mario Bros. Movie - Trailer Oficial"
          loading="lazy"
          allowfullscreen>
        </iframe>
        
        <div class="video-overlay-top">
          <div class="channel-avatar"></div>
          <span class="video-title">The Super Mario Bros. Movie | O...</span>
        </div>
        
        <button class="play-button" aria-label="Play Video"></button>
        
        <div class="video-overlay-bottom">
          <button class="link-action" aria-label="Copiar Link"></button>
          <a href="#" class="youtube-cta">Assista no <img src="youtube-logo.svg" alt="YouTube"></a>
        </div>
      </div>
    </article>

    <nav class="carousel-nav">
      <button class="nav-arrow prev" aria-label="Anterior"></button>
      <div class="pagination-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <button class="nav-arrow next active" aria-label="Próximo"></button>
    </nav>
  </div>
</section>