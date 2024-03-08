# Generated by Django 4.2.11 on 2024-03-08 16:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0002_alter_recipe_image_favourites'),
    ]

    operations = [
        migrations.CreateModel(
            name='Procedure',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('step', models.TextField()),
                ('order', models.IntegerField()),
                ('recipe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='procedure', to='recipe.recipe')),
            ],
            options={
                'db_table': 'procedure',
            },
        ),
    ]
