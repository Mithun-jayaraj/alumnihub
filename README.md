# Alumnis-Hub

**Alumnis-Hub is a dynamic platform designed to connect junior and senior students of a college. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), the application provides a collaborative space for students to share their profiles, interact, and build meaningful connections. The platform features email OTP verification for account security and robust messaging functionalities to facilitate seamless communication.

---

## Features

### 🎓 **Student Networking**
- 3rd and 4th-year students can share their LinkedIn, GitHub, and LeetCode profiles in a feed.
- 1st and 2nd-year students can view, like, and share these posts.

### 🔒 **Secure Registration and Login**
- User authentication with **bcrypt.js** for password hashing.
- **Email OTP verification** using **Email.js** ensures account security.

### 💬 **Messaging System**
- Real-time messaging allows users to connect and collaborate.

### 📬 **Feed Interactions**
- Posts can be liked, shared, and commented on, promoting a vibrant and interactive community.

---

## Technologies Used

| Technology      | Description                                    |
|------------------|------------------------------------------------|
| React.js         | Frontend framework for building the UI.       |
| Express.js       | Backend framework for handling server logic.  |
| Node.js          | Server-side runtime environment.              |
| MongoDB          | NoSQL database for storing user data.         |
| bcrypt.js        | For secure password hashing.                  |
| Email.js         | To send OTPs for email verification.          |

---

## Installation and Setup

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/Abishek00ujj/Alumni-s-Hub.git
   cd alumnis-hub
   ```

2. **Backend Setup**  
   - Navigate to the `Backend` directory:  
     ```bash
     cd Backend
     ```
   - Install dependencies:  
     ```bash
     npm install
     ```
   - Create a `.env` file and configure the following variables:
     ```bash
     MONGO_URI=<your-mongodb-connection-string>
     EMAIL_USER=<your-gmail-address>
     EMAIL_PASS=<your-gmail-app-password>
     CLIENT_URL=http://localhost:5173
     ```
     - For Gmail, generate an App Password in your Google account security settings.
     - Do not use your normal Gmail password unless you have enabled less secure app access.
   - Start the backend server:  
     ```bash
     npm start
     ```

3. **Frontend Setup**  
   - Navigate to the `seniorscommunity` directory:  
     ```bash
     cd ../seniorscommunity
     ```
   - Install dependencies:  
     ```bash
     npm install
     ```
   - Create a `.env` file with your API base URL for production only:
     ```bash
     VITE_API_BASE_URL=http://localhost:5000
     ```
   - Start the frontend server:  
     ```bash
     npm run dev
     ```

4. **Access the Application**  
   Open your browser and navigate to:  
   ```bash
   http://localhost:5173
   ```

---

## Deployment

- Frontend: Deploy the `seniorscommunity` folder to Vercel. Set `VITE_API_BASE_URL` in Vercel Environment Variables to your backend URL.
- Backend: Deploy the `Backend` folder to Render as a Node web service. Set `MONGO_URI`, `EMAIL_USER`, `EMAIL_PASS`, and `CLIENT_URL` in Render Environment Variables.

> If you deploy frontend and backend separately, the frontend will call the backend via the environment variable `VITE_API_BASE_URL`.

---

## Future Enhancements

- **Alumni Integration:** Extend the platform to include alumni, enabling further mentorship and career guidance.
- **Advanced Analytics:** Implement analytics to provide insights into user engagement.
- **Mobile App:** Develop a mobile application for easier accessibility.

---

## Contributing

We welcome contributions! Please follow these steps:  

1. Fork the repository.  
2. Create a new branch (`git checkout -b feature-name`).  
3. Commit your changes (`git commit -m "Add feature"`).  
4. Push to the branch (`git push origin feature-name`).  
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**.

---

## Disclaimer

The project is under active development. New features and improvements are added regularly. 

**Please do not clone for commercial purposes.**  

---

**Built with ❤️ by Mithun **
