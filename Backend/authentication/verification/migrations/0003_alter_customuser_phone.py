# Generated by Django 4.2.4 on 2024-04-05 04:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('verification', '0002_alter_customuser_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='phone',
            field=models.IntegerField(null=True),
        ),
    ]
