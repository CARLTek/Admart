from django.db import models
from django.conf import settings


class Proposal(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('OPEN', 'Open for Bids'),
        ('IN_REVIEW', 'In Review'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    AD_TYPE_CHOICES = [
        ('PRODUCT', 'Product Launch'),
        ('BRAND', 'Brand Awareness'),
        ('EVENT', 'Event Promotion'),
        ('SERVICE', 'Service Promotion'),
        ('SEASONAL', 'Seasonal Campaign'),
        ('OTHER', 'Other'),
    ]
    
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='proposals'
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Campaign details
    ad_type = models.CharField(max_length=20, choices=AD_TYPE_CHOICES, default='BRAND')
    campaign_name = models.CharField(max_length=200)
    ad_content = models.TextField(help_text="The actual ad content/message to display")
    
    # Requirements
    preferred_location = models.TextField(blank=True, help_text="Preferred city/area")
    preferred_billboard_type = models.CharField(
        max_length=20,
        choices=[
            ('ANY', 'Any Type'),
            ('LED', 'LED Billboard'),
            ('TRADITIONAL', 'Traditional Billboard'),
            ('DIGITAL', 'Digital Billboard'),
        ],
        default='ANY'
    )
    min_width = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Minimum width in feet")
    min_height = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Minimum height in feet")
    requires_illumination = models.BooleanField(default=False)
    
    # Duration & Budget
    start_date = models.DateField()
    end_date = models.DateField()
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, help_text="Minimum budget")
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, help_text="Maximum budget")
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.customer.username}"


class ProposalAttachment(models.Model):
    ATTACHMENT_TYPE_CHOICES = [
        ('IMAGE', 'Image'),
        ('DESIGN', 'Ad Design'),
        ('REFERENCE', 'Reference Material'),
        ('OTHER', 'Other'),
    ]
    
    proposal = models.ForeignKey(
        Proposal,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    attachment_type = models.CharField(max_length=20, choices=ATTACHMENT_TYPE_CHOICES, default='REFERENCE')
    file = models.FileField(upload_to='proposals/attachments/')
    description = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.attachment_type} - {self.proposal.title}"
