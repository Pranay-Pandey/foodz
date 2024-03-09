from django.urls import path, include
from recipe.views import crud, favourite, search, ingredients

urlpatterns = [
    path('get', crud.get_recipe),
    path('create', crud.create),
    path('recipe_from_ingredients', ingredients.recipe_from_ingredients),
    path('favourite/<int:id>', favourite.favourite),
    path('get_favourites', favourite.get_favourites),
    path('my_recipes', search.myrecipes),
    path('ingredients', ingredients.getIngredients),
    path('search', search.searchRecipeName),
    path('get_recipe_by_id/<int:id>', search.getRecipeFromId),
    path('update/<int:id>', crud.editRecipe),
    path('delete/<int:id>', crud.deleteRecipe),
]