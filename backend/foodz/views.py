from django.shortcuts import HttpResponse

def doctor(request):
    return HttpResponse("Welcome to Foodz API!")