# Circle App

A full-stack social media application where users can create threads, reply, like posts, and follow other users — with real-time notifications powered by Socket.io.

## Features

- 🔐 User authentication (JWT-based)
- 📝 Thread creation with image upload
- 💬 Replies/comments on threads
- ❤️ Like system for both threads and replies
- 👥 Follow / unfollow system
- 🔔 Real-time notifications via Socket.io
- 🎨 Light/dark mode toggle
- 🔍 User search

## Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS, ShadCN/UI
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client

### Backend
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **File Upload:** Multer
- **Real-time:** Socket.io

## Project Structure

CircleApp/
├── frontend/ # React + Vite client
│ └── src/
│ ├── components/ # UI components
│ ├── pages/ # Route pages
│ ├── hooks/ # Custom hooks
│ ├── services/ # API service calls
│ ├── store/ # Redux slices
│ └── context/ # React context (Auth)
└── server/ # Express API server
├── prisma/ # Database schema & migrations
└── src/
├── controllers/ # Route handlers
├── routes/ # API routes
└── middleware/ # Auth middleware


## Getting Started

### Prerequisites
- Node.js
- PostgreSQL database

### Backend Setup

1. Navigate to the server directory
```bash
   cd server
   npm install
```

2. Create a `.env` file with your own credentials (see `.env.example` if available):

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret

   ⚠️ Never commit your `.env` file — make sure it's listed in `.gitignore`.

3. Run database migrations
```bash
   npx prisma migrate dev
```

4. Start the server
```bash
   npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory
```bash
   cd frontend
   npm install
```

2. Start the development server
```bash
   npm run dev
```

## Database Schema

The application uses 5 main models:
- `users` — user accounts and profiles
- `threads` — main posts
- `replies` — comments on threads
- `likes` — likes on threads and replies
- `following` — follow/follower relationships

## Author

**Rama Cahaya Yudhoyono**
Full Stack Developer
- GitHub: [@Ramayudhoo](https://github.com/Ramayudhoo)
- Portfolio: [portfolio-new-eight-rose.vercel.app](https://portfolio-new-eight-rose.vercel.app/)
