from rest_framework import serializers
from .models import Proposal, ProposalAttachment
from core.serializers import UserSerializer


class ProposalAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProposalAttachment
        fields = ['id', 'attachment_type', 'file', 'file_url', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None


class ProposalListSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    bid_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Proposal
        fields = [
            'id', 'title', 'customer', 'campaign_name', 'ad_type',
            'preferred_location', 'start_date', 'end_date',
            'budget_min', 'budget_max', 'status',
            'bid_count', 'created_at', 'updated_at'
        ]
    
    def get_bid_count(self, obj):
        try:
            return obj.bids.count()
        except AttributeError:
            return 0


class ProposalDetailSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    attachments = ProposalAttachmentSerializer(many=True, read_only=True)
    bid_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Proposal
        fields = [
            'id', 'customer', 'title', 'description',
            'ad_type', 'campaign_name', 'ad_content',
            'preferred_location', 'preferred_billboard_type',
            'min_width', 'min_height', 'requires_illumination',
            'start_date', 'end_date', 'budget_min', 'budget_max',
            'status', 'attachments', 'bid_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer', 'status', 'created_at', 'updated_at']
    
    def get_bid_count(self, obj):
        try:
            return obj.bids.count()
        except AttributeError:
            return 0


class ProposalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = [
            'title', 'description', 'ad_type', 'campaign_name', 'ad_content',
            'preferred_location', 'preferred_billboard_type',
            'min_width', 'min_height', 'requires_illumination',
            'start_date', 'end_date', 'budget_min', 'budget_max'
        ]
    
    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError({'end_date': 'End date must be after start date'})
        if data.get('budget_min') and data.get('budget_max'):
            if data['budget_min'] > data['budget_max']:
                raise serializers.ValidationError({'budget_max': 'Maximum budget must be greater than minimum budget'})
        return data


class ProposalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = [
            'title', 'description', 'ad_type', 'campaign_name', 'ad_content',
            'preferred_location', 'preferred_billboard_type',
            'min_width', 'min_height', 'requires_illumination',
            'start_date', 'end_date', 'budget_min', 'budget_max',
            'status'
        ]
    
    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError({'end_date': 'End date must be after start date'})
        if data.get('budget_min') and data.get('budget_max'):
            if data['budget_min'] > data['budget_max']:
                raise serializers.ValidationError({'budget_max': 'Maximum budget must be greater than minimum budget'})
        return data
