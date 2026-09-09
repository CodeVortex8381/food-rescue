from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class UserRole(str, enum.Enum):
    PROVIDER = "PROVIDER"
    RECIPIENT = "RECIPIENT"
    VOLUNTEER = "VOLUNTEER"
    ADMIN = "ADMIN"

class ListingStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    REQUESTED = "REQUESTED"
    ACCEPTED = "ACCEPTED"
    PICKUP_IN_PROGRESS = "PICKUP IN PROGRESS"
    COLLECTED = "COLLECTED"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

class PickupStatus(str, enum.Enum):
    ASSIGNED = "ASSIGNED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    COMPLETED = "COMPLETED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default=UserRole.PROVIDER.value)
    address = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    capacity = Column(Integer, default=50)  # for recipient NGO capacity
    food_preferences = Column(String, default="Vegetarian, Non-Vegetarian")
    verification_status = Column(String, default="VERIFIED")
    created_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship("FoodListing", back_populates="provider")
    requests = relationship("FoodRequest", back_populates="recipient")
    pickups = relationship("Pickup", back_populates="volunteer")

class FoodListing(Base):
    __tablename__ = "food_listings"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"))
    provider_name = Column(String, nullable=False)
    food_name = Column(String, nullable=False)
    category = Column(String, default="Prepared Meals")  # Meals, Bakery, Grains, Fruits, Packaged
    veg_type = Column(String, default="Vegetarian")       # Vegetarian, Non-Vegetarian, Vegan
    quantity = Column(String, nullable=False)             # e.g., "15 kg", "80 portions"
    portion_count = Column(Integer, default=50)
    prepared_at = Column(String, nullable=False)          # e.g., "07:00 PM"
    available_until = Column(String, nullable=False)      # e.g., "10:30 PM"
    available_until_timestamp = Column(DateTime, nullable=True)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    status = Column(String, default=ListingStatus.AVAILABLE.value)
    urgency_level = Column(String, default="MEDIUM")       # LOW, MEDIUM, HIGH, CRITICAL
    created_at = Column(DateTime, default=datetime.utcnow)

    provider = relationship("User", back_populates="listings")
    requests = relationship("FoodRequest", back_populates="listing")

class FoodRequest(Base):
    __tablename__ = "food_requests"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("food_listings.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    recipient_name = Column(String, nullable=False)
    requested_quantity = Column(Integer, nullable=False) # Number of portions
    status = Column(String, default=RequestStatus.PENDING.value)
    requested_at = Column(DateTime, default=datetime.utcnow)
    accepted_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    listing = relationship("FoodListing", back_populates="requests")
    recipient = relationship("User", back_populates="requests")
    pickups = relationship("Pickup", back_populates="request")

class Pickup(Base):
    __tablename__ = "pickups"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("food_requests.id"))
    volunteer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    volunteer_name = Column(String, nullable=True)
    pickup_address = Column(String, nullable=False)
    delivery_address = Column(String, nullable=False)
    pickup_lat = Column(Float, nullable=True)
    pickup_lng = Column(Float, nullable=True)
    delivery_lat = Column(Float, nullable=True)
    delivery_lng = Column(Float, nullable=True)
    pickup_time = Column(String, nullable=True)
    delivery_time = Column(String, nullable=True)
    status = Column(String, default=PickupStatus.ASSIGNED.value)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("FoodRequest", back_populates="pickups")
    volunteer = relationship("User", back_populates="pickups")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"))
    food_item = Column(String, nullable=False)
    expected_customers = Column(Integer, default=200)
    event_type = Column(String, default="Regular Operational Day")
    weather = Column(String, default="Normal / Clear")
    prepared_quantity = Column(Integer, default=300)
    predicted_demand = Column(Integer, nullable=False)
    potential_surplus = Column(Integer, nullable=False)
    confidence = Column(Float, default=0.88)
    recommendation = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
