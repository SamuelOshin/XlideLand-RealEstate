from django.core.management.base import BaseCommand
from listings.models import PropertyCategory, PropertyFeature, Listing, ListingAnalytics
from realtors.models import Realtor
import random

class Command(BaseCommand):
    help = 'Populate expanded property data fields'

    def handle(self, *args, **options):
        self.stdout.write('Populating property categories...')
        self.create_property_categories()
        
        self.stdout.write('Populating property features...')
        self.create_property_features()
        
        self.stdout.write('Updating existing listings with new data...')
        self.update_existing_listings()
        
        self.stdout.write('Creating listing analytics...')
        self.create_listing_analytics()
        
        self.stdout.write('Updating realtor data...')
        self.update_realtor_data()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated expanded property data!')
        )

    def create_property_categories(self):
        categories = [
            ('Luxury', 'luxury', 'High-end premium properties'),
            ('Residential', 'residential', 'Standard residential properties'),
            ('Commercial', 'commercial', 'Commercial real estate'),
            ('Waterfront', 'waterfront', 'Properties with water access'),
            ('Historic', 'historic', 'Historic and heritage properties'),
            ('Loft', 'loft', 'Modern loft-style properties'),
        ]
        
        for name, slug, description in categories:
            PropertyCategory.objects.get_or_create(
                name=name,
                defaults={'slug': slug, 'description': description}
            )

    def create_property_features(self):
        features = [
            ('Swimming Pool', 'exterior', 'pool'),
            ('Smart Home Technology', 'interior', 'smart'),
            ('Hardwood Floors', 'interior', 'floor'),
            ('Granite Countertops', 'interior', 'kitchen'),
            ('Stainless Steel Appliances', 'interior', 'kitchen'),
            ('Walk-in Closets', 'interior', 'storage'),
            ('Fitness Center', 'amenity', 'fitness'),
            ('Concierge Service', 'amenity', 'service'),
            ('Rooftop Terrace', 'exterior', 'outdoor'),
            ('Wine Storage', 'interior', 'storage'),
            ('In-Unit Laundry', 'interior', 'utility'),
            ('Panoramic City Views', 'exterior', 'view'),
            ('24/7 Security', 'amenity', 'security'),
            ('High-Speed Internet', 'amenity', 'technology'),
            ('Parking Garage', 'exterior', 'parking'),
            ('Fireplace', 'interior', 'comfort'),
            ('Central Air Conditioning', 'interior', 'hvac'),
            ('Balcony', 'exterior', 'outdoor'),
            ('Garden', 'exterior', 'outdoor'),
            ('Elevator Access', 'amenity', 'accessibility'),
        ]
        
        for name, category, icon in features:
            PropertyFeature.objects.get_or_create(
                name=name,
                defaults={'category': category, 'icon': icon}
            )

    def update_existing_listings(self):
        listings = Listing.objects.all()
        categories = list(PropertyCategory.objects.all())
        features = list(PropertyFeature.objects.all())
        
        property_types = ['house', 'condo', 'townhouse', 'apartment', 'loft', 'villa']
        heating_types = ['central', 'gas', 'electric']
        cooling_types = ['central', 'window', 'none']
        
        for listing in listings:
            # Update new fields with realistic data
            if not listing.property_type:
                listing.property_type = random.choice(property_types)
            
            if not listing.listing_type:
                listing.listing_type = 'sale'
            
            if not listing.category:
                listing.category = random.choice(categories)
            
            if not listing.year_built:
                listing.year_built = random.randint(1980, 2024)
            
            if not listing.floors:
                listing.floors = random.randint(1, 3)
            
            if not listing.fireplaces:
                listing.fireplaces = random.randint(0, 2)
                
            if not listing.parking_spaces:
                listing.parking_spaces = listing.garage or random.randint(0, 3)
            
            if not listing.heating:
                listing.heating = random.choice(heating_types)
                
            if not listing.cooling:
                listing.cooling = random.choice(cooling_types)
            
            if not listing.hoa_fee and listing.property_type in ['condo', 'townhouse']:
                listing.hoa_fee = random.randint(100, 800)
            
            if not listing.property_taxes:
                listing.property_taxes = int(listing.price * 0.01)  # Roughly 1% of price
            
            # Add random features
            random_features = random.sample(features, k=random.randint(3, 8))
            listing.features.set(random_features)
            
            # Set featured status for some listings
            if random.random() < 0.2:  # 20% chance to be featured
                listing.is_featured = True
            
            listing.save()

    def create_listing_analytics(self):
        listings = Listing.objects.all()
        
        for listing in listings:
            analytics, created = ListingAnalytics.objects.get_or_create(
                listing=listing,
                defaults={
                    'views': random.randint(50, 2000),
                    'saves': random.randint(5, 150),
                    'inquiries': random.randint(0, 25),
                    'tours_scheduled': random.randint(0, 15),
                }
            )

    def update_realtor_data(self):
        realtors = Realtor.objects.all()
        
        titles = [
            'Senior Real Estate Agent', 'Broker', 'Associate Broker',
            'Real Estate Consultant', 'Property Specialist', 'Luxury Home Specialist'
        ]
        
        specializations = [
            'Luxury Properties,Waterfront Homes',
            'First Time Buyers,Investment Properties', 
            'Commercial Real Estate,Property Management',
            'Historic Properties,Urban Living',
            'Suburban Homes,Family Properties'
        ]
        
        for realtor in realtors:
            if not realtor.title:
                realtor.title = random.choice(titles)
            
            if not realtor.years_experience:
                realtor.years_experience = random.randint(1, 25)
            
            if not realtor.total_sales_count:
                realtor.total_sales_count = random.randint(10, 200)
            
            if not realtor.total_sales_volume:
                realtor.total_sales_volume = realtor.total_sales_count * random.randint(300000, 800000)
            
            if not realtor.average_rating:
                realtor.average_rating = round(random.uniform(4.0, 5.0), 1)
            
            if not realtor.total_reviews:
                realtor.total_reviews = random.randint(15, 150)
            
            if not realtor.specializations:
                realtor.specializations = random.choice(specializations)
            
            if not realtor.bio:
                realtor.bio = f"With {realtor.years_experience} years of experience in real estate, {realtor.name} has helped numerous clients find their dream homes. Specializing in {realtor.specializations.split(',')[0].lower()}, they provide personalized service and expert market knowledge."
            
            realtor.save()
