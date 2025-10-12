# Frontend - Final Project

Frontend desenvolvido por **Willian Cavalcanti Coelho** para o projeto final.

## 🚀 Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (componentes)
- Better Auth (autenticação)
- React Router DOM

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Produção

```bash
npm run build
npm run preview
```

## 🎨 Estrutura

```
src/
├── components/
│   └── ui/          # Componentes do shadcn/ui
├── lib/
│   ├── auth.ts      # Configuração do Better Auth
│   └── utils.ts     # Utilitários
├── pages/
│   ├── Login.tsx    # Página de login
│   ├── SignUp.tsx   # Página de cadastro
│   └── Dashboard.tsx # Dashboard (protegida)
├── App.tsx          # Rotas principais
└── main.tsx         # Ponto de entrada
```

## 🔐 Autenticação

O frontend se comunica com o backend através do Better Auth Client. As rotas protegidas só são acessíveis após login.

### Fluxo de Autenticação

1. Usuário faz login/cadastro
2. Better Auth cria sessão no backend
3. Session é validada nas rotas protegidas
4. Usuário pode acessar o Dashboard

## 🎨 Personalização

Os componentes UI são baseados no shadcn/ui e podem ser customizados através do Tailwind CSS.

Para modificar o tema, edite o arquivo `src/index.css`.

## 👨‍💻 Autor

Willian Cavalcanti Coelho
