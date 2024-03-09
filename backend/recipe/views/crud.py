from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from foodz.utils import decode_token
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from recipe.models import Recipe, Ingredient, Procedure
from user.models import User
import shortuuid
from django.db import transaction

@swagger_auto_schema(
    tags=['Recipe'],
    method='get',
    operation_description="Get all recipes in the database along with the user who created them and whether the recipe is a favourite of the user or not.",
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
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
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
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=404)
    return JsonResponse(data, safe=False)


@swagger_auto_schema(
    tags=['Recipe'],
    method='post',
    operation_description="Create a recipe. The ingredients should be separated by a comma. The procedure should be separated by a new line. The imageURL is optional.",
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'time': openapi.Schema(type=openapi.TYPE_INTEGER),
            'ingredients': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
            'procedure': openapi.Schema(type=openapi.TYPE_STRING),
            'image': openapi.Schema(type=openapi.TYPE_STRING)
        },
        required=['title', 'description', 'time', 'ingredients', 'procedure']
    ),
    responses={201: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'message': openapi.Schema(type=openapi.TYPE_STRING)}), 
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['POST'])
@csrf_exempt
@require_http_methods(['POST'])
@transaction.atomic
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
            image=data['image']
        )
        ingredients = [Ingredient.objects.get_or_create(name=name.strip().upper())[0] for name in data['ingredients'].split(',')]
        recipe.ingredients.add(*ingredients)
        procedures = [Procedure(step=step, order=i+1, recipe=recipe) for i, step in enumerate(data['procedure'].split('\n')) if step.strip()]
        Procedure.objects.bulk_create(procedures)
    except ValidationError as e:
        return JsonResponse({"error": e.message_dict}, status=400)
    
    return JsonResponse({"message": "Recipe created successfully"}, status=201)

@swagger_auto_schema(
    tags=['Recipe'],
    method='put',
    operation_description="Edit a recipe. The ingredients should be separated by a comma. The procedure should be separated by a new line. The imageURL is optional.",
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'time': openapi.Schema(type=openapi.TYPE_INTEGER),
            'ingredients': openapi.Schema(type=openapi.TYPE_STRING),
            'procedure': openapi.Schema(type=openapi.TYPE_STRING),
            'image': openapi.Schema(type=openapi.TYPE_STRING)
        },
        required=['title', 'description', 'time', 'ingredients', 'procedure', 'image']
    ),
    responses={200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'message': openapi.Schema(type=openapi.TYPE_STRING)}),
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['PUT'])
@csrf_exempt
@require_http_methods(['PUT'])
def editRecipe(request, id):
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
        recipe = Recipe.objects.get(id=id)
        if recipe.user.id != payload['id']:
            return JsonResponse({"error": "You are not authorized to edit this recipe"}, status=400)
        data = request.data
        recipe.title = data['title']
        recipe.description = data['description']
        recipe.time = data['time']
        recipe.image = data['image']
        recipe.save()

        recipe.ingredients.clear()
        for ingredient_name in data['ingredients'].split(','):
            ingredient_name = ingredient_name.strip().upper()
            ingredient, created = Ingredient.objects.get_or_create(name=ingredient_name)
            recipe.ingredients.add(ingredient)
        recipe.procedure.all().delete()
        for i, step in enumerate(data['procedure'].split('\n')):
            Procedure.objects.create(step=step, order=i+1, recipe=recipe)
        recipe.save()
        # Delete ingredients that are not used by any other recipes
        for ingredient in Ingredient.objects.all():
            # If the ingredient is not used by any other recipe
            if not ingredient.recipes.all():
                # Delete the ingredient
                ingredient.delete()
        
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Recipe does not exist"}, status=404)
    except ValidationError as e:
        return JsonResponse({"error": e.message_dict}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"message": "Recipe updated successfully"}, status=200)


@swagger_auto_schema(
    tags=['Recipe'],
    method='delete',
    operation_description="Delete a recipe. The recipe will be deleted along with its ingredients and procedure steps. Ingredients that are not used by any other recipes will also be deleted.",
    manual_parameters=[openapi.Parameter('Authorization', in_=openapi.IN_HEADER, type=openapi.TYPE_STRING, required=True)],
    responses={200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'message': openapi.Schema(type=openapi.TYPE_STRING)}),
    400: openapi.Schema(type=openapi.TYPE_OBJECT, properties={'error': openapi.Schema(type=openapi.TYPE_STRING)})
})
@api_view(['DELETE'])
@csrf_exempt
@require_http_methods(['DELETE'])
@transaction.atomic
def deleteRecipe(request, id):
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
        recipe = Recipe.objects.get(id=id)
        if recipe.user.id != payload['id']:
            return JsonResponse({"error": "You are not authorized to delete this recipe"}, status=400)
        
        # Clear the relationship between the recipe and its ingredients
        recipe.ingredients.clear()

        # Delete the procedure steps
        recipe.procedure.all().delete()

        # Delete ingredients that are not used by any other recipes
        for ingredient in Ingredient.objects.all():
            # If the ingredient is not used by any other recipe
            if not ingredient.recipes.all():
                # Delete the ingredient
                ingredient.delete()
        
        # Delete the recipe
        recipe.delete()
        
    except Recipe.DoesNotExist:
        return JsonResponse({"error": "Recipe does not exist"}, status=404)

    return JsonResponse({"message": "Recipe deleted successfully"}, status=200)
