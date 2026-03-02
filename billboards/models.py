from django.db import models
from django.conf import settings


class Billboard(models.Model):
    BILLBOARD_TYPE_CHOICES = [
        ('LED', 'LED Billboard'),
        ('TRADITIONAL', 'Traditional Billboard'),
        ('DIGITAL', 'Digital Billboard'),
        ('VINYL', 'Vinyl Billboard'),
        ('NEON', 'Neon Billboard'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('BOOKED', 'Booked'),
        ('MAINTENANCE', 'Under Maintenance'),
        ('UNAVAILABLE', 'Unavailable'),
    ]
    
    VERIFICATION_STATUS = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='billboards'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='USA')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    billboard_type = models.CharField(max_length=20, choices=BILLBOARD_TYPE_CHOICES, default='TRADITIONAL')
    width = models.DecimalField(max_digits=6, decimal_places=2, help_text="Width in feet")
    height = models.DecimalField(max_digits=6, decimal_places=2, help_text="Height in feet")
    illumination = models.BooleanField(default=False, help_text="Does the billboard have lighting?")
    
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2)
    weekly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    monthly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    is_verified = models.CharField(max_length=20, choices=VERIFICATION_STATUS, default='PENDING')
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Billboards'
    
    def __str__(self):
        return f"{self.name} - {self.city}"


class BillboardImage(models.Model):
    billboard = models.ForeignKey(
        Billboard,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='billboards/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        return f"Image for {self.billboard.name}"
