from django.db import models

class Recipe(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='static', blank=True)
    time = models.FloatField()
    ingredients = models.ManyToManyField('Ingredient', related_name='recipes')
    user = models.ForeignKey('user.User', related_name='recipes', on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'recipe'

class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'ingredient'

class Favourites(models.Model):
    user = models.ForeignKey('user.User', related_name='favourites', on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, related_name='favourites', on_delete=models.CASCADE)

    class Meta:
        db_table = 'favourites'