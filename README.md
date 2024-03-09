# Foodz Project Overview
Foodz is a comprehensive web application designed for recipe management. It leverages modern technologies such as Django for the backend, React for the frontend, and various additional libraries to provide an intuitive user experience. Here's a detailed overview of the project, including its tech stack, challenges encountered, and solutions implemented:

## Tech Stack
### Backend
- Framework: Django
- Database: PostgreSQL
- API Documentation: Swagger
- Additional Libraries: django-rest-framework

### Frontend
- Framework: React
- Bundler: Vite
- UI Library: Mantine
- Additional Libraries: react-toastify, react-icons, crypto-js

## Challenges and Solutions

### UI Design

- Challenge: Designing a user interface that balances simplicity with functionality.
- Solution: Adopted a minimalistic design approach to ensure ease of use and efficient navigation.

### Image Handling

- Challenge: Addressing issues related to static file serving and image storage.
- Solution: Replaced the image field in the recipe model with a URL field to simplify deployment and enhance scalability.

### Procedure Model
- Challenge: Establishing a structured hierarchy for procedure steps within recipes.
- Solution: Implemented a separate table linked to the recipe model to model the hierarchy of procedure steps effectively.
### Encryption
- Challenge: Ensuring secure transmission of user credentials between the frontend and backend.
- Solution: Utilized the crypto-js library to encrypt passwords before transmission and decrypt them on the backend for verification.
### Backend Optimization
- Challenge: Minimizing API requests and optimizing backend performance.
- Solution: Divided the Home view into four independent sections to reduce the frequency of API requests, especially in sections like favorites.
### Deployment Challenges
- Challenge: Overcoming difficulties during deployment, particularly with API request timeouts.
- Solution: Introduced bulk transactions and optimized endpoints to mitigate issues encountered during deployment on platforms like Vercel.

## Additional Notes
- Documentation: Detailed documentation for the backend and frontend specific parts of the project is available in their respective directories.
- API Documentation: The API is thoroughly documented using Swagger and can be accessed for reference.
