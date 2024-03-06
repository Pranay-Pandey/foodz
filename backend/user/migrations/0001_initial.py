# Generated by Django 4.2.11 on 2024-03-06 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('firstName', models.CharField(max_length=100)),
                ('lastName', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=200, unique=True)),
                ('password', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'users',
            },
        ),
    ]
