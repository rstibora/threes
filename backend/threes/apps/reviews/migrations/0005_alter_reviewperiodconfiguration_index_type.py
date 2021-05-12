# Generated by Django 3.2 on 2021-05-12 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0004_alter_reviewperiodconfiguration_index_reset_duration'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reviewperiodconfiguration',
            name='index_type',
            field=models.CharField(choices=[('WN', 'Week Number'), ('FN', 'Fortnight Number'), ('MN', 'Month Name'), ('QN', 'Quarter Number'), ('YN', 'Year Number'), ('IN', 'Integer Index')], max_length=2),
        ),
    ]
