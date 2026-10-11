from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='HistoryEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(default='anonymous', max_length=128)),
                ('birth_date', models.DateField()),
                ('weekday_ru', models.CharField(max_length=32)),
                ('is_leap_year', models.BooleanField()),
                ('age_years', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={'ordering': ['-id']},
        ),
    ]
