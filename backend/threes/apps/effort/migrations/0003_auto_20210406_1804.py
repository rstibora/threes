# Generated by Django 3.2 on 2021-04-06 18:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('effort', '0002_auto_20210404_1117'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='effort',
            name='review_period',
        ),
        migrations.AlterField(
            model_name='effort',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
