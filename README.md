# 🍳 Cookle — App Frontend (Expo / React Native)

App mobile desenvolvido com Expo + React Native que consome uma API de receitas. Este repositório contém a interface (frontend) do aplicativo Cookle: telas, componentes e um contexto de favoritos.

Tecnologias

- **Framework:** Expo (React Native)
- **Navegação:** `expo-router`, `@react-navigation/native`
- **UI / Ícones:** `@expo/vector-icons`, `react-native-vector-icons`
- **Fonts:** `@expo-google-fonts/poppins`
- **Estado global:** Context API (ex.: `FavoritesContext`)

Visão geral
Este projeto é a camada de interface para navegar por receitas, favoritar, ver detalhes e criar novas receitas. Ele espera que exista uma API de backend (ex.: `http://localhost:5000`) servindo endpoints de receitas — vários componentes fazem `fetch` diretamente para `http://localhost:5000/recipes`.

Estrutura principal

- `app/` — páginas (Expo Router): `index.jsx`, `create.jsx`, `favorites.jsx`, `profile.jsx`, `recipe/[id].jsx`, `+not-found.jsx` e o layout em `app/_layout.jsx`.
- `components/` — componentes reutilizáveis:
  - `Carousel/Carousel.jsx` — slider de imagens
  - `RecipeCard/RecipeCard.jsx` — destaque de receita popular
  - `RecipeList/RecipeList.jsx` — grade de receitas
- `contexts/FavoritesContext.jsx` — contexto para favoritar receitas
- `public/` — ícones e imagens locais usados nas telas

Scripts úteis (do `package.json`)

- `npm start` — inicia o Expo (abre o Metro Bundler)
- `npm run android` — inicia o app no emulador Android / dispositivo (via Expo)
- `npm run ios` — inicia o app no simulador iOS (macOS)
- `npm run web` — roda como web app via `react-native-web`

Instalação & execução (ambiente de desenvolvimento)

1. Clone o repositório e entre na pasta:

   `git clone https://github.com/Nathsanfer/cookle-app-front.git`
   `cd cookle-app-front`

2. Instale dependências:

   `npm install`

   Observação: este projeto usa `expo-image-picker`. Para garantir que a versão nativa compatível seja instalada automaticamente após `npm install`, o projeto adiciona um `postinstall` que executa `npx expo install expo-image-picker`. Se preferir executar manualmente, rode:

    `npx expo install expo-image-picker`

3. Inicie o Metro/Expo:

   `npm start`

4. Abra no dispositivo/emulador:

- Pelo Metro você pode selecionar `Run Android`, `Run iOS` (se aplicável) ou escanear o QR no app Expo Go (Android/iOS).
- Para rodar direto via script:

  `npm run android`

Observações sobre `localhost` e emuladores

- Se estiver usando um emulador Android padrão do Android Studio, `localhost` refere-se ao próprio emulador; para acessar o servidor da máquina host use `10.0.2.2` (emulador AVD) ou configure o host no Expo (tunnel/local). Alguns códigos do projeto fazem `fetch('http://localhost:5000/recipes')` — ajuste para `http://10.0.2.2:5000` ou a URL do seu backend quando necessário.

Configuração da API (recomendação)

- Atualmente as URLs de API estão hard-coded nos componentes (`RecipeList`, `RecipeCard`). Recomendo extrair a base da API para uma constante ou variável de ambiente. Exemplo simples: crie `config.js` com:

```js
export const API_BASE = "http://localhost:5000";
```

e consuma `fetch(`${API_BASE}/recipes`)...`.

Componentes principais (resumo)

- `app/_layout.jsx` — provê as Tabs do app e envolve as páginas com `FavoritesProvider`.
- `app/index.jsx` — tela Home: header, busca, `Carousel`, `RecipeCard` (destaque) e `RecipeList`.
- `components/RecipeCard/RecipeCard.jsx` — busca uma receita específica (`/recipes/43`) e mostra em destaque; permite favoritar via `FavoritesContext`.
- `components/RecipeList/RecipeList.jsx` — busca todas as receitas (`/recipes`) e mostra em grade dupla; inclui filtro por `searchQuery`.
- `contexts/FavoritesContext.jsx` — gerencia favoritos em memória (adiciona/remove e fornece `favoriteRecipes`).

Boas práticas e próximos passos sugeridos

- Remover URLs hard-coded e usar variável de configuração ou `.env`.
- Persistir favoritos (ex.: `AsyncStorage`) para manter entre sessões.
- Tratar erros de rede com mensagens visuais ao usuário (toasts/snackbars).
- Implementar autenticação com backend (se necessário) e rotas protegidas.
- Ajustar consumo da API para funcionar corretamente em emuladores (10.0.2.2) e dispositivos reais.

Troubleshooting (erros comuns)

- App não carrega receitas: verifique se o backend está rodando na porta correta (ex.: `http://localhost:5000`) e se o emulador consegue alcançá-lo.
- Erro ao instalar dependências: rode o comando em `cmd.exe` se houver política do PowerShell bloqueando scripts — `npm install` funciona no `cmd.exe`.
- Problemas com fontes/ícones: execute `expo start -c` para limpar cache.

Quer que eu:

- Extraia as URLs de API para um `config.js` e atualize todos os componentes? (posso aplicar o patch)
- Persista favoritos com `AsyncStorage`?
- Gere uma versão exportável (APK / build) ou uma Collection do Postman para o backend?

Se quiser, eu já posso aplicar as mudanças sugeridas (ex.: mover `http://localhost:5000` para `config.js`) — me diga qual opção prefere.

Bom trabalho! — se quiser, eu adapto o README com instruções de deploy passo-a-passo.
