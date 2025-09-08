from django.contrib import admin

from .models import Contact, NotificationQueue

class ContactAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'listing', 'email', 'contact_date')
  list_display_links = ('id', 'name')
  search_fields = ('name', 'email', 'listing')
  list_per_page = 25


class NotificationQueueAdmin(admin.ModelAdmin):
  list_display = ('id', 'task_type', 'status', 'created_at', 'processed_at', 'retry_count')
  list_display_links = ('id', 'task_type')
  list_filter = ('task_type', 'status', 'created_at')
  search_fields = ('contact_data', 'error_message')
  readonly_fields = ('created_at', 'processed_at')
  list_per_page = 25
  
  def get_queryset(self, request):
    return super().get_queryset(request).order_by('-created_at')


admin.site.register(Contact, ContactAdmin)
admin.site.register(NotificationQueue, NotificationQueueAdmin)
