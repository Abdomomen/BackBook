# BackBook 🚀

**Advanced Social Media Platform**

BackBook is a premium, full-stack social media application designed with a focus on modern aesthetics, security, and a seamless user experience. It supports multiple languages (Arabic & English), features a sophisticated design system, and includes advanced community management tools.

---

## ✨ Key Features

### 👤 Profile Management

- **Interactive Bio:** Users can express themselves with a customizable personal biography.
- **Engagement Stats:** Real-time tracking of posts, likes, and comments.
- **Avatar Customization:** Premium image upload system for profile pictures.

### 📝 Social Feed & Interactions

- **Rich Posts:** Share stories with multi-image support and elegant layouts.
- **Micro-Interactions:** Like and comment system with real-time UI updates.
- **Content Moderation:** Built-in profanity filter for both Arabic and English to maintain a respectful community.

### 🤝 Connections

- **Friend Suggestions:** Advanced algorithm based on mutual friends and new users.
- **Relationship Management:** Send, accept, or decline friend requests with real-time notifications.
- **Global Search:** Find people easily with a lightning-fast search system.

### 🌍 Global & Accessible

- **Bilingual Interface:** Full support for Arabic (RTL) and English (LTR).
- **Dark/Light Mode:** Seamless theme switching with persistent user preferences.
- **PWA Ready:** Installable on mobile and desktop devices for a native app experience.

### 🛡️ Security & Performance

- **Safe Authentication:** Robust JWT-based login with Refresh Token rotation and secure cookies.
- **Data Protection:** Rate limiting, helmet security headers, and MongoDB sanitization.
- **Optimized Loading:** Image lazy loading and debounced search for superior performance.

---

## 🛠️ Tech Stack

**Frontend:**

- Next.js 15+ (App Router)
- Tailwind CSS (Premium Design System)
- React Hot Toast (Notifications)
- Framer Motion (Subtle Animations)

**Backend:**

- Node.js & Express
- MongoDB with Mongoose
- Multer (File Handling)
- JWT (Authentication)
- Security Middlewares (Helmet, HPP, CORS)

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/backbook.git
   cd backbook
   ```

2. **Setup Backend:**

   ```bash
   cd Backend
   npm install
   ```

   Create a `.env` file in the `Backend` folder:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   REFREASH_TOKEN_JWT=your_refresh_secret
   CLIENT_URL=http://localhost:3001
   ```

   Run the server:

   ```bash
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

---

## 📄 License

This project is open-source. Feel free to use and modify it for your needs.

---

_Made with ❤️ by **Abdo Momen**_

**Credits:**

- **Core Logic & Backend:** Developed by **Abdo Momen**
- **UI Design & Refinement:** Generated with **Antigravity AI**
