# Generated by Django 3.1.7 on 2021-04-04 11:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tasks', '0002_auto_20210330_1449'),
        ('reviews', '0001_initial'),
        ('effort', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='effort',
            name='review_period',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='effort_set', to='reviews.reviewperiod'),
        ),
        migrations.AddField(
            model_name='effort',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='effort_set', to='tasks.task'),
        ),
        migrations.AddIndex(
            model_name='effort',
            index=models.Index(fields=['-ended'], name='effort_effo_ended_2d810a_idx'),
        ),
    ]