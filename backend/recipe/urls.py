from django.urls import path, include
from recipe import views

urlpatterns = [
    path('get', views.get_recipe),
    path('create', views.create),
    path('recipe_from_ingredients', views.recipe_from_ingredients),
    path('favourite/<int:id>', views.favourite),
    path('get_favourites', views.get_favourites),
    path('my_recipes', views.myrecipes),
    path('ingredients', views.getIngredients),
    path('search', views.searchRecipeName),
]