
```
CircleApp
├─ README.md
├─ frontend
│  ├─ .prettierrc
│  ├─ README.md
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ cards
│  │  │  │  └─ PostCard.tsx
│  │  │  ├─ layout
│  │  │  │  └─ SideBar.tsx
│  │  │  ├─ mode-togle.tsx
│  │  │  ├─ theme-provider.tsx
│  │  │  └─ ui
│  │  │     ├─ button.tsx
│  │  │     ├─ card.tsx
│  │  │     ├─ dropdown-menu.tsx
│  │  │     └─ input.tsx
│  │  ├─ context
│  │  │  ├─ AuthContext.tsx
│  │  │  └─ AuthProvider.tsx
│  │  ├─ hooks
│  │  │  └─ useAuth.ts
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  ├─ axios.ts
│  │  │  └─ utils.ts
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ ForgotPass.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ Login.tsx
│  │  │  └─ Register.tsx
│  │  ├─ routes
│  │  │  └─ index.tsx
│  │  └─ store
│  │     ├─ authSlice.ts
│  │     └─ index.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
└─ server
   ├─ .env
   ├─ package-lock.json
   ├─ package.json
   ├─ prisma
   │  ├─ migrations
   │  │  ├─ 20260602051839_init
   │  │  │  └─ migration.sql
   │  │  ├─ 20260602062831_fixing
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  └─ schema.prisma
   ├─ prisma.config.ts
   ├─ src
   │  ├─ controllers
   │  │  └─ auth.controller.ts
   │  ├─ index.ts
   │  ├─ lib
   │  │  └─ prisma.ts
   │  ├─ middleware
   │  │  └─ auth.middleware.ts
   │  └─ routes
   │     └─ auth.route.ts
   └─ tsconfig.json

```