# 💰 Expense Tracker with Budget Insights

A professional and modern expense tracker web application built using *React.js, **Firebase, and **Chart.js. This project was developed as part of my **Web Development Internship* at Codec Technologies.

It allows users to manage income and expenses, view monthly summaries, visualize trends, and export transaction data easily.

---

## 🚀 Features

- 📌 *Income vs Expense Tracking*
- 📊 *Bar and Pie Charts* for visual insights
- 📅 *Month-wise Filtered Data View*
- 📝 *Transaction History by Category*
- 📤 *Export Transactions* as *CSV* and *PDF*
- 🔐 *User Authentication* (Signup/Login with Firebase)
- 📈 *Real-time Firebase Firestore Integration*
- ✅ *Toast Alerts* for interactions

---

## 🛠 Tech Stack

- *Frontend:* React.js, Tailwind CSS
- *Backend/Database:* Firebase (Firestore + Auth)
- *Charts & Export:* Chart.js, jsPDF, react-toastify

---

## 📂 Folder Structure

expense-tracker-pro/
│
├── public/
│ └── index.html
│
├── src/
│ ├── assets/
│ │ └── (images, icons, etc.)
│ │
│ ├── components/
│ │ ├── AddTransaction.js
│ │ ├── Chart.js
│ │ ├── ExportData.js
│ │ ├── MonthlyInsights.js
│ │ ├── Navbar.js
│ │ └── TransactionList.js
│ │
│ ├── pages/
│ │ ├── Login.js
│ │ └── Signup.js
│ │
│ ├── App.js
│ ├── firebase.js
│ ├── index.css
│ └── index.js
│
├── package.json
├── tailwind.config.js
└── README.md

---

## 🧪 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Khushisoni702/expense-tracker.git

2. Install dependencies:

npm install

3. Setup your Firebase project and paste your config in firebase.js.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

4.Start the development server

npm start

📤 Export Examples
CSV Export: Download filtered transactions with date/category/income/expense.

PDF Export: Includes bar and pie charts along with summary data.

## 🙌 Credits
This project was created as part of my Web Development Internship at Codec Technologies.

