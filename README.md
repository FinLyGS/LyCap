# Captcha Moderno

Um captcha moderno e elegante que pode ser facilmente integrado em qualquer site através de um iframe.

## Características

- 🔒 Dois tipos de desafios que alternam aleatoriamente:
  - Desafio de texto com efeitos visuais
  - Desafio de emoji com direções
- 🎨 Design moderno e responsivo
- 🌙 Suporte a tema escuro
- ⏱️ Timer de 2 minutos
- 🔄 Sistema de tentativas e cooldown
- 🚫 Prevenção de copiar/colar e arrastar/soltar
- 📱 Totalmente responsivo

## Como Usar

1. Copie os arquivos para seu servidor:
   - `index.html`
   - `style.css`
   - `script.js`
   - `modal.js`

2. Adicione o seguinte código ao seu HTML:

```html
<!-- Container do captcha -->
<div id="LyCap"></div>

<!-- Inclua o script da modal -->
<script src="modal.js"></script>
```

O script irá automaticamente:
- Criar o botão de verificação
- Criar a modal com o iframe
- Adicionar os estilos necessários
- Incluir o Font Awesome para os ícones

## Personalização

### Cores
Você pode personalizar as cores alterando as variáveis CSS no seu arquivo de estilos:

```css
:root {
    --primary-color: #6366f1;
    --primary-hover: #4f46e5;
    --modal-bg: rgba(0, 0, 0, 0.5);
}
```

### Tamanho do Modal
O modal ocupa a tela inteira por padrão. Para ajustar o tamanho, modifique as propriedades `width` e `height` da classe `.modal-content`.

## Eventos

O captcha envia mensagens para a página pai quando a verificação é bem-sucedida:

```javascript
window.addEventListener('message', function(event) {
    if (event.data.type === 'captchaSuccess') {
        // A verificação foi bem-sucedida
        // Faça algo aqui, como habilitar um formulário
    }
});
```

## Suporte

Se você encontrar algum problema ou tiver sugestões, por favor abra uma issue no GitHub.

## Licença

Este projeto está licenciado sob a licença MIT. 