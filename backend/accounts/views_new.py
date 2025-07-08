from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer, 
    UserUpdateSerializer,
    CustomTokenObtainPairSerializer,
    PasswordChangeSerializer,
    FileUploadSerializer
)
from .models import FileUpload, FileUploadSession, UserProfile


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view with additional user data
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationAPIView(generics.CreateAPIView):
    """
    Register a new user
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            },
            status=status.HTTP_201_CREATED
        )


class UserProfileAPIView(generics.RetrieveAPIView):
    """
    Get current user profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserUpdateAPIView(generics.UpdateAPIView):
    """
    Update current user profile
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user password
    """
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)  # Important for session-based auth
        return Response({'message': 'Password changed successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    """
    Get user dashboard data
    """
    user = request.user
    # You can add more user-specific data here
    data = {
        'user': UserSerializer(user).data,
        'listings_count': 0,  # Add actual count if user can create listings
        'favorites_count': 0,  # Add favorites count when implemented
    }
    return Response(data)


# File Upload API Endpoints

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def store_file_metadata(request):
    """
    Store file metadata after successful Vercel Blob upload
    """
    try:
        data = request.data
        
        # Create file upload record
        file_upload = FileUpload.objects.create(
            user=request.user,
            file_name=data.get('file_name'),
            original_name=data.get('original_name'),
            file_type=data.get('file_type'),
            mime_type=data.get('mime_type'),
            file_size=int(data.get('file_size', 0)),
            blob_url=data.get('blob_url'),
            blob_key=data.get('blob_key'),
            category=data.get('category', ''),
            property_id=data.get('property_id', ''),
            listing_id=data.get('listing_id') if data.get('listing_id') else None,
        )
        
        # Update user profile avatar if this is an avatar upload
        if data.get('file_type') == 'avatar':
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            profile.avatar = data.get('blob_url')
            profile.save()
        
        serializer = FileUploadSerializer(file_upload)
        return Response({
            'success': True,
            'file': serializer.data,
            'message': 'File metadata stored successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_files(request):
    """
    Get user's uploaded files with optional filtering
    """
    file_type = request.GET.get('file_type')
    category = request.GET.get('category')
    listing_id = request.GET.get('listing_id')
    
    files = FileUpload.objects.filter(
        user=request.user,
        upload_status='completed'
    ).exclude(upload_status='deleted')
    
    if file_type:
        files = files.filter(file_type=file_type)
    if category:
        files = files.filter(category=category)
    if listing_id:
        files = files.filter(listing_id=listing_id)
    
    serializer = FileUploadSerializer(files, many=True)
    return Response({
        'success': True,
        'files': serializer.data,
        'count': files.count()
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file_metadata(request, file_id):
    """
    Delete file metadata (soft delete)
    """
    try:
        file_upload = FileUpload.objects.get(
            id=file_id,
            user=request.user
        )
        file_upload.soft_delete()
        
        return Response({
            'success': True,
            'message': 'File deleted successfully'
        })
        
    except FileUpload.DoesNotExist:
        return Response({
            'success': False,
            'error': 'File not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_upload_session(request):
    """
    Create a file upload session for bulk operations
    """
    try:
        data = request.data
        
        session = FileUploadSession.objects.create(
            user=request.user,
            session_name=data.get('session_name', ''),
            upload_type=data.get('upload_type'),
            total_files=int(data.get('total_files', 0)),
            property_id=data.get('property_id', ''),
            listing_id=data.get('listing_id') if data.get('listing_id') else None,
        )
        
        return Response({
            'success': True,
            'session_id': str(session.id),
            'message': 'Upload session created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_upload_session(request, session_id):
    """
    Get upload session details
    """
    try:
        session = FileUploadSession.objects.get(
            id=session_id,
            user=request.user
        )
        
        return Response({
            'success': True,
            'session': {
                'id': str(session.id),
                'session_name': session.session_name,
                'upload_type': session.upload_type,
                'total_files': session.total_files,
                'uploaded_files': session.uploaded_files,
                'failed_files': session.failed_files,
                'session_status': session.session_status,
                'property_id': session.property_id,
                'created_at': session.created_at,
                'updated_at': session.updated_at,
            }
        })
        
    except FileUploadSession.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Upload session not found'
        }, status=status.HTTP_404_NOT_FOUND)


# Legacy Django views for backwards compatibility
from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth.models import User

def register(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        # Get form values
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        # Check if passwords match
        if password == password2:
            # Check username
            if User.objects.filter(username=username).exists():
                messages.error(request, 'That username is taken')
                return redirect('register')
            else:
                if User.objects.filter(email=email).exists():
                    messages.error(request, 'That email is being used')
                    return redirect('register')
                else:
                    # Looks good
                    user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)
                    # Login after register
                    auth.login(request, user)
                    messages.success(request, 'You are now logged in')
                    return redirect('index')
        else:
            messages.error(request, 'Passwords do not match')
            return redirect('register')
    else:
        return render(request, 'accounts/register.html')

def login(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            messages.success(request, 'You are now logged in')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid credentials')
            return redirect('login')
    else:
        return render(request, 'accounts/login.html')

def logout(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        auth.logout(request)
        messages.success(request, 'You are now logged out')
        return redirect('index')

def dashboard(request):
    """Legacy Django view - kept for backwards compatibility"""
    return render(request, 'accounts/dashboard.html')
