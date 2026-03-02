from rest_framework import serializers
from .models import Bid, BidMessage
from core.serializers import UserSerializer
from billboards.serializers import BillboardListSerializer


class BidMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = BidMessage
        fields = ['id', 'sender', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']


class BidListSerializer(serializers.ModelSerializer):
    bidder = UserSerializer(read_only=True)
    billboard = BillboardListSerializer(read_only=True)
    
    class Meta:
        model = Bid
        fields = [
            'id', 'proposal', 'bidder', 'billboard',
            'proposed_price', 'message',
            'proposed_start_date', 'proposed_end_date',
            'includes_design', 'includes_installation',
            'status', 'is_accepted',
            'created_at', 'updated_at'
        ]


class BidDetailSerializer(serializers.ModelSerializer):
    bidder = UserSerializer(read_only=True)
    billboard = BillboardListSerializer(read_only=True)
    messages = BidMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Bid
        fields = [
            'id', 'proposal', 'bidder', 'billboard',
            'proposed_price', 'message',
            'proposed_start_date', 'proposed_end_date',
            'includes_design', 'includes_installation',
            'additional_notes', 'status', 'is_accepted',
            'messages',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'bidder', 'status', 'is_accepted', 'created_at', 'updated_at']


class BidCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = [
            'proposal', 'billboard',
            'proposed_price', 'message',
            'proposed_start_date', 'proposed_end_date',
            'includes_design', 'includes_installation',
            'additional_notes'
        ]
    
    def validate(self, data):
        proposal = data.get('proposal')
        if proposal.status not in ['OPEN', 'IN_REVIEW']:
            raise serializers.ValidationError({'proposal': 'You can only bid on open proposals'})
        
        if data.get('proposed_start_date') and data.get('proposed_end_date'):
            if data['proposed_start_date'] > data['proposed_end_date']:
                raise serializers.ValidationError({'proposed_end_date': 'End date must be after start date'})
            
            if data['proposed_start_date'] < proposal.start_date:
                raise serializers.ValidationError({'proposed_start_date': 'Start date cannot be before proposal start date'})
        
        return data
    
    def create(self, validated_data):
        validated_data['bidder'] = self.context['request'].user
        return super().create(validated_data)


class BidUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = [
            'proposed_price', 'message',
            'proposed_start_date', 'proposed_end_date',
            'includes_design', 'includes_installation',
            'additional_notes'
        ]
    
    def validate(self, data):
        if self.instance.status not in ['PENDING', 'REJECTED']:
            raise serializers.ValidationError('You can only edit pending or rejected bids')
        return data


class BidMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BidMessage
        fields = ['message']
    
    def create(self, validated_data):
        validated_data['bid'] = self.context['bid']
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)
