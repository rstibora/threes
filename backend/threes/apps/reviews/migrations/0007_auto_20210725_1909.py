# Generated by Django 3.2.3 on 2021-07-25 19:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_alter_task_id'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('reviews', '0006_reviewperiodconfiguration_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='ReviewConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name='UserReviewConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=False)),
                ('configuration', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reviews.reviewconfiguration')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'configuration')},
            },
        ),
        migrations.RemoveField(
            model_name='reviewperiodconfiguration',
            name='owner',
        ),
        migrations.DeleteModel(
            name='ReviewPeriod',
        ),
        migrations.DeleteModel(
            name='ReviewPeriodConfiguration',
        ),
        migrations.AddField(
            model_name='review',
            name='configuration',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reviews.reviewconfiguration'),
        ),
        migrations.AddField(
            model_name='review',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='review',
            name='planned_tasks',
            field=models.ManyToManyField(blank=True, related_name='review_periods', to='tasks.Task'),
        ),
        migrations.AlterUniqueTogether(
            name='review',
            unique_together={('owner', 'configuration', 'index')},
        ),
    ]