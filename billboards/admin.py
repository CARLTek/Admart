from django.contrib import admin
from .models import Billboard, BillboardImage


@admin.register(Billboard)
class BillboardAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'city', 'state', 'billboard_type', 'status', 'is_verified', 'created_at']
    list_filter = ['billboard_type', 'status', 'is_verified', 'city', 'state']
    search_fields = ['name', 'description', 'address', 'city']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('owner', 'name', 'description')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'country', 'latitude', 'longitude')
        }),
        ('Specifications', {
            'fields': ('billboard_type', 'width', 'height', 'illumination')
        }),
        ('Pricing', {
            'fields': ('daily_rate', 'weekly_rate', 'monthly_rate')
        }),
        ('Status', {
            'fields': ('status', 'is_verified', 'is_active')
        }),
    )


@admin.register(BillboardImage)
class BillboardImageAdmin(admin.ModelAdmin):
    list_display = ['billboard', 'is_primary', 'created_at']
    list_filter = ['is_primary']
    search_fields = ['billboard__name']
