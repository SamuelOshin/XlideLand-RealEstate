from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer, ContactCreateSerializer


class ContactCreateAPIView(generics.CreateAPIView):
    """
    Create a new contact inquiry
    """
    queryset = Contact.objects.all()
    serializer_class = ContactCreateSerializer
    # No authentication required for contact form submissions
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()
        
        # Send email notification (optional)
        try:
            send_mail(
                f'New Contact Inquiry for {contact.listing}',
                f'Name: {contact.name}\nEmail: {contact.email}\nPhone: {contact.phone}\nMessage: {contact.message}',
                settings.DEFAULT_FROM_EMAIL,
                ['Opeyemib117@gmail.com'],  # Updated email
                fail_silently=True,
            )
        except Exception as e:
            pass  # Continue even if email fails
        
        return Response(
            {
                'contact': ContactSerializer(contact).data,
                'message': 'Contact inquiry submitted successfully'
            },
            status=status.HTTP_201_CREATED
        )


class ContactListAPIView(generics.ListAPIView):
    """
    List all contacts (authenticated users only)
    """
    queryset = Contact.objects.all().order_by('-contact_date')
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]


class ContactDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve a specific contact by ID (authenticated users only)
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_contacts(request):
    """
    Get contacts for the current user
    """
    try:
        contacts = Contact.objects.filter(user_id=request.user.id).order_by('-contact_date')
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch user contacts'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Legacy Django views for backwards compatibility
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail

def contact(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        listing_id = request.POST['listing_id']
        listing = request.POST['listing']
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        message = request.POST['message']
        user_id = request.POST['user_id']
        realtor_email = request.POST['realtor_email']

        #  Check if user has made inquiry already
        if request.user.is_authenticated:
            user_id = request.user.id
            has_contacted = Contact.objects.all().filter(listing_id=listing_id, user_id=user_id)
            if has_contacted:
                messages.error(request, 'You have already made an inquiry for this listing')
                return redirect('/listings/'+listing_id)

        contact = Contact(listing=listing, listing_id=listing_id, name=name, email=email, phone=phone, message=message, user_id=user_id)

        contact.save()

        # Send email
        send_mail(
            'Property Listing Inquiry',
            'There has been an inquiry for ' + listing + '. Sign into the admin panel for more info',
            'traversy.brad@gmail.com',
            [realtor_email, 'admin@bradtraversy.com'],
            fail_silently=False
        )

        messages.success(request, 'Your request has been submitted, a realtor will get back to you soon')
        return redirect('/listings/'+listing_id)
