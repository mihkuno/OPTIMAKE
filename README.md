# 🚀 OptiMake

### 📌 Web-Based Decision Support System for University Course Scheduling
Leverages **Constraint Programming** with **Google's OR-Tools CP-SAT Model** to optimize course scheduling efficiently.

---

## 🛠️ Setup

### 1️⃣ Install **Deno 2.0**
#### 🖥️ Windows
Run the following command in PowerShell:
```powershell
irm https://deno.land/install.ps1 | iex
```

#### 🐧 macOS & Linux
Follow the official Deno installation guide: [Deno Docs](https://docs.deno.com/runtime/getting_started/installation/)

---

## 📦 Install Dependencies
Run:
```sh
deno install
```

---

## ▶️ Run the App
Start the application with:
```sh
deno run dev
```

---

## 🤝 Contributing
1. Fork the repository 🍴
2. Create a new branch 🌱
3. Commit your changes 📌
4. Submit a pull request 🔄

---

## 🏗️ Next.js 15 Project Structure

This project follows an **Atomic Project Structure Design**, ensuring modularity and maintainability.

OptiMake is built with **Next.js 15**, which introduces **Partial Prerendering (PPR)** and improved React Server Components (RSC). The project structure follows Next.js' latest best practices:

## 📂 Folder Organization (Next.js 15)

```
/src
 ├── app/            # Uses Next.js App Router (new feature)
 │   ├── layout.tsx  # Defines shared layouts
 │   ├── page.tsx    # Default homepage
 │   ├── loading.tsx # Suspense loading state
 │   ├── error.tsx   # Error handling page
 │   ├── dashboard/  # Nested routes for dashboard
 ├── components/     # Reusable UI components
 ├── hooks/          # Custom React hooks
 ├── lib/            # Server utilities (database, authentication, API clients)
 ├── types/          # TypeScript type definitions and interfaces
 ├── utils/          # Helper functions and utilities
 ├── store/          # Global state management (Zustand, Redux, or Context API)
 ├── styles/         # Global styles (CSS, Tailwind)
 ├── public/         # Static assets
 ├── middleware.ts   # Edge functions and middleware
```

## 📖 Learn More

### Next.js 15 Features
- [Next.js 15 Official Blog](https://nextjs.org/blog/next-15)
- [Partial Prerendering Explained](https://nextjs.org/docs/advanced-features/partial-prerendering)

### Atomic Project Structure
- [Atomic Design Principles](https://bradfrost.com/blog/post/atomic-web-design/)
- [Organizing React Projects](https://react.dev/learn#organizing-components)
  
---

### 💡 Stay Connected
📧 Contact us for inquiries and collaborations!

