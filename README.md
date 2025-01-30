# 🚀 OptiMake

### 📌 Web-Based Decision Support System for University Course Scheduling
Leverages **Constraint Programming** with **Google's OR-Tools CP-SAT Model** to optimize course scheduling efficiently.

---

## 🏗️ Project Structure
This project follows an **Atomic Project Structure Design**, ensuring modularity and maintainability.

### 🧩 What is Atomic Project Structure?
Atomic Project Structure is a **modular approach** to organizing code, inspired by Atomic Design in UI/UX. It breaks down the project into independent, reusable components that follow a hierarchical system. This structure enhances **scalability**, **reusability**, and **maintainability**.

#### 📂 Folder Organization
```
/src
 ├── atoms/         # Smallest reusable components (buttons, inputs, labels)
 ├── molecules/     # Groups of atoms forming meaningful UI elements (forms, cards)
 ├── organisms/     # Complex components containing molecules (navigation, sections)
 ├── templates/     # Layouts combining organisms to structure the UI
 ├── pages/         # Route-level components
 ├── services/      # API calls, business logic
 ├── hooks/         # Custom React hooks
 ├── utils/         # Helper functions
```

📖 Learn more about Atomic Project Structure:
- [Atomic Design Principles](https://bradfrost.com/blog/post/atomic-web-design/)
- [Organizing React Projects](https://react.dev/learn#organizing-components)

---

## 🏗️ Next.js 15 Project Structure
OptiMake is built with **Next.js 15**, which introduces **Partial Prerendering (PPR)** and improved React Server Components (RSC). The project structure follows Next.js' latest best practices:

#### 📂 Folder Organization (Next.js 15)
```
/src
 ├── app/            # Uses Next.js App Router (new feature)
 │   ├── layout.tsx  # Defines shared layouts
 │   ├── page.tsx    # Default homepage
 │   ├── loading.tsx # Suspense loading state
 │   ├── error.tsx   # Error handling page
 │   ├── dashboard/  # Nested routes for dashboard
 ├── components/     # Reusable UI components
 ├── lib/            # Server utilities (database, authentication)
 ├── styles/        # Global styles (CSS, Tailwind)
 ├── public/        # Static assets
 ├── middleware.ts  # Edge functions and middleware
```

📖 Learn more about Next.js 15:
- [Next.js 15 Features](https://nextjs.org/blog/next-15)
- [Partial Prerendering Explained](https://nextjs.org/docs/advanced-features/partial-prerendering)

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

### 💡 Stay Connected
📧 Contact us for inquiries and collaborations!

