content = """# Spec: Estréia / Contador Section

## 1. Objetivo
Criar uma seção de alto impacto visual para anunciar a data de lançamento do filme, utilizando um cronômetro regressivo (countdown) funcional. O design deve reforçar a estética "Galaxy" com nebulosas, estrelas e tipografia vibrante, gerando senso de urgência e expectativa.

## 2. Inventário de Elementos
* **Background**: Fundo preto profundo com assets de nebulosas (rosa/azul à esquerda, roxo/espiral à direita).
* **Power Stars**: Assets de estrelas amarelas clássicas distribuídas de forma orgânica.
* **Subtítulo Superior**: "SUPER MARIO GALAXY: O FILME" em caixa alta.
* **Título Principal**: "Cada estrela guarda uma historia. A sua começa agora." (com destaque de cor em "estrela" e "agora").
* **Label do Contador**: "ESTREIA NOS CINEMAS EM" em caixa alta e cor amarela.
* **Container do Contador**: Bloco retangular com bordas arredondadas e fundo semitransparente escuro.
* **Unidades do Contador**: Dígitos grandes para Dias, Horas, Minutos e Segundos.
* **Separadores**: Linhas verticais pontilhadas entre as unidades.
* **Data de Rodapé**: "Dia 25 de Dezembro, 2026".
* **Legal/Créditos**: Textos de propriedade intelectual centralizados na base.

## 3. Estrutura HTML (Semântica)
```html
<section id="estreia" class="countdown-section" data-target-date="2026-12-25T00:00:00">
  <div class="stars-overlay"></div> <header class="countdown-header">
    <p class="subtitle">SUPER MARIO GALAXY: O FILME</p>
    <h2 class="main-title">
      Cada <span class="highlight-star">estrela</span> guarda uma historia. 
      A sua começa <span class="highlight-now">agora</span>.
    </h2>
  </header>

  <div class="countdown-container">
    <p class="countdown-label">ESTREIA NOS CINEMAS EM</p>
    
    <div class="timer-grid">
      <div class="timer-item">
        <span class="timer-value" data-countdown="days">00</span>
        <span class="timer-unit">DIAS</span>
      </div>
      <div class="timer-separator"></div>
      <div class="timer-item">
        <span class="timer-value" data-countdown="hours">00</span>
        <span class="timer-unit">HORAS</span>
      </div>
      <div class="timer-separator"></div>
      <div class="timer-item">
        <span class="timer-value" data-countdown="min">00</span>
        <span class="timer-unit">MIN</span>
      </div>
      <div class="timer-separator"></div>
      <div class="timer-item">
        <span class="timer-value" data-countdown="seg">00</span>
        <span class="timer-unit">SEG</span>
      </div>
    </div>

    <p class="release-date">Dia 25 de Dezembro, 2026</p>
  </div>

  <footer class="legal-footer">
    <p class="footer-title">Super Mario Galaxy: O Filme</p>
    <p class="footer-copy">Projeto conceitual para fins educacionais. Nintendo, Mario e personagens relacionados são marcas registradas de Nintendo Co., Ltd.</p>
  </footer>
</section>