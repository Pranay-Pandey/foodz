# Foodz Frontend Documentation

## Introduction
Foodz frontend is developed using React with Vite as the bundler. It provides a user-friendly interface for managing recipes, with features such as login, registration, recipe browsing, and creation.

## Installation and Local Development
To set up the frontend locally, follow these steps:

- Clone the repository:

    ```bash
    git clone https://github.com/Pranay-Pandey/foodz
    ```
- Navigate to the frontend directory:

    ```bash
    cd frontend
    ```
- Install dependencies:

    ```bash
    npm install
    ```

- Start the development server:
    
    ```bash
    npm run dev
    ```
- Access the application at http://localhost:3000 in your web browser.

## Tech Stack
- Framework: React
- Bundler: Vite
- UI Library: Mantine
- Additional Dependencies: react-toastify, react-icons, crypto-js

## Overview
The frontend comprises several pages, including:

- Login: Allows users to log in to their accounts.
- Register: Enables users to create new accounts.
- Home: Displays recipe search functionality and favorites.
- RecipeView: Provides detailed views of individual recipes.

### Basic Components

- Navigation Bar
- Features: 
    - Home 
    - Login 
    - Register
    - Logout
    - Theme Selector
- Implementation: Utilizes Mantine UI library for consistent styling and includes theme toggle functionality.

### Form Components

Login: Input fields for email and password with validation checks.


Register: Form for user registration with fields for first name, last name, email, and password.


### Detailed Components

#### Search Section

**Features** : Search textbox and multiselect input for querying recipes.

**Implementation** : Utilizes TextInput and MultiSelect components from Mantine. Handles search queries based on selected ingredients or search terms.


#### Recipe Cards

**Features**: Display recipe details including title, description, image, and ingredients.

**Interaction**: Allows users to mark recipes as favorites or view recipe details.

**Implementation**: Utilizes MyCard component with customizable props for different recipe details.

#### My Recipes Section
**Features**: Allows users to add new recipes and view their created recipes.

**Interaction**: Supports recipe creation and deletion functionality.

**Implementation**: Utilizes RecipeForm component for recipe creation and integrates with backend APIs for data management.

#### Recipe View
**Features**: Displays detailed view of a specific recipe, including title, image, time, description, ingredients, and procedure.

**Interaction**: Allows recipe owners to edit or delete recipes.

**Implementation**: Utilizes Paper component for layout and integrates with backend APIs for data retrieval and manipulation.

### Challenges and Solutions
#### UI Design
**Challenge**: Designing a user interface that balances aesthetics with functionality.

**Solution**: Leveraged Mantine UI library for consistent styling and intuitive user experience across all pages.

#### API Integration
**Challenge**: Integrating frontend components with backend APIs for data retrieval and manipulation.

**Solution**: Utilized fetch API and asynchronous JavaScript techniques to handle HTTP requests and responses effectively.

#### State Management
**Challenge**: Managing state across different components and pages.

**Solution**: Implemented useState and useEffect hooks for local state management and context API for global state management where necessary.

#### Form Validation
**Challenge**: Validating user input in forms to ensure data integrity.

**Solution**: Utilized built-in form validation features of Mantine UI library and custom validation logic where necessary.

#### Responsive Design
**Challenge**: Ensuring the application is responsive and accessible across different devices and screen sizes.

**Solution**: Utilized responsive design principles and CSS media queries to optimize layout and styling for various viewport sizes.



### Conclusion
The Foodz frontend provides a seamless user experience for managing recipes, with intuitive navigation, responsive design, and robust functionality. By leveraging modern web technologies and best practices, the frontend delivers a user-friendly interface that meets the needs of both casual users and recipe enthusiasts.
