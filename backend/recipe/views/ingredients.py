from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from django.views.decorators.csrf import csrf_exempt
from foodz.utils import  decode_token
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from recipe.models import Recipe, Ingredient
import shortuuid

@swagger_auto_schema(
    tags=['Recipe'],
    method='post',
    operation_description="Get all the recipes that have at least one of the provided ingredients. If no ingredients are provided, all recipes will be returned.",
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
    if len(ingredients) == 0:
        # Return all recipes if no ingredients are provided
        recipes = Recipe.objects.all()
    else:
        recipes = Recipe.objects.filter(ingredients__name__in=ingredients).distinct()
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
    return JsonResponse(data, safe=False)

@swagger_auto_schema(
    tags=['Recipe'],
    method='get',
    operation_description="Get all the ingredients in the database",
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
            'key': str(shortuuid.uuid()),
            'id': ingredient.id,
            'name': ingredient.name
        })
    return JsonResponse(data, safe=False)
