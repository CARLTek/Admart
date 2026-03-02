from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Proposal, ProposalAttachment
from .serializers import (
    ProposalListSerializer,
    ProposalDetailSerializer,
    ProposalCreateSerializer,
    ProposalUpdateSerializer,
    ProposalAttachmentSerializer
)


class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'ad_type', 'preferred_billboard_type']
    search_fields = ['title', 'description', 'campaign_name', 'preferred_location']
    ordering_fields = ['created_at', 'start_date', 'end_date', 'budget_min', 'budget_max']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProposalListSerializer
        elif self.action == 'create':
            return ProposalCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProposalUpdateSerializer
        return ProposalDetailSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.filter(status__in=['OPEN', 'ACCEPTED'])
        
        if self.request.user.user_type == 'CUSTOMER':
            return queryset.filter(customer=self.request.user)
        elif self.request.user.user_type == 'BILLBOARD_OWNER':
            return queryset.filter(status__in=['OPEN', 'IN_REVIEW'])
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
    
    def perform_update(self, serializer):
        proposal = self.get_object()
        if proposal.customer != self.request.user:
            raise PermissionError("You can only edit your own proposals")
        serializer.save()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        proposal = self.get_object()
        
        if proposal.customer != request.user:
            return Response(
                {'error': 'You can only submit your own proposals'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if proposal.status != 'DRAFT':
            return Response(
                {'error': 'Only draft proposals can be submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        proposal.status = 'OPEN'
        proposal.save()
        
        serializer = ProposalDetailSerializer(proposal, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        proposal = self.get_object()
        
        if proposal.customer != request.user:
            return Response(
                {'error': 'You can only cancel your own proposals'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if proposal.status not in ['DRAFT', 'OPEN']:
            return Response(
                {'error': 'Only draft or open proposals can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        proposal.status = 'CANCELLED'
        proposal.save()
        
        serializer = ProposalDetailSerializer(proposal, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_proposals(self, request):
        proposals = Proposal.objects.filter(customer=request.user)
        serializer = ProposalListSerializer(proposals, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get', 'post', 'delete'], permission_classes=[IsAuthenticated])
    def attachments(self, request, pk=None):
        proposal = self.get_object()
        
        if proposal.customer != request.user:
            return Response(
                {'error': 'You can only manage attachments for your own proposals'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.method == 'GET':
            attachments = proposal.attachments.all()
            serializer = ProposalAttachmentSerializer(attachments, many=True, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = ProposalAttachmentSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(proposal=proposal)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            attachment_id = request.query_params.get('attachment_id')
            if not attachment_id:
                return Response({'error': 'Attachment ID required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                attachment = ProposalAttachment.objects.get(id=attachment_id, proposal=proposal)
            except ProposalAttachment.DoesNotExist:
                return Response({'error': 'Attachment not found'}, status=status.HTTP_404_NOT_FOUND)
            
            attachment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def bids(self, request, pk=None):
        proposal = self.get_object()
        from bidding.serializers import BidListSerializer
        from bidding.models import Bid
        
        bids = proposal.bids.all()
        serializer = BidListSerializer(bids, many=True, context={'request': request})
        return Response(serializer.data)
