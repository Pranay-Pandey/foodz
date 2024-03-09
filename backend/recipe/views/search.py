from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from django.views.decorators.csrf import csrf_exempt
from foodz.utils import decode_token
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from recipe.models import Recipe
from user.models import User
import shortuuid

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
                'time': openapi.Schema(type=openapi.TYPE_INTEGER),
                'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'procedure': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
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
            procedure = recipe.procedure.all().order_by('order')
            data.append({
                'key': str(shortuuid.uuid()),
                'id': recipe.id,
                'title': recipe.title,
                'description': recipe.description,
                'image': recipe.image,
                'time': recipe.time,
                'ingredients': [ingredient.name for ingredient in ingredients],
                'procedure': [step.step for step in procedure],
                'user': recipe.user.firstName,
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
                'time': openapi.Schema(type=openapi.TYPE_INTEGER),
                'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'procedure': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'user': openapi.Schema(type=openapi.TYPE_STRING),
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
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
        procedure = recipe.procedure.all().order_by('order')
        data.append({
            'key': str(shortuuid.uuid()),
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'image': recipe.image,
            'time': recipe.time,
            'ingredients': [ingredient.name for ingredient in ingredients],
            'procedure': [step.step for step in procedure],
            'user': recipe.user.firstName,
            'user_id': recipe.user.id,
            'favourite': recipe.favourites.filter(user__id=payload['id']).exists()
        })
    return JsonResponse(data, safe=False)

@swagger_auto_schema(
    tags=['Recipe'],
    method='get',
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    responses={200: openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'title': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'image': openapi.Schema(type=openapi.TYPE_STRING),
            'time': openapi.Schema(type=openapi.TYPE_INTEGER),
            'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
            'procedure': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
            'user': openapi.Schema(type=openapi.TYPE_STRING),
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'favourite': openapi.Schema(type=openapi.TYPE_BOOLEAN)
        }
    ), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['GET'])
@csrf_exempt
@require_http_methods(['GET'])
def getRecipeFromId(request, id):
    token = request.headers.get('Authorization')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)
    try:
        payload = decode_token(token)
    except:
        return JsonResponse({"error": "Invalid token"}, status=400)
    try:
        recipe = Recipe.objects.get(id=id)
        ingredients = recipe.ingredients.all()
        procedure = recipe.procedure.all().order_by('order')
        data = {
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'image': recipe.image,
            'time': recipe.time,
            'ingredients': [ingredient.name for ingredient in ingredients],
            'procedure': [step.step for step in procedure],
            'user': recipe.user.firstName,
            'user_id': recipe.user.id,
            'favourite': recipe.favourites.filter(user__id=payload['id']).exists()
        }
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Recipe does not exist"}, status=404)
    return JsonResponse(data, safe=False)
