# Foodz Backend Documentation

## Introduction
Foodz backend is developed using Django, chosen for its high-level functionalities, structure, and built-in ORM. It consists of two apps: User and Recipe, handling user authentication and recipe management, respectively.

## Setup
To set up the backend locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Pranay-Pandey/foodz.git
    ```

2. Navigate to the backend directory:
    ```bash
    cd backend
    ```

3. Create and activate a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

4. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5. Create a `.env` file in the root directory and add the following environment variables:
    ```
    SECRET_KEY = 
    DB_ENGINE = 
    DB_NAME = 
    DB_USER = 
    DB_PASSWORD = 
    DB_HOST = 
    DB_PORT = 
    ENV = dev/prod
    DJANGO_SECRET_KEY = 
    BACKEND_PASSWORD_SECRET_KEY = 
    BACKEND_ENCRYPTION_KEY = 
    BACKEND_ENCRYPTION_IV =
    ```

6. Apply database migrations:
    ```bash
    python manage.py migrate
    ```

7. Run the development server:
    ```bash
    python manage.py runserver
    ```

## Apps
### User App
- Manages user authentication with login and register endpoints.
- Utilizes the Crypto library to decrypt encrypted passwords sent by the frontend.

### Recipe App
- Handles all functionalities related to recipes.
- Comprises four interconnected models: Recipe, Ingredient, Procedure, and Favourite.

## Models
### Recipe Model
- Contains information about recipes, including the recipe image URL and user who created it.
- Initially used an ImageField for the recipe image but switched to an image URL for better deployment compatibility.
- Establishes a many-to-many relationship with the Ingredient table.

#### Fields
- `title`: Title of the recipe (string).
- `description`: Description of the recipe (string).
- `image`: URL of the recipe image (string).
- `time`: Preparation time in minutes (integer).
- `ingredients`: Ingredients required for the recipe (many-to-many relationship with Ingredient).
- `procedure`: Procedure steps for preparing the recipe (one-to-many relationship with Procedure).
- `user`: User who created the recipe (foreign key to the User model).

### Ingredient Model
- Stores ingredients and their association with multiple recipes.
- Checked for dangling ingredients whenever a recipe is updated.

#### Fields
- `name`: Name of the ingredient (string).

### Procedure Model
- Manages procedure steps with descriptions and order, linked to a specific recipe.
- Modeled separately to maintain a hierarchy in the procedure steps.

#### Fields
- `step_description`: Description of the procedure step (string).
- `order`: Order of the step in the recipe (integer).
- `recipe`: Recipe to which the step belongs (foreign key to the Recipe model).

### Favourite Model
- Tracks user-favorited recipes.

#### Fields
- `user`: User who favorited the recipe (foreign key to the User model).
- `recipe`: Recipe that was favorited (foreign key to the Recipe model).

## Endpoints
Endpoint documentation is available on Swagger and can be accessed at [Your API (foodz.onrender.com)](https://foodz.onrender.com/swagger).

## Challenges and Solutions
- **UI**: Opted for a minimal and straightforward design due to the lack of specific UI style requirements.
- **Recipe Model**: Switched from using ImageField to image URL for better deployment and storage management.
- **Procedure Model**: Modeled as a separate table to maintain a hierarchy in procedure steps.
- **Encryption**: Used the same encryption keys for encrypting and decrypting passwords for security.
- **Backend Optimization**: Divided the Home view into four independent sections to minimize API requests.
- **Deployment Challenges**: Addressed issues with API request timeouts on Vercel by optimizing endpoints and introducing bulk transactions.


## Endpoints

### /recipe/create
- **POST**: Create a recipe.
    - Parameters:
        - data (body): JSON object containing recipe data.
        - Authorization (header): User authentication token.
    - Responses:
        - 201: Recipe created successfully.
        - 400: Error in request body.
        
### /recipe/delete/{id}
- **DELETE**: Delete a recipe by ID.
    - Parameters:
        - id (path): ID of the recipe to delete.
        - Authorization (header): User authentication token.
    - Responses:
        - 200: Recipe deleted successfully.
        - 400: Error in request body.

### /recipe/favourite/{id}
- **POST**: Add or remove a recipe from favorites.
    - Parameters:
        - id (path): ID of the recipe to add/remove from favorites.
        - Authorization (header): User authentication token.
    - Responses:
        - 200: Recipe added/removed from favorites successfully.
        - 400: Error in request body.

### /recipe/get
- **GET**: Get all recipes.
    - Parameters:
        - Authorization (header): User authentication token.
    - Responses:
        - 200: List of recipes fetched successfully.
        - 400: Error in request body.

### /recipe/get_favourites
- **GET**: Get all favorite recipes of the user.
    - Parameters:
        - Authorization (header): User authentication token.
    - Responses:
        - 200: List of favorite recipes fetched successfully.
        - 400: Error in request body.

### /recipe/get_recipe_by_id/{id}
- **GET**: Get a recipe by ID.
    - Parameters:
        - id (path): ID of the recipe to fetch.
        - Authorization (header): User authentication token.
    - Responses:
        - 200: Recipe fetched successfully.
        - 400: Error in request body.

### /recipe/ingredients
- **GET**: Get all ingredients.
    - Parameters: None
    - Responses:
        - 200: List of ingredients fetched successfully.

### /recipe/my_recipes
- **GET**: Get all recipes created by the user.
    - Parameters:
        - Authorization (header): User authentication token.
    - Responses:
        - 200: List of user's recipes fetched successfully.
        - 400: Error in request body.

### /recipe/recipe_from_ingredients
- **POST**: Get recipes containing specified ingredients.
    - Parameters:
        - data (body): JSON object containing ingredients.
        - Authorization (header): User authentication token.
    - Responses:
        - 200: List of recipes fetched successfully.
        - 400: Error in request body.

### /recipe/search
- **POST**: Search recipes by name.
    - Parameters:
        - data (body): JSON object containing recipe name.
        - Authorization (header): User authentication token.
    - Responses:
        - 200: List of matching recipes fetched successfully.
        - 400: Error in request body.

### /recipe/update/{id}
- **PUT**: Update a recipe by ID.
    - Parameters:
        - id (path): ID of the recipe to update.
        - data (body): JSON object containing updated recipe data.
        - Authorization (header): User authentication token.
    - Responses:
        - 200: Recipe updated successfully.
        - 400: Error in request body.

### /user/login
- **POST**: Login a user.
    - Parameters:
        - data (body): JSON object containing user credentials.
    - Responses:
        - 201: User logged in successfully.
        - 400: Error in request body.
        - 404: User not found.
        
### /user/register
- **POST**: Register a new user.
    - Parameters:
        - data (body): JSON object containing user details.
    - Responses:
        - 201: User registered successfully.
        - 400: Error in request body.
        - 409: User already exists.
