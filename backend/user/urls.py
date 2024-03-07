from user import views
from django.urls import path, include

urlpatterns = [
    path('register', views.register),
    path('login', views.login),
    path('get_user', views.get_user),
]