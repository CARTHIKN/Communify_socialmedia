# Generated by Django 4.2.4 on 2024-04-05 06:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('verification', '0003_alter_customuser_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='phone',
            field=models.BigIntegerField(null=True),
        ),
    ]
