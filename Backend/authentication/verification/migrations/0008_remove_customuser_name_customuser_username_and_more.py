# Generated by Django 4.2.4 on 2024-04-06 05:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('verification', '0007_customuser_otp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='name',
        ),
        migrations.AddField(
            model_name='customuser',
            name='username',
            field=models.CharField(default='none', max_length=150, unique=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='email',
            field=models.EmailField(max_length=254),
        ),
    ]
