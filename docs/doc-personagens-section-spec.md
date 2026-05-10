Aqui está a especificação técnica para a seção de personagens, estruturada estritamente conforme os prints fornecidos e o sistema de design estabelecido.

---

# Especificação Técnica: Seção Personagens (`#personagens`)

## 1. Objetivo

Apresentar o elenco principal através de uma composição espacial dinâmica ("Freeform"), simulando personagens flutuando no cosmos em diferentes planos de profundidade, escalas e eixos, servindo como base visual para a transição do efeito de parallax da Hero.

## 2. Inventário Visual (Extraído do Print)

A seção é composta exclusivamente pelos seguintes elementos:

1. **Fundo:** Fundo contínuo `--bg-deep` com o canvas `#starfield` visível.
2. **Personagens (6 unidades):** Imagens estáticas em formato `.webp` distribuídas de forma assimétrica.
3. **Decorações:** Pequenas estrelas amarelas (Power Stars) pontuando o espaço entre os personagens.
4. **Texto:** Transcrição exata do print: `"PERSONAGENS"`.

## 3. Estrutura HTML (Arquitetura)

A implementação deve evitar layouts de grade e focar em um contêiner de posicionamento relativo.

```html
<section id="personagens" class="personagens-section">
  <span class="personagens-eyebrow">PERSONAGENS</span>

  <div class="personagens-composition">
    <figure class="personagem-item" data-character="[nome]">
      <img src="assets/images/[arquivo].webp" alt="Personagem [nome]" loading="lazy">
    </figure>
    
    <div class="decor-star" aria-hidden="true"></div>
  </div>
</section>

```

## 4. Camadas Visuais e Composição OBRIGATÓRIA

Esta seção rejeita explicitamente o uso de `display: grid` ou `display: flex` para o posicionamento dos personagens.

* **Composição Freeform:** Cada `.personagem-item` deve possuir coordenadas independentes (ex: `top`, `left`, `right`, `bottom`) para replicar o efeito de "espalhamento" visto no print.
* **Variação de Escala:** Deve haver pelo menos 3 tamanhos distintos aplicados via `width` ou `transform: scale()`, simulando proximidade da câmera.
* **Variação Vertical:** Personagens não devem compartilhar a mesma linha de base; o topo e a base de cada imagem devem variar significativamente.
* **Assets de Imagem:**
* Mario: `assets/images/mario-original.webp`
* Luigi: `assets/images/luigi.webp`
* Peach: `assets/images/peach.webp`
* Yoshi: `assets/images/yoshi-perso.webp`
* Rosalina: `assets/images/rosalina.webp`
* Bowser Jr: `assets/images/bowser-jr.webp`



## 5. Tokens de Design Aplicados

* **Cores:**
* Texto `"PERSONAGENS"`: `--cosmic-cyan`.
* Fundo: `--bg-deep`.


* **Tipografia:**
* Rótulo: `var(--font-body)`, `font-weight-semibold`, `text-transform: uppercase`, `letter-spacing: var(--tracking-wide)`.


* **Motion:**
* Entrada: Reveal em cascata utilizando `--ease-out-expo`.
* Parallax: Deslocamento sutil em `Y` durante o scroll para reforçar a profundidade.



## 6. Suposições a Confirmar

* **Interatividade:** O print não mostra estados de hover ou links. Assume-se que nesta fase a seção é puramente visual e informativa.
* **Sobreposição:** O layout sugere que elementos decorativos (estrelas) podem ficar atrás ou à frente dos personagens para criar camadas.

## 7. Responsividade

* **Mobile (< 768px):** Conforme o `DESIGN.md`, a composição deve colapsar para uma coluna única ou um grid vertical simplificado para evitar overflow horizontal, mantendo a legibilidade e o alinhamento centralizado.
* **Desktop:** Manter a largura máxima do contêiner entre `1200px` e `1400px`.

## 8. Trilho de Scroll

A `<section id="personagens">` deve garantir uma `min-height: 100vh` para permitir que o efeito de parallax da seção anterior tenha espaço de "saída" (extendedEndSelector) e para que a composição espacial respire.

## 9. Checklist de Implementação

* [ ] Implementar personagens usando apenas as tags `<img>` e arquivos `.webp` especificados.
* [ ] Aplicar `aria-hidden="true"` em estrelas decorativas.
* [ ] Garantir que o texto `"PERSONAGENS"` use exatamente o token `--cosmic-cyan`.
* [ ] Verificar se o canvas `#starfield` permanece visível sob a seção.

## 10. Critérios de Aceitação Visuais (Anti-regressão)

* [ ] **Não está em grid/cards:** Os itens não formam linhas ou colunas previsíveis.
* [ ] **Distribuição por quadrantes:** Personagens ocupam cantos e áreas centrais de forma orgânica.
* [ ] **Variação de escala:** Pelo menos 3 tamanhos perceptivelmente distintos.
* [ ] **Variação vertical:** Diferença clara de altura entre o topo, meio e base dos itens.
* [ ] **Composição:** A sensação geral de "espalhamento" no vácuo espacial condiz com o print fornecido.