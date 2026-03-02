from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import UserManager


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Can be extended with additional fields for user types.
    """
    objects = UserManager()
    
    USER_TYPE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('BILLBOARD_OWNER', 'Billboard Owner'),
        ('ADMIN', 'Admin'),
    ]
    
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='CUSTOMER'
    )
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.email if self.email else self.username
