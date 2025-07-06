from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Realtor
from .serializers import RealtorSerializer, RealtorListSerializer, RealtorCreateSerializer


class RealtorListAPIView(generics.ListAPIView):
    """
    List all realtors
    """
    queryset = Realtor.objects.all().order_by('-hire_date')
    serializer_class = RealtorListSerializer


class RealtorDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve a specific realtor by ID
    """
    queryset = Realtor.objects.all()
    serializer_class = RealtorSerializer
    lookup_field = 'id'


class RealtorCreateAPIView(generics.CreateAPIView):
    """
    Create a new realtor (authenticated users only)
    """
    queryset = Realtor.objects.all()
    serializer_class = RealtorCreateSerializer
    permission_classes = [IsAuthenticated]


class RealtorUpdateAPIView(generics.UpdateAPIView):
    """
    Update an existing realtor (authenticated users only)
    """
    queryset = Realtor.objects.all()
    serializer_class = RealtorCreateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


class RealtorDeleteAPIView(generics.DestroyAPIView):
    """
    Delete a realtor (authenticated users only)
    """
    queryset = Realtor.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


@api_view(['GET'])
def mvp_realtors(request):
    """
    Get MVP realtors
    """
    try:
        mvp_realtors = Realtor.objects.filter(is_mvp=True).order_by('-hire_date')
        serializer = RealtorListSerializer(mvp_realtors, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch MVP realtors'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Legacy Django views for backwards compatibility
from django.shortcuts import render

def index(request):
    """Legacy Django view - kept for backwards compatibility"""
    realtors = Realtor.objects.order_by('-hire_date')
    mvp_realtors = Realtor.objects.filter(is_mvp=True)

    context = {
        'realtors': realtors,
        'mvp_realtors': mvp_realtors
    }

    return render(request, 'realtors/realtors.html', context)
