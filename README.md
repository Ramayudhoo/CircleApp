```
CircleApp
├─ design.md
├─ frontend
│  ├─ .prettierrc
│  ├─ components.json
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-DbQDejRW.js
│  │  │  └─ index-YAhpzlnw.css
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ cards
│  │  │  │  ├─ PostCard.tsx
│  │  │  │  ├─ ProfileCard.tsx
│  │  │  │  └─ SuggestCard.tsx
│  │  │  ├─ FollowListModal.tsx
│  │  │  ├─ layout
│  │  │  │  └─ SideBar.tsx
│  │  │  ├─ mode-togle.tsx
│  │  │  ├─ theme-provider.tsx
│  │  │  └─ ui
│  │  │     ├─ avatar.tsx
│  │  │     ├─ button.tsx
│  │  │     ├─ card.tsx
│  │  │     ├─ dialog.tsx
│  │  │     ├─ dropdown-menu.tsx
│  │  │     ├─ input.tsx
│  │  │     ├─ separator.tsx
│  │  │     ├─ sheet.tsx
│  │  │     ├─ sidebar.tsx
│  │  │     ├─ skeleton.tsx
│  │  │     ├─ sonner.tsx
│  │  │     ├─ tabs.tsx
│  │  │     └─ tooltip.tsx
│  │  ├─ context
│  │  │  ├─ AuthContext.tsx
│  │  │  └─ AuthProvider.tsx
│  │  ├─ hooks
│  │  │  ├─ use-mobile.ts
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useCreateReply.ts
│  │  │  ├─ useCreateThreads.ts
│  │  │  ├─ useEditProfile.ts
│  │  │  ├─ useFollowList.ts
│  │  │  ├─ useSearchUser.ts
│  │  │  ├─ useSuggestUsers.ts
│  │  │  ├─ useThreadDetail.ts
│  │  │  ├─ useThreads.ts
│  │  │  └─ useUserThreads.ts
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  ├─ axios.ts
│  │  │  ├─ socket.ts
│  │  │  └─ utils.ts
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ Activity.tsx
│  │  │  ├─ ForgotPass.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ Login.tsx
│  │  │  ├─ Profile.tsx
│  │  │  ├─ Register.tsx
│  │  │  ├─ Search.tsx
│  │  │  ├─ ThreadDetail.tsx
│  │  │  └─ UserProfile.tsx
│  │  ├─ routes
│  │  │  └─ index.tsx
│  │  ├─ services
│  │  │  ├─ followServices.ts
│  │  │  ├─ replyServices.ts
│  │  │  ├─ threadServices.ts
│  │  │  └─ userServices.ts
│  │  ├─ store
│  │  │  ├─ authSlice.ts
│  │  │  ├─ followSlice.ts
│  │  │  ├─ hooks.ts
│  │  │  ├─ index.ts
│  │  │  ├─ likeSlice.ts
│  │  │  └─ profileSlice.ts
│  │  └─ types
│  │     ├─ follow.ts
│  │     ├─ suggest.ts
│  │     └─ user.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
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
   │  │  ├─ 20260608153106_add_reply_likes
   │  │  │  └─ migration.sql
   │  │  ├─ 20260609022508_add_cascade_delete
   │  │  │  └─ migration.sql
   │  │  ├─ 20260609061601_add_reply_like
   │  │  │  └─ migration.sql
   │  │  └─ migration_lock.toml
   │  ├─ schema.prisma
   │  └─ seed.ts
   ├─ prisma.config.ts
   ├─ scratch_test.ts
   ├─ src
   │  ├─ controllers
   │  │  ├─ auth.controller.ts
   │  │  ├─ follow.controller.ts
   │  │  ├─ thread.controller.ts
   │  │  └─ user.controller.ts
   │  ├─ index.ts
   │  ├─ lib
   │  │  ├─ multer.ts
   │  │  └─ prisma.ts
   │  ├─ middleware
   │  │  └─ auth.middleware.ts
   │  ├─ routes
   │  │  ├─ auth.route.ts
   │  │  ├─ follow.route.ts
   │  │  ├─ index.ts
   │  │  ├─ reply.route.ts
   │  │  ├─ thread.route.ts
   │  │  └─ user.route.ts
   │  └─ uploads
   │     ├─ 2026-06-05_09-44-02_circle app.png
   │     ├─ 2026-06-08_15-19-21_memes.jpg
   │     ├─ 2026-06-08_15-28-59_hidupjokowi.jpg
   │     ├─ 2026-06-08_15-36-47_hidupjokowi.jpg
   │     ├─ 2026-06-09_10-55-34_circle app.png
   │     ├─ 2026-06-09_16-17-59_hidupjokowi.jpg
   │     ├─ 2026-06-09_16-18-24_memes.jpg
   │     ├─ 2026-06-10_09-59-40_hidupjokowi.jpg
   │     ├─ 2026-06-10_10-51-35_hidupjokowi.jpg
   │     ├─ 2026-06-10_11-03-42_hidupjokowi.jpg
   │     ├─ 2026-06-11_09-00-02_hidupjokowi.jpg
   │     ├─ 2026-06-11_10-40-18_memes.jpg
   │     ├─ 2026-06-13_19-08-24_tampan dan pemberani.jpeg
   │     ├─ 2026-06-13_19-12-59_P1140979.jpg
   │     ├─ 2026-06-13_19-14-06_057d5e3f-996e-4ada-af68-99fa8aee1559.jpeg
   │     └─ 2026-06-13_19-25-27_gundar.png
   └─ tsconfig.json

```
