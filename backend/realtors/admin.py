from django.contrib import admin
from .models import Realtor

class RealtorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'title', 'email', 'years_experience', 
                   'average_rating', 'total_reviews', 'is_mvp', 'is_active')
    list_display_links = ('id', 'name')
    list_filter = ('is_mvp', 'is_active', 'years_experience')
    search_fields = ('name', 'email', 'title', 'specializations')
    list_per_page = 25
    list_editable = ('is_mvp', 'is_active')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'title', 'email', 'phone', 'photo')
        }),
        ('Professional Details', {
            'fields': ('license_number', 'years_experience', 'specializations', 
                      'total_sales_count', 'total_sales_volume', 'languages')
        }),
        ('Biography', {
            'fields': ('description', 'bio')
        }),
        ('Social Media', {
            'fields': ('website', 'linkedin_url', 'facebook_url', 'instagram_url')
        }),
        ('Ratings & Reviews', {
            'fields': ('average_rating', 'total_reviews'),
            'classes': ('collapse',)
        }),
        ('System', {
            'fields': ('is_mvp', 'is_active', 'hire_date', 'user'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('average_rating', 'total_reviews', 'updated_at')

admin.site.register(Realtor, RealtorAdmin)