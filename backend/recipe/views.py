from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from foodz.utils import create_token, decode_token
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from recipe.models import Recipe, Ingredient, Favourites
from user.models import User
from uuid import uuid4

@swagger_auto_schema(
    tags=['Recipe'],
    method='get',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'key': openapi.Schema(type=openapi.TYPE_STRING),
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING),
                'time': openapi.Schema(type=openapi.TYPE_STRING),
                'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'user': openapi.Schema(type=openapi.TYPE_STRING),
                'favourite': openapi.Schema(type=openapi.TYPE_BOOLEAN)
            }
        )
    ), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['GET'])
@csrf_exempt
@require_http_methods(['GET'])   
def get_recipe(request):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        recipes = Recipe.objects.all()
        data = []
        for recipe in recipes:
            ingredients = recipe.ingredients.all()
            data.append({
                'key': str(uuid4()),
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image': recipe.image.url if recipe.image else None,
                'time': recipe.time,
                'ingredients': [ingredient.name for ingredient in ingredients],
                'user': recipe.user.firstName,
                'user_id': recipe.user.id,
                'favourite': recipe.favourites.filter(user__id=payload['id']).exists()
            })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=404)
    return JsonResponse(data, safe=False)

@swagger_auto_schema(
    tags=['Recipe'],
    method='post',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'time': openapi.Schema(type=openapi.TYPE_STRING),
            'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
            'image': openapi.Schema(type=openapi.TYPE_FILE)
        },
        required=['title', 'description', 'time', 'ingredients']
    ),
    responses={201: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'message': openapi.Schema(type=openapi.TYPE_STRING)}), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['POST'])
@csrf_exempt
@require_http_methods(['POST'])
def create(request):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
        if payload['role'] != 'user':
            return JsonResponse({"error": "Invalid token"}, status=400)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        data = request.data
        user = User.objects.get(id=payload['id'])
        recipe = Recipe.objects.create(
            title=data['title'],
            description=data['description'],
            time=data['time'],
            user=user,
            image=request.FILES['image'] if 'image' in request.FILES else None
        )
        for ingredient_name in data['ingredients'].split(','):
            ingredient, created = Ingredient.objects.get_or_create(name=ingredient_name)
            recipe.ingredients.add(ingredient)
        recipe.save()
    except KeyError as e:
        return JsonResponse({"error": f"{e} is required"}, status=400)
    except ValidationError as e:
        return JsonResponse({"error": e.message_dict}, status=400)
    
    return JsonResponse({"message": "Recipe created successfully"}, status=201)

@swagger_auto_schema(
    tags=['Recipe'],
    method='post',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING))
        },
        required=['ingredients']
    ),
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'key': openapi.Schema(type=openapi.TYPE_STRING),
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING),
                'time': openapi.Schema(type=openapi.TYPE_STRING),
                'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'user': openapi.Schema(type=openapi.TYPE_STRING),
                'favourite': openapi.Schema(type=openapi.TYPE_BOOLEAN)
            }
        )
    ), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['POST'])
@csrf_exempt
@require_http_methods(['POST'])
def recipe_from_ingredients(request):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        data = json.loads(request.body)
        ingredients = data['ingredients']
    except KeyError:
        return JsonResponse({"error": "Ingredients are required"}, status=400)
    recipes = Recipe.objects.filter(ingredients__name__in=ingredients).distinct()
    data = []
    for recipe in recipes:
        ingredients = recipe.ingredients.all()
        data.append({
            'key': str(uuid4()),
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'image': recipe.image.url if recipe.image else None,
            'time': recipe.time,
            'ingredients': [ingredient.name for ingredient in ingredients],
            'user': recipe.user.firstName,
            'favourite': recipe.favourites.filter(user__id=payload['id']).exists()
        })
    return JsonResponse(data, safe=False)

@swagger_auto_schema(
    tags=['Recipe'],
    method='post',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    responses={200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'message': openapi.Schema(type=openapi.TYPE_STRING)}), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['POST'])
