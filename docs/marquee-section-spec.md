# Conteúdo do arquivo marquee-section-spec.md conforme solicitado
marquee_spec_content = """# Especificação Técnica: Seção Marquee (`.marquee-section`)

## 1. Objetivo
Criar um elemento de transição dinâmica e informativa que reforça a marca e os temas do filme através de um movimento horizontal contínuo. A faixa serve como um divisor visual de alto contraste entre as seções de conteúdo, injetando ritmo e energia na navegação.

## 2. Inventário Visual (Extraído de `desktop-print-marquee.png`)
A seção é composta exclusivamente pelos seguintes elementos visuais e textuais, sem variações:

1.  **Faixa de Fundo:** Bloco sólido horizontal de cor `--cosmic-purple`.
2.  **Conteúdo Textual (Sequência de Loop):**
    * `SUPER MARIO GALAXY`
    * `/` (Separador visual)
    * `NOS CINEMAS`
    * `/`
    * `UMA AVENTURA PELO COSMOS`
    * `/`
    * `MARIO`
    * `/`
    * `LUIGI`
    * `/`
    * `ROSALINA`
    * `/`
3.  **Estilo de Texto:** Tipografia em caixa alta (uppercase), peso negrito, cor clara de alto contraste.

## 3. Estrutura HTML (Arquitetura)
A estrutura deve suportar a repetição do conteúdo para um loop infinito fluido ("seamless").

```html
<section class="marquee-section" role="marquee" aria-label="Destaques do filme">
  <div class="marquee-track">
    <div class="marquee-content">
      <span>SUPER MARIO GALAXY</span>
      <span class="marquee-sep">/</span>
      <span>NOS CINEMAS</span>
      <span class="marquee-sep">/</span>
      <span>UMA AVENTURA PELO COSMOS</span>
      <span class="marquee-sep">/</span>
      <span>MARIO</span>
      <span class="marquee-sep">/</span>
      <span>LUIGI</span>
      <span class="marquee-sep">/</span>
      <span>ROSALINA</span>
      <span class="marquee-sep">/</span>
    </div>
    <div class="marquee-content" aria-hidden="true">
      <span>SUPER MARIO GALAXY</span>
      <span class="marquee-sep">/</span>
      <span>NOS CINEMAS</span>
      <span class="marquee-sep">/</span>
      <span>UMA AVENTURA PELO COSMOS</span>
      <span class="marquee-sep">/</span>
      <span>MARIO</span>
      <span class="marquee-sep">/</span>
      <span>LUIGI</span>
      <span class="marquee-sep">/</span>
      <span>ROSALINA</span>
      <span class="marquee-sep">/</span>
    </div>
  </div>
</section>