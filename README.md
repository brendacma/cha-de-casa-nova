# Lista de presentes do meu chá de casa nova

Site que eu fiz para a lista de presentes do meu chá de casa nova.

Fiz porque nenhum site pronto de lista de presentes estava me agradando. Eu queria um visual meu, com os produtos que eu realmente escolhi na Shopee, foto e preço de cada um, e um jeito de o item sumir da lista quando alguém já tivesse escolhido, para ninguém ganhar o mesmo presente duas vezes. Como não achei nada que fizesse tudo isso do jeito que eu queria, decidi fazer o meu próprio.

Site no ar: https://chadecasanovabrendinha.netlify.app

## O que ele faz

- Lista os produtos com foto, preço e um botão que abre o produto direto na Shopee.
- Filtro por cômodo (banheiro, cozinha, lavanderia, organização, decoração, quarto e eletro).
- Cada convidado pode tocar em **Vou dar este**. O site pergunta "Tem certeza que deseja selecionar esse produto?" e, se a pessoa confirmar, o item fica cinza, com a etiqueta **Já escolhido**, para todo mundo.
- Se duas pessoas confirmarem o mesmo item ao mesmo tempo, só a primeira vale. A outra vê um aviso de que o item já foi escolhido.
- Funciona no celular, que é onde o pessoal vai abrir pelo grupo do WhatsApp.

## Como funciona

Não tem servidor próprio nem banco de dados. São três peças gratuitas:

1. **A página** (`site/index.html`): um arquivo HTML com CSS e JavaScript puros, sem bibliotecas. A lista de produtos fica dentro do próprio arquivo, na variável `ITEMS`.
2. **Uma planilha do Google com Apps Script** (`apps-script/Codigo.gs`): guarda quais itens já foram escolhidos. A página consulta a planilha a cada 30 segundos e ao voltar para a aba, e grava a escolha quando alguém confirma. O script usa um bloqueio (`LockService`) para que a escolha dupla não aconteça.
3. **Netlify**: hospeda a pasta `site`.

```
.
├── site/                 # o que vai para o Netlify
│   ├── index.html
│   ├── sticker.png       # figurinha do topo da página
│   └── fotos/            # fotos dos produtos
└── apps-script/
    └── Codigo.gs         # código da planilha
```

## Como adaptar para o seu chá

1. Crie uma planilha no Google Sheets. Em **Extensões → Apps Script**, cole o conteúdo de `apps-script/Codigo.gs`.
2. Clique em **Implantar → Nova implantação**, tipo **App da Web**, executando como **Eu** e com acesso para **Qualquer pessoa**. Autorize quando o Google pedir e copie o endereço que termina em `/exec`.
3. Em `site/index.html`, cole esse endereço na variável `API_URL`. Se deixar a variável vazia, o botão "Vou dar este" não aparece e o site funciona só como lista de links.
4. Troque os itens da variável `ITEMS`. Cada item tem:
   - `id`: identificador único, só letras minúsculas, números e hífen. Não mude depois que a lista estiver no ar, porque é com ele que a planilha lembra o que foi escolhido.
   - `n`: nome, `c`: cômodo, `u`: link do produto, `img`: caminho da foto e `price`: preço como texto.
5. Troque as imagens da pasta `site/fotos` e a `site/sticker.png` pelas suas.
6. Arraste a pasta `site` em [app.netlify.com/drop](https://app.netlify.com/drop).

Para um item voltar a ficar disponível, apague a linha dele na aba `escolhas` da planilha.

## Observações

- Os preços são os que a Shopee mostrava quando montei a lista e mudam com o tempo. O rodapé da página avisa isso.
- As fotos dos produtos foram recortadas das páginas dos anúncios na Shopee e pertencem aos vendedores. Se for reaproveitar este projeto, use as suas próprias fotos.
- Qualquer pessoa com o endereço do Apps Script consegue marcar um item como escolhido. Para uma lista de chá entre amigos isso basta, mas não é um sistema seguro.