@csrf_exempt
@require_http_methods(['POST'])
def favourite(request, id):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        user = User.objects.get(id=payload['id'])
        recipe = Recipe.objects.get(id=id)
        favourite, created = Favourites.objects.get_or_create(user=user, recipe=recipe)
        if not created:
            favourite.delete()
            message = "Recipe removed from favourites"
        else:
            message = "Recipe added to favourites"
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Recipe does not exist"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=404)
    return JsonResponse({"message": message}, status=200)

@swagger_auto_schema(
    tags=['Recipe'],
    method='get',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'key': openapi.Schema(type=openapi.TYPE_STRING),
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING),
                'time': openapi.Schema(type=openapi.TYPE_STRING),
                'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'user': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )
    ), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['GET'])
@csrf_exempt
@require_http_methods(['GET'])
def get_favourites(request):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        user = User.objects.get(id=payload['id'])
        favourites = user.favourites.all()
        data = []
        for favourite in favourites:
            recipe = favourite.recipe
            ingredients = recipe.ingredients.all()
            data.append({
                'key': str(uuid4()),
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image': recipe.image.url if recipe.image else None,
                'time': recipe.time,
                'ingredients': [ingredient.name for ingredient in ingredients],
                'user': recipe.user.firstName
            })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=404)
    return JsonResponse(data, safe=False)

@swagger_auto_schema(
    tags=['Recipe'],
    method='get',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'key': openapi.Schema(type=openapi.TYPE_STRING),
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING),
                'time': openapi.Schema(type=openapi.TYPE_STRING),
                'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'user': openapi.Schema(type=openapi.TYPE_STRING),
                'favourite': openapi.Schema(type=openapi.TYPE_BOOLEAN)
            }
        )
    ), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['GET'])
@csrf_exempt
@require_http_methods(['GET'])
def myrecipes(request):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        user = User.objects.get(id=payload['id'])
        recipes = user.recipes.all()
        data = []
        for recipe in recipes:
            ingredients = recipe.ingredients.all()
            data.append({
                'key': str(uuid4()),
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image': recipe.image.url if recipe.image else None,
                'time': recipe.time,
                'ingredients': [ingredient.name for ingredient in ingredients],
                'user': recipe.user.firstName,
                'favourite': recipe.favourites.filter(user__id=payload['id']).exists()
            })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=404)
    return JsonResponse(data, safe=False)

@swagger_auto_schema(
    tags=['Recipe'],
    method='get',
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'key': openapi.Schema(type=openapi.TYPE_STRING),
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )
    )
})
@api_view(['GET'])
@csrf_exempt
@require_http_methods(['GET'])
def getIngredients(request):
    ingredients = Ingredient.objects.all().distinct()
    data = []
    for ingredient in ingredients:
        data.append({
            'key': str(uuid4()),
            'id': ingredient.id,
            'name': ingredient.name
        })
    return JsonResponse(data, safe=False)

@swagger_auto_schema(
    tags=['Recipe'],
    method='post',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING)
        }
    ),
    responses={200: openapi.Schema(
        type=openapi.TYPE_ARRAY,
        items=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'key': openapi.Schema(type=openapi.TYPE_STRING),
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_STRING),
                'time': openapi.Schema(type=openapi.TYPE_STRING),
                'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'user': openapi.Schema(type=openapi.TYPE_STRING),
                'favourite': openapi.Schema(type=openapi.TYPE_BOOLEAN)
            }
        )
    ), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['POST'])
@csrf_exempt
@require_http_methods(['POST'])
def searchRecipeName(request):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        data = json.loads(request.body)
        name = data['name']
    except KeyError:
        return JsonResponse({"error": "Name is required"}, status=400)
    recipes = Recipe.objects.filter(title__icontains=name)
    data = []
    for recipe in recipes:
        ingredients = recipe.ingredients.all()
        data.append({
            'key': str(uuid4()),
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'image': recipe.image.url if recipe.image else None,
            'time': recipe.time,
            'ingredients': [ingredient.name for ingredient in ingredients],
            'user': recipe.user.firstName,
            'favourite': recipe.favourites.filter(user__id=payload['id']).exists()
        })
    return JsonResponse(data, safe=False)