# TV Show List 📺

A simple, stylish app to track your favorite TV shows. Search from the [TVMaze API](https://www.tvmaze.com/api), rate them, organize your personal list, and share it with others!

## Features 💥
- 🎨 Dark Mode  
- 💨 Smooth Animations Everywhere
- ✍️ Custom List Names & Sorting (using [dnd kit](https://dndkit.com))
- 👤 Personalized Avatars and Bios
- 💾 Persistent Customized Lists (Saved in MongoDB)  
- 🛠 Robust Error Handling & Form Validation (Client & Server)
- 🔥 Hot Toast Notifications (using [React Hot Toast](https://react-hot-toast.com))  
- 📱 Support for all Resolutions (Mobile!)

<img width="1920" height="1080" alt="home" src="https://github.com/user-attachments/assets/0c8f1808-1ef4-445a-adfe-f626356a0860" />
<img width="1920" height="1241" alt="search" src="https://github.com/user-attachments/assets/1da59772-f6a5-4066-a5dd-e53b66265612" />
<img width="1945" height="957" alt="dimmer" src="https://github.com/user-attachments/assets/1a499553-1b12-4c68-8964-2bb716b4401c" />
<img width="1921" height="1057" alt="profile" src="https://github.com/user-attachments/assets/38e1f689-69ef-4130-9330-19054c6851ec" />
<p align="center">
  <img width="30%" alt="iphone" src="https://github.com/user-attachments/assets/18649999-53d4-4ea5-a276-83763f688aaf" />
  <img width="30%" alt="iphone2" src="https://github.com/user-attachments/assets/0efc310c-2229-4750-a60c-2b4889a7c0df" />
  <img width="30%" height="716" alt="iphone3" src="https://github.com/user-attachments/assets/edc00233-dc07-4cd8-b8b7-475753c65767" />
</p>


---

## 🛠 Tech Stack  
Made entirely from scratch using:
- React.js + Vite  
- Bootstrap  
- Node.js + Express  
- MongoDB (Atlas)  
- Cloudinary (for poster uploads)

---

## 🚀 Installation

### Requirements
- [Git](https://git-scm.com/downloads)  
- [Node.js (v22.7.0 or later)](https://nodejs.org/en)

---

### 1. Clone the Repository

```bash
git clone https://github.com/amenhany/react-tv-list.git
cd react-tv-list
```

### 2. Configure Environment Variables

Create two files:  
- `server/.env`  
- `client/.env`

#### `server/.env`
```env
MONGO_URI=your_mongo_uri
PORT=3000
SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_secret
NODE_ENV=production
```

#### `client/.env`
```env
VITE_API_URL=/api
```

---

### 3. Build the Frontend

```bash
cd client
npm install
npm run build
```

This generates a `dist/` folder with the compiled React app.

---

### 4. Serve the frontend through the backend

Open `/server/app.js` and uncomment the commented lines and imports, and comment the `secure` field in the cookie object.

---

### 4. Start the Server

```bash
cd ../server
npm install
npm run start
```

---

### 5. Open in Browser

Navigate to `http://localhost:<your_port>` (usually 3000 or whatever you set).

> 🔁 In development, set `NODE_ENV=development` instead, then `npm run dev` in both client and server folders and connect to `http://localhost:5173`.

---

## ✅ To-Do

- [x] User Accounts  
- [x] Authentication & Authorization  
- [x] Suggested Shows Homepage  
- [x] List Sorting  
- [ ] Email Verification (won't do for the privacy of the testers)
