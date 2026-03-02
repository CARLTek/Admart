from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Bid, BidMessage
from .serializers import (
    BidListSerializer,
    BidDetailSerializer,
    BidCreateSerializer,
    BidUpdateSerializer,
    BidMessageSerializer,
    BidMessageCreateSerializer
)


class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'proposal']
    search_fields = ['message', 'additional_notes']
    ordering_fields = ['created_at', 'proposed_price']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BidListSerializer
        elif self.action == 'create':
            return BidCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BidUpdateSerializer
        return BidDetailSerializer
    
    def get_permissions(self):
        if self.action in ['list']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        if not self.request.user.is_authenticated:
            return queryset.none()
        
        if self.request.user.user_type == 'CUSTOMER':
            return queryset.filter(proposal__customer=self.request.user)
        elif self.request.user.user_type == 'BILLBOARD_OWNER':
            return queryset.filter(bidder=self.request.user)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(bidder=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def accept(self, request, pk=None):
        bid = self.get_object()
        proposal = bid.proposal
        
        if proposal.customer != request.user:
            return Response(
                {'error': 'Only the proposal owner can accept bids'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if proposal.status not in ['OPEN', 'IN_REVIEW']:
            return Response(
                {'error': 'Proposal is not accepting bids'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if bid.status != 'PENDING':
            return Response(
                {'error': 'Only pending bids can be accepted'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        bid.status = 'ACCEPTED'
        bid.is_accepted = True
        bid.save()
        
        proposal.status = 'ACCEPTED'
        proposal.save()
        
        Bid.objects.filter(proposal=proposal).exclude(id=bid.id).update(status='REJECTED')
        
        serializer = BidDetailSerializer(bid, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        bid = self.get_object()
        proposal = bid.proposal
        
        if proposal.customer != request.user:
            return Response(
                {'error': 'Only the proposal owner can reject bids'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if bid.status != 'PENDING':
            return Response(
                {'error': 'Only pending bids can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        bid.status = 'REJECTED'
        bid.save()
        
        serializer = BidDetailSerializer(bid, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def withdraw(self, request, pk=None):
        bid = self.get_object()
        
        if bid.bidder != request.user:
            return Response(
                {'error': 'Only the bidder can withdraw their bid'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if bid.status not in ['PENDING', 'REJECTED']:
            return Response(
                {'error': 'You can only withdraw pending or rejected bids'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        bid.status = 'WITHDRAWN'
        bid.save()
        
        serializer = BidDetailSerializer(bid, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_bids(self, request):
        bids = Bid.objects.filter(bidder=request.user)
        serializer = BidListSerializer(bids, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def received_bids(self, request):
        if request.user.user_type != 'CUSTOMER':
            return Response(
                {'error': 'Only customers can view received bids'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        from proposals.models import Proposal
        proposals = Proposal.objects.filter(customer=request.user)
        bids = Bid.objects.filter(proposal__in=proposals)
        serializer = BidListSerializer(bids, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def messages(self, request, pk=None):
        bid = self.get_object()
        
        if request.user != bid.bidder and request.user != bid.proposal.customer:
            return Response(
                {'error': 'Only the bidder or proposal owner can view/add messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.method == 'GET':
            messages = bid.messages.all()
            serializer = BidMessageSerializer(messages, many=True, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = BidMessageCreateSerializer(
                data=request.data,
                context={'bid': bid, 'request': request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_read(self, request, pk=None):
        bid = self.get_object()
        
        if request.user != bid.bidder and request.user != bid.proposal.customer:
            return Response(
                {'error': 'Only the bidder or proposal owner can mark messages as read'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        bid.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        
        return Response({'message': 'Messages marked as read'})
