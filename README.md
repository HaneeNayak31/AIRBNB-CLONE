WanderLust is a full-featured web application inspired by Airbnb that lets users explore, list, and review properties.

🔗 Live Demo: https://airbnb-clone-2-bdey.onrender.com

⚠️ Note: You may see a browser security warning because it's hosted on a free Render URL. It’s safe for testing.

🚀 Features
👤 Authentication
Sign Up / Login / Logout using Passport.js
Session-based authentication with express-session and MongoDB store

🏡 Listings
Add new listings with images (via Multer + Cloudinary)
View all listings on the homepage
Edit or Delete listings (only by listing owner)

✍️ Reviews
Add reviews for listings
Delete reviews (by review author)

🔒 Authorization
Middleware to restrict access to routes based on login status and ownership

⚠️ Error Handling
User-friendly error pages and flash messages (success/failure)
Express error handler for catching route/middleware issues

🧑‍💻 Tech Stack
Frontend: EJS, Bootstrap, HTML5, CSS3
Backend: Node.js, Express.js
Database: MongoDB Atlas
Auth: Passport.js (Local Strategy)
File Upload: Multer + Cloudinary
Session Store: connect-mongo
Deployment: Render

