from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Billboard, BillboardImage
from .serializers import (
    BillboardListSerializer,
    BillboardDetailSerializer,
    BillboardCreateSerializer,
    BillboardUpdateSerializer,
    BillboardImageSerializer
)


class BillboardViewSet(viewsets.ModelViewSet):
    queryset = Billboard.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'state', 'billboard_type', 'status', 'is_verified']
    search_fields = ['name', 'description', 'address', 'city', 'state']
    ordering_fields = ['created_at', 'daily_rate', 'name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BillboardListSerializer
        elif self.action == 'create':
            return BillboardCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BillboardUpdateSerializer
        return BillboardDetailSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        if self.action == 'list':
            queryset = queryset.filter(is_verified='APPROVED')
        
        if not self.request.user.is_authenticated:
            return queryset.filter(is_verified='APPROVED')
        
        if self.request.user.user_type == 'BILLBOARD_OWNER':
            return queryset
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def images(self, request, pk=None):
        billboard = self.get_object()
        
        if request.method == 'GET':
            images = billboard.images.all()
            serializer = BillboardImageSerializer(images, many=True, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            if billboard.owner != request.user:
                return Response(
                    {'error': 'You can only add images to your own billboards'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = BillboardImageSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(billboard=billboard)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated])
    def delete_image(self, request, pk=None):
        image_id = request.query_params.get('image_id')
        if not image_id:
            return Response({'error': 'Image ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image = BillboardImage.objects.get(id=image_id, billboard_id=pk)
        except BillboardImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if image.billboard.owner != request.user:
            return Response(
                {'error': 'You can only delete images from your own billboards'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_billboards(self, request):
        billboards = Billboard.objects.filter(owner=request.user)
        serializer = BillboardListSerializer(billboards, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def verify(self, request, pk=None):
        if request.user.user_type != 'ADMIN':
            return Response(
                {'error': 'Only admins can verify billboards'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        billboard = self.get_object()
        action = request.data.get('action')
        
        if action not in ['approve', 'reject']:
            return Response(
                {'error': 'Invalid action. Use "approve" or "reject"'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        billboard.is_verified = 'APPROVED' if action == 'approve' else 'REJECTED'
        billboard.save()
        
        serializer = BillboardDetailSerializer(billboard, context={'request': request})
        return Response(serializer.data)
