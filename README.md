# No-Bid Freelance Marketplace

A modern, streamlined freelance platform built to eliminate bidding wars. Instead of freelancers competing in race-to-the-bottom auctions, **Clients** post fixed-budget projects with required skill tags, and the platform's automated **Smart Matching Engine** instantly discovers and invites qualified **Freelancers** based on their skill sets.

---

## 📸 UI Screenshots & Previews

### 1. Login Page
*Sleek, modern authentication screen for returning users to access their respective dashboards.*
> ![Login Preview](./screenshots/login.png)

### 2. Registration (Sign Up) Page
*Dynamic onboarding flow allowing users to join as either a Client or Freelancer, complete with a skill profile setup for automatic matching.*
> ![Signup Preview](./screenshots/signup.png)

### 3. Client Dashboard
*Clean workspace where clients can enter fixed-budget project scopes, specify required skill sets, and trigger instant auto-matched invitations.*
> ![Client Dashboard Preview](./screenshots/client-dash.png)

### 4. Freelancer Dashboard
*Dedicated workspace showing direct, auto-matched project invitation cards with one-click Accept or Decline actions.*
> ![Freelancer Dashboard Preview](./screenshots/freelancer-dash.png)

---

## ✨ Features

* **Role-Based Access Control:** Separate optimized workflows and dashboards for Clients and Freelancers.
* **Smart No-Bid Matching Engine:** Automatically cross-references project requirements with registered freelancer skills upon project creation, generating direct invitations.
* **Secure Authentication:** Password hashing via `bcryptjs` and protected endpoints using JSON Web Tokens (JWT).
* **Invitation Management:** Freelancers can view incoming auto-matched invitations and accept or reject them instantly.

---

## 🛠 Tech Stack

* **Frontend:** React, Axios, Modern CSS UI
* **Backend:** Node.js, Express, JSON Web Tokens (JWT), bcryptjs
* **Database & ORM:** PostgreSQL, Prisma ORM

---

## 📂 Project File Structure

```text
NoBidFreelance/
├── server/
│   ├── prisma/
│   │   └── schema.prisma         # Database models (User, Project, Invitation)
│   ├── .env                      # Environment variables
│   ├── index.js                  # Express backend & matching logic
│   └── package.json              # Backend dependencies
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js          # Modern UI login & registration screen
    │   │   └── Dashboard.js      # Upgraded role-specific client & freelancer dashboard
    │   ├── services/
    │   │   └── api.js            # Configured Axios instance with token interceptor
    │   ├── App.js                # Main router and auth state manager
    │   └── index.js              # React DOM entry point
    └── package.json              # Frontend dependencies
```

---

## 🚀 Getting Started Locally (Walkthrough)

Follow these steps to run the application on your own device. 

### Prerequisites
* **Node.js**: Ensure Node.js is installed on your machine.
* **PostgreSQL**: Ensure PostgreSQL is installed and the database service is actively running on your machine.

### Step 1: Clone the Repository
Open your terminal and clone the project to your local machine:
```bash
git clone [https://github.com/your-username/NoBidFreelance.git](https://github.com/your-username/NoBidFreelance.git)
cd NoBidFreelance
```

### Step 2: Backend Setup & Database Sync
1. Navigate to the server folder and install the required dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server/` directory and configure your local PostgreSQL credentials and a JWT secret phrase:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/nobid_db?schema=public"
   JWT_SECRET="super_secret_jwt_key_12345"
   PORT=5000
   ```
   *(Note: Replace `your_password` with your actual PostgreSQL password. If your database name is different, replace `nobid_db` accordingly).*

3. Initialize the Prisma database client and push the schema to automatically create your database tables:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Start the backend development server:
   ```bash
   node index.js
   ```
   *(The server will boot up and run on `http://localhost:5000`)*

### Step 3: Frontend Setup
1. Open a **new** terminal tab/window (leave the backend server running) and navigate to the client folder:
   ```bash
   cd client
   npm install
   ```
2. Start the React development server:
   ```bash
   npm start
   ```
   *(The application will automatically open in your default browser, typically at `http://localhost:3000`)*

---

## 🧪 Testing the Workflow

1. **Create a Freelancer:** Click "Sign Up", select the **Freelancer** role, and enter a few skills separated by commas (e.g., `React, Node, Python`).
2. **Create a Client:** Open an incognito window (or log out), click "Sign Up", and register a separate account using the **Client** role.
3. **Post a Project:** While logged in as the Client, fill out the project form and include one of the skills you assigned to the freelancer (e.g., `React`). Click submit.
4. **Accept/Reject:** Log back in as the Freelancer. You will immediately see the auto-matched project invitation on your dashboard with options to accept or decline the work.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).