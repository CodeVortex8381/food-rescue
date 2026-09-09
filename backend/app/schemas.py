from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity: Optional[int] = 50
    food_preferences: Optional[str] = "Vegetarian, Non-Vegetarian"
    verification_status: Optional[str] = "VERIFIED"

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FoodListingBase(BaseModel):
    provider_id: int
    provider_name: str
    food_name: str
    category: str = "Prepared Meals"
    veg_type: str = "Vegetarian"
    quantity: str
    portion_count: int = 50
    prepared_at: str
    available_until: str
    address: str
    latitude: float
    longitude: float
    description: Optional[str] = None
    image_url: Optional[str] = None

class FoodListingCreate(FoodListingBase):
    pass

class FoodListingResponse(FoodListingBase):
    id: int
    status: str
    urgency_level: str
    created_at: datetime

    class Config:
        from_attributes = True

class FoodRequestCreate(BaseModel):
    listing_id: int
    recipient_id: int
    recipient_name: str
    requested_quantity: int

class FoodRequestResponse(BaseModel):
    id: int
    listing_id: int
    recipient_id: int
    recipient_name: str
    requested_quantity: int
    status: str
    requested_at: datetime
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PickupCreate(BaseModel):
    request_id: int
    volunteer_id: Optional[int] = None
    volunteer_name: Optional[str] = None

class PickupResponse(BaseModel):
    id: int
    request_id: int
    volunteer_id: Optional[int] = None
    volunteer_name: Optional[str] = None
    pickup_address: str
    delivery_address: str
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    delivery_lat: Optional[float] = None
    delivery_lng: Optional[float] = None
    pickup_time: Optional[str] = None
    delivery_time: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class MatchRequest(BaseModel):
    listing_id: int

class MatchRecipientResult(BaseModel):
    recipient_id: int
    recipient_name: str
    address: str
    distance_km: float
    capacity: int
    match_score: int
    match_reasons: List[str]
    latitude: float
    longitude: float

class MatchResponse(BaseModel):
    listing_id: int
    food_name: str
    quantity_portions: int
    urgency_level: str
    recommended_recipients: List[MatchRecipientResult]

class PredictionRequest(BaseModel):
    provider_id: int
    food_item: str
    expected_customers: int
    prepared_quantity: int
    event_type: str = "Regular Operational Day"
    weather: str = "Normal / Clear"

class PredictionResponse(BaseModel):
    id: Optional[int] = None
    provider_id: int
    food_item: str
    expected_customers: int
    prepared_quantity: int
    predicted_demand: int
    potential_surplus: int
    confidence: float
    recommendation: str

class AnalyticsResponse(BaseModel):
    total_portions_rescued: int
    total_listings_completed: int
    waste_avoided_kg: float
    co2_reduction_kg: float
    money_saved_inr: float
    active_providers: int
    registered_ngos: int
    active_volunteers: int
    rescue_by_category: dict
