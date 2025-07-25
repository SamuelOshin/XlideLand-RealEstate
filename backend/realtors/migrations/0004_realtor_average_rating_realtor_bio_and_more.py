# Generated by Django 4.2.23 on 2025-06-23 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("realtors", "0003_alter_realtor_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="realtor",
            name="average_rating",
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=3),
        ),
        migrations.AddField(
            model_name="realtor",
            name="bio",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="realtor",
            name="facebook_url",
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name="realtor",
            name="instagram_url",
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name="realtor",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="realtor",
            name="languages",
            field=models.CharField(default="English", max_length=200),
        ),
        migrations.AddField(
            model_name="realtor",
            name="license_number",
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name="realtor",
            name="linkedin_url",
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name="realtor",
            name="specializations",
            field=models.TextField(
                blank=True, help_text="Comma-separated specializations"
            ),
        ),
        migrations.AddField(
            model_name="realtor",
            name="title",
            field=models.CharField(default="Real Estate Agent", max_length=100),
        ),
        migrations.AddField(
            model_name="realtor",
            name="total_reviews",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="realtor",
            name="total_sales_count",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="realtor",
            name="total_sales_volume",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name="realtor",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="realtor",
            name="website",
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name="realtor",
            name="years_experience",
            field=models.IntegerField(default=0),
        ),
    ]
