from django.db import models

class User(models.Model):
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    email = models.EmailField(max_length=200, unique=True )
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "users"