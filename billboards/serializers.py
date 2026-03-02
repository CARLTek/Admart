from rest_framework import serializers
from .models import Billboard, BillboardImage
from core.serializers import UserSerializer


class BillboardImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BillboardImage
        fields = ['id', 'image', 'image_url', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None


class BillboardListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Billboard
        fields = [
            'id', 'name', 'owner', 'city', 'state', 'country',
            'billboard_type', 'width', 'height', 'illumination',
            'daily_rate', 'weekly_rate', 'monthly_rate',
            'status', 'is_verified', 'primary_image',
            'created_at', 'updated_at'
        ]
    
    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first()
        if img:
            request = self.context.get('request')
            if request and img.image:
                return request.build_absolute_uri(img.image.url)
        return None


class BillboardDetailSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    images = BillboardImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Billboard
        fields = [
            'id', 'owner', 'name', 'description',
            'address', 'city', 'state', 'country',
            'latitude', 'longitude',
            'billboard_type', 'width', 'height', 'illumination',
            'daily_rate', 'weekly_rate', 'monthly_rate',
            'status', 'is_verified', 'is_active',
            'images',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'is_verified', 'created_at', 'updated_at']


class BillboardCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billboard
        fields = [
            'name', 'description',
            'address', 'city', 'state', 'country',
            'latitude', 'longitude',
            'billboard_type', 'width', 'height', 'illumination',
            'daily_rate', 'weekly_rate', 'monthly_rate',
            'status', 'is_active'
        ]
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class BillboardUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billboard
        fields = [
            'name', 'description',
            'address', 'city', 'state', 'country',
            'latitude', 'longitude',
            'billboard_type', 'width', 'height', 'illumination',
            'daily_rate', 'weekly_rate', 'monthly_rate',
            'status', 'is_active'
        ]
