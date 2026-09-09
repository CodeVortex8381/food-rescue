from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .models import User, FoodListing, FoodRequest, Pickup, UserRole, ListingStatus, RequestStatus, PickupStatus

def seed_database(db: Session):
    # Check if database already seeded
    if db.query(User).first():
        return

    # Seed Users (Providers, Recipients, Volunteers)
    users = [
        # Providers
        User(
            id=1,
            name="Grand Haveli Restaurant",
            email="provider1@haveli.com",
            phone="+91 98765 43210",
            role=UserRole.PROVIDER.value,
            address="Connaught Place, New Delhi",
            latitude=28.6315,
            longitude=77.2167,
            verification_status="VERIFIED"
        ),
        User(
            id=2,
            name="Delhi University Main Canteen",
            email="canteen@du.ac.in",
            phone="+91 98123 45678",
            role=UserRole.PROVIDER.value,
            address="North Campus, Delhi University",
            latitude=28.6904,
            longitude=77.2066,
            verification_status="VERIFIED"
        ),
        User(
            id=3,
            name="Shri Ram Bhandara Trust",
            email="bhandara@trust.org",
            phone="+91 99555 11223",
            role=UserRole.PROVIDER.value,
            address="Karol Bagh, New Delhi",
            latitude=28.6517,
            longitude=77.1906,
            verification_status="VERIFIED"
        ),
        # Recipients (NGOs & Shelters)
        User(
            id=4,
            name="Aasha Shelter Home",
            email="ngo1@aasha.org",
            phone="+91 98888 77766",
            role=UserRole.RECIPIENT.value,
            address="Paharganj, New Delhi",
            latitude=28.6429,
            longitude=77.2195,
            capacity=120,
            food_preferences="Vegetarian, Non-Vegetarian",
            verification_status="VERIFIED"
        ),
        User(
            id=5,
            name="Annapurna Community Kitchen",
            email="annapurna@foodcare.org",
            phone="+91 97777 66655",
            role=UserRole.RECIPIENT.value,
            address="Civil Lines, Delhi",
            latitude=28.6814,
            longitude=77.2228,
            capacity=80,
            food_preferences="Vegetarian Only",
            verification_status="VERIFIED"
        ),
        User(
            id=6,
            name="Hope Care Foundation",
            email="contact@hopecare.org",
            phone="+91 96666 55544",
            role=UserRole.RECIPIENT.value,
            address="Patel Nagar, New Delhi",
            latitude=28.6476,
            longitude=77.1658,
            capacity=60,
            food_preferences="Vegetarian, Bakery, Meals",
            verification_status="VERIFIED"
        ),
        # Volunteers
        User(
            id=7,
            name="Rohan Verma",
            email="rohan.volunteer@gmail.com",
            phone="+91 95555 44433",
            role=UserRole.VOLUNTEER.value,
            address="Rajendra Place, New Delhi",
            latitude=28.6425,
            longitude=77.1781,
            verification_status="VERIFIED"
        ),
        User(
            id=8,
            name="Priya Sharma",
            email="priya.volunteer@gmail.com",
            phone="+91 94444 33322",
            role=UserRole.VOLUNTEER.value,
            address="Kashmere Gate, Delhi",
            latitude=28.6665,
            longitude=77.2333,
            verification_status="VERIFIED"
        )
    ]

    db.add_all(users)
    db.commit()

    # Seed Active Food Listings
    now = datetime.utcnow()
    listings = [
        FoodListing(
            id=1,
            provider_id=1,
            provider_name="Grand Haveli Restaurant",
            food_name="Paneer Butter Masala + Jeera Rice + Naan",
            category="Prepared Meals",
            veg_type="Vegetarian",
            quantity="80 portions (approx 25 kg)",
            portion_count=80,
            prepared_at="07:30 PM",
            available_until="10:45 PM",
            available_until_timestamp=now + timedelta(hours=2),
            address="Connaught Place, Block B, New Delhi",
            latitude=28.6315,
            longitude=77.2167,
            description="Freshly prepared surplus banquet dinner food. Hygienically packed in insulated warm containers.",
            image_url="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
            status=ListingStatus.AVAILABLE.value,
            urgency_level="HIGH"
        ),
        FoodListing(
            id=2,
            provider_id=2,
            provider_name="Delhi University Main Canteen",
            food_name="Dal Makhani & Steamed Basmati Rice",
            category="Prepared Meals",
            veg_type="Vegetarian",
            quantity="120 portions (approx 35 kg)",
            portion_count=120,
            prepared_at="06:00 PM",
            available_until="11:30 PM",
            available_until_timestamp=now + timedelta(hours=3),
            address="North Campus Canteen, University Road",
            latitude=28.6904,
            longitude=77.2066,
            description="Unserved extra batch from afternoon seminar event. Kept stored in clean food grade tubs.",
            image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
            status=ListingStatus.AVAILABLE.value,
            urgency_level="MEDIUM"
        ),
        FoodListing(
            id=3,
            provider_id=3,
            provider_name="Shri Ram Bhandara Trust",
            food_name="Puri + Aloo Gobhi Sabji + Kheer",
            category="Prepared Meals",
            veg_type="Vegetarian",
            quantity="150 portions",
            portion_count=150,
            prepared_at="08:00 PM",
            available_until="10:15 PM",
            available_until_timestamp=now + timedelta(minutes=45),
            address="Karol Bagh Temple Premises, New Delhi",
            latitude=28.6517,
            longitude=77.1906,
            description="Community feast surplus. Very fresh, hot, and packed ready for immediate distribution.",
            image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
            status=ListingStatus.AVAILABLE.value,
            urgency_level="CRITICAL"
        ),
        FoodListing(
            id=4,
            provider_id=1,
            provider_name="Grand Haveli Restaurant",
            food_name="Fresh Fruit Trays & Assorted Muffins",
            category="Bakery & Snacks",
            veg_type="Vegetarian",
            quantity="40 portions",
            portion_count=40,
            prepared_at="04:00 PM",
            available_until="11:00 PM",
            available_until_timestamp=now + timedelta(hours=4),
            address="Connaught Place, Block B, New Delhi",
            latitude=28.6315,
            longitude=77.2167,
            description="Surplus dessert items from afternoon high tea corporate order.",
            image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
            status=ListingStatus.ACCEPTED.value,
            urgency_level="LOW"
        )
    ]

    db.add_all(listings)
    db.commit()

    # Seed Food Request
    request1 = FoodRequest(
        id=1,
        listing_id=4,
        recipient_id=4,
        recipient_name="Aasha Shelter Home",
        requested_quantity=40,
        status=RequestStatus.ACCEPTED.value,
        requested_at=now - timedelta(minutes=30),
        accepted_at=now - timedelta(minutes=15)
    )
    db.add(request1)
    db.commit()

    # Seed Pickup task for Volunteer
    pickup1 = Pickup(
        id=1,
        request_id=1,
        volunteer_id=7,
        volunteer_name="Rohan Verma",
        pickup_address="Grand Haveli Restaurant, Connaught Place",
        delivery_address="Aasha Shelter Home, Paharganj",
        pickup_lat=28.6315,
        pickup_lng=77.2167,
        delivery_lat=28.6429,
        delivery_lng=77.2195,
        pickup_time="09:15 PM",
        delivery_time="09:45 PM",
        status=PickupStatus.IN_TRANSIT.value
    )
    db.add(pickup1)
    db.commit()
