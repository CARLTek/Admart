from django.contrib import admin
from .models import Proposal, ProposalAttachment


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ['title', 'customer', 'campaign_name', 'ad_type', 'status', 'budget_min', 'budget_max', 'start_date', 'end_date', 'created_at']
    list_filter = ['status', 'ad_type', 'preferred_billboard_type', 'created_at']
    search_fields = ['title', 'description', 'campaign_name', 'customer__username']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Customer', {
            'fields': ('customer',)
        }),
        ('Basic Info', {
            'fields': ('title', 'description', 'campaign_name', 'ad_type', 'ad_content')
        }),
        ('Requirements', {
            'fields': ('preferred_location', 'preferred_billboard_type', 'min_width', 'min_height', 'requires_illumination')
        }),
        ('Duration & Budget', {
            'fields': ('start_date', 'end_date', 'budget_min', 'budget_max')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )


@admin.register(ProposalAttachment)
class ProposalAttachmentAdmin(admin.ModelAdmin):
    list_display = ['proposal', 'attachment_type', 'description', 'created_at']
    list_filter = ['attachment_type']
    search_fields = ['proposal__title', 'description']
