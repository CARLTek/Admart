from django.contrib import admin
from .models import Bid, BidMessage


@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ['id', 'proposal', 'bidder', 'billboard', 'proposed_price', 'status', 'is_accepted', 'created_at']
    list_filter = ['status', 'is_accepted', 'includes_design', 'includes_installation']
    search_fields = ['proposal__title', 'bidder__username', 'message']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Bid Info', {
            'fields': ('proposal', 'bidder', 'billboard')
        }),
        ('Proposal', {
            'fields': ('proposed_price', 'message')
        }),
        ('Duration', {
            'fields': ('proposed_start_date', 'proposed_end_date')
        }),
        ('Terms', {
            'fields': ('includes_design', 'includes_installation', 'additional_notes')
        }),
        ('Status', {
            'fields': ('status', 'is_accepted')
        }),
    )


@admin.register(BidMessage)
class BidMessageAdmin(admin.ModelAdmin):
    list_display = ['bid', 'sender', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['bid__proposal__title', 'sender__username', 'message']
    readonly_fields = ['created_at']
