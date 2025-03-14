# Clone do Cinform Online

Este projeto é um clone do site [Cinform Online](http://cinformonline.com.br/) desenvolvido apenas com HTML, CSS e JavaScript puro. O conteúdo é consumido diretamente da API do WordPress do site original.

## Demonstração

Acesse a versão online: [https://ernanesa.github.io/helloworld2/](https://ernanesa.github.io/helloworld2/)

## Características

- Layout responsivo que se adapta a diferentes tamanhos de tela
- Consumo de dados da API REST do WordPress
- Carregamento dinâmico de conteúdo
- Pesquisa de posts
- Filtragem por categorias
- Modal para visualização de posts completos
- Carregamento de mais posts com paginação

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- API REST do WordPress
- GitHub Pages para hospedagem

## Estrutura do Projeto

```
├── index.html          # Arquivo HTML principal
├── css/
│   └── style.css       # Estilos CSS
├── js/
│   └── main.js         # Código JavaScript
└── README.md           # Documentação
```

## Como Funciona

O site consome dados da API REST do WordPress do Cinform Online através de requisições fetch. Os principais endpoints utilizados são:

- `/wp-json/wp/v2/posts` - Para obter posts
- `/wp-json/wp/v2/categories` - Para obter categorias

O JavaScript manipula esses dados e os exibe no layout HTML/CSS criado.

## Limitações

Este é um projeto de demonstração e possui algumas limitações:

- Não possui sistema de comentários
- Não possui sistema de autenticação
- Algumas funcionalidades avançadas do site original não foram implementadas
- As categorias são simuladas com IDs fixos

## Uso Local

Para executar este projeto localmente:

1. Clone o repositório
2. Abra o arquivo `index.html` em seu navegador

Não é necessário servidor local, pois todas as requisições são feitas diretamente para a API do WordPress.

## Aviso Legal

Este projeto foi criado apenas para fins educacionais e de demonstração. Todo o conteúdo pertence ao Cinform Online e seus respectivos proprietários.

## Autor

Ernane - [GitHub](https://github.com/ernanesa)