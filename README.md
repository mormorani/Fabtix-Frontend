## 🎭 Fabtix Frontend (Sugestão) 🎭

Este projeto é o frontend de uma aplicação chamada "Fabtix", provavelmente para venda de ingressos para shows e eventos, construída com Angular e utilizando o Vite como ferramenta de build.

## 💻 Tecnologias Utilizadas

- Angular
- TypeScript
- JavaScript
- Vite
- Ng-Bootstrap (Bootstrap para Angular)
- ngx-toastr (Notificações)
- RxJS (Programação Reativa)


## 📂 Arquitetura do Projeto

### 📁 src/app

Lógica principal da aplicação Angular.

- `app.module.ts` 📦: Módulo raiz da aplicação.
- `app-routing.module.ts` 🧭: Define as rotas da aplicação.
- `app.component.*`: Componente raiz.
- `components/` 🧱: Componentes reutilizáveis.
    - `modals/`: Componentes modais.
        - `confirmation-modal/`: Modal de confirmação.
        - `performance-detail/`: Detalhes de um evento/performance.
        - `performance-update/`:  Atualização de informações de um evento.
    - `navbar/`: Componente da barra de navegação.
- `pages/` 📄: Componentes que representam as páginas principais da aplicação.
    - `all-performances/`: Lista todos os eventos.
    - `artist/`: Página de um artista.
    - `home/`: Página inicial.
    - `login/`: Página de login.
    - `signup/`: Página de cadastro.
    - `ticket-purchase/`: Página de compra de ingressos.
- `services/` ⚙️: Serviços para comunicação com APIs e outras lógicas de negócio.
    - `artist.service.*`, `auth.service.*`, `country.service.*`, `performance.service.*`, `purchase.service.*`, `review.service.*`: Serviços para gerenciamento de artistas, autenticação, países, eventos, compras e avaliações, respectivamente.

### 📁 src/assets

Recursos estáticos como imagens, ícones, etc.

- `images/`: Imagens dos artistas e outros recursos visuais.
- `DeWatermark.ai_1725115689159.png`, `fabtix.ico`:  Imagens adicionais.

### 📁 dist/fabtix-frontend

Contém os arquivos compilados e otimizados da aplicação, prontos para produção.

### 📁 public

Recursos públicos, tipicamente acessíveis diretamente pela URL.

- `favicon.ico`: Ícone da aplicação.

### 📄 Arquivos da raiz

- `.angular/cache`: Cache do Angular CLI.
- `.editorconfig`: Configurações do editor de código.
- `.firebase`, `.firebaserc`: Configurações do Firebase (provavelmente para hosting e/ou outros serviços).
- `.git`: Pasta do repositório Git.
- `.gitignore`: Define os arquivos e pastas ignorados pelo Git.
- `.vscodeignore`: Define arquivos e pastas ignorados pelo VS Code.
- `.vscode`: Configurações do VS Code.
- `angular.json` ⚙️: Configurações do projeto Angular.
- `firebase.json` 🔥: Configurações do Firebase.
- `package.json`, `package-lock.json` 📦: Gerenciamento de dependências.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json` ⚙️: Configurações do compilador TypeScript.

## Próximos Passos

- Adicionar instruções de instalação e execução do projeto.
- Incluir links para a documentação (se houver) e repositório do backend (se aplicável).
- Adicionar badges de status da build e outros indicadores relevantes.


