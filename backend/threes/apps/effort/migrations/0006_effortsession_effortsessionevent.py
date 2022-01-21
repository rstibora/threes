# Generated by Django 3.2.3 on 2021-12-16 06:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0003_alter_task_id'),
        ('effort', '0005_effort_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='EffortSession',
            fields=[
                ('task', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='tasks.task')),
                ('description', models.CharField(blank=True, default='', max_length=512)),
                ('last_active', models.DateTimeField()),
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('owner', 'task')},
            },
        ),
        migrations.CreateModel(
            name='EffortSessionEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event', models.CharField(choices=[('S', 'Start'), ('P', 'Pause')], max_length=1)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events_set', to='effort.effortsession')),
            ],
        ),
    ]