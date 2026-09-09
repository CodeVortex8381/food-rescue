from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from .database import engine, Base, get_db
from .models import User, FoodListing, FoodRequest, Pickup, Prediction, UserRole, ListingStatus, RequestStatus, PickupStatus
from .schemas import (
    UserCreate, UserResponse,
    FoodListingCreate, FoodListingResponse,
    FoodRequestCreate, FoodRequestResponse,
    PickupCreate, PickupResponse,
    MatchRequest, MatchResponse,
    PredictionRequest, PredictionResponse,
    AnalyticsResponse
)
from .matching import calculate_smart_matches
from .prediction import predict_surplus
from .seed_data import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

# Seed database on startup
db_session = next(get_db())
try:
    seed_database(db_session)
finally:
    db_session.close()

app = FastAPI(
    title="BhojanSetu API",
    description="AI-Powered Surplus Food Rescue & Redistribution Platform API",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "app": "BhojanSetu API",
        "status": "online",
        "docs": "/docs",
        "tagline": "Turn surplus food into an opportunity to feed someone instead of letting it become waste."
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# --- USER ROUTES ---
@app.get("/api/users", response_model=List[UserResponse])
def get_users(role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()

@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- FOOD LISTINGS ROUTES ---
@app.get("/api/food", response_model=List[FoodListingResponse])
def get_food_listings(
    category: Optional[str] = None,
    veg_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(FoodListing)
    if category and category != "All":
        query = query.filter(FoodListing.category == category)
    if veg_type and veg_type != "All":
        query = query.filter(FoodListing.veg_type == veg_type)
    if status:
        query = query.filter(FoodListing.status == status)

    return query.order_by(FoodListing.created_at.desc()).all()

@app.get("/api/food/{listing_id}", response_model=FoodListingResponse)
def get_food_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@app.post("/api/food", response_model=FoodListingResponse)
def create_food_listing(listing: FoodListingCreate, db: Session = Depends(get_db)):
    # Calculate urgency score based on available_until string/time heuristics
    urgency = "MEDIUM"
    if "30" in listing.available_until or "mins" in listing.available_until:
        urgency = "CRITICAL"
    elif "10:" in listing.available_until or "11:" in listing.available_until:
        urgency = "HIGH"

    new_listing = FoodListing(
        **listing.dict(),
        status=ListingStatus.AVAILABLE.value,
        urgency_level=urgency,
        created_at=datetime.utcnow()
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

@app.put("/api/food/{listing_id}/status")
def update_listing_status(listing_id: int, status: str, db: Session = Depends(get_db)):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing.status = status
    db.commit()
    return {"id": listing_id, "status": status, "message": "Status updated successfully"}

# --- REQUESTS ROUTES ---
@app.post("/api/food/{listing_id}/request", response_model=FoodRequestResponse)
def request_food(listing_id: int, request_in: FoodRequestCreate, db: Session = Depends(get_db)):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    new_request = FoodRequest(
        listing_id=listing_id,
        recipient_id=request_in.recipient_id,
        recipient_name=request_in.recipient_name,
        requested_quantity=request_in.requested_quantity,
        status=RequestStatus.PENDING.value,
        requested_at=datetime.utcnow()
    )
    db.add(new_request)

    # Update listing status to REQUESTED
    listing.status = ListingStatus.REQUESTED.value
    db.commit()
    db.refresh(new_request)
    return new_request

@app.get("/api/requests", response_model=List[FoodRequestResponse])
def get_requests(recipient_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(FoodRequest)
    if recipient_id:
        query = query.filter(FoodRequest.recipient_id == recipient_id)
    return query.order_by(FoodRequest.requested_at.desc()).all()

@app.put("/api/requests/{request_id}")
def update_request_status(request_id: int, action: str, db: Session = Depends(get_db)):
    req = db.query(FoodRequest).filter(FoodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    listing = db.query(FoodListing).filter(FoodListing.id == req.listing_id).first()

    if action.upper() == "ACCEPT":
        req.status = RequestStatus.ACCEPTED.value
        req.accepted_at = datetime.utcnow()
        if listing:
            listing.status = ListingStatus.ACCEPTED.value

        # Auto-create pickup task for volunteers
        recipient = db.query(User).filter(User.id == req.recipient_id).first()
        rec_addr = recipient.address if recipient else "Recipient Address"
        rec_lat = recipient.latitude if recipient else listing.latitude
        rec_lng = recipient.longitude if recipient else listing.longitude

        pickup_task = Pickup(
            request_id=req.id,
            pickup_address=listing.address if listing else "Provider Address",
            delivery_address=rec_addr,
            pickup_lat=listing.latitude if listing else 28.6315,
            pickup_lng=listing.longitude if listing else 77.2167,
            delivery_lat=rec_lat,
            delivery_lng=rec_lng,
            status=PickupStatus.ASSIGNED.value
        )
        db.add(pickup_task)

    elif action.upper() == "REJECT":
        req.status = RequestStatus.REJECTED.value
        if listing:
            listing.status = ListingStatus.AVAILABLE.value

    db.commit()
    return {"request_id": request_id, "status": req.status}

# --- PICKUP / VOLUNTEER ROUTES ---
@app.get("/api/pickups", response_model=List[PickupResponse])
def get_pickups(volunteer_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Pickup)
    if volunteer_id:
        query = query.filter(Pickup.volunteer_id == volunteer_id)
    return query.order_by(Pickup.created_at.desc()).all()

@app.put("/api/pickups/{pickup_id}")
def update_pickup_status(
    pickup_id: int,
    status: str,
    volunteer_id: Optional[int] = None,
    volunteer_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    pickup = db.query(Pickup).filter(Pickup.id == pickup_id).first()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup task not found")

    if volunteer_id:
        pickup.volunteer_id = volunteer_id
    if volunteer_name:
        pickup.volunteer_name = volunteer_name

    pickup.status = status

    # Sync with request and listing status
    req = db.query(FoodRequest).filter(FoodRequest.id == pickup.request_id).first()
    if req:
        if status == PickupStatus.IN_TRANSIT.value:
            listing = db.query(FoodListing).filter(FoodListing.id == req.listing_id).first()
            if listing:
                listing.status = ListingStatus.PICKUP_IN_PROGRESS.value
        elif status == PickupStatus.COMPLETED.value:
            req.status = RequestStatus.ACCEPTED.value
            req.completed_at = datetime.utcnow()
            listing = db.query(FoodListing).filter(FoodListing.id == req.listing_id).first()
            if listing:
                listing.status = ListingStatus.COMPLETED.value

    db.commit()
    return {"pickup_id": pickup_id, "status": pickup.status}

# --- SMART MATCHING ENGINE ROUTE ---
@app.post("/api/match", response_model=MatchResponse)
def match_recipients_for_listing(req: MatchRequest, db: Session = Depends(get_db)):
    listing = db.query(FoodListing).filter(FoodListing.id == req.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    recipients = db.query(User).filter(User.role == UserRole.RECIPIENT.value).all()
    return calculate_smart_matches(listing, recipients)

# --- AI PREDICTION ROUTE ---
@app.post("/api/prediction", response_model=PredictionResponse)
def get_surplus_prediction(req: PredictionRequest, db: Session = Depends(get_db)):
    prediction_result = predict_surplus(req)

    # Save to history
    db_pred = Prediction(
        provider_id=req.provider_id,
        food_item=req.food_item,
        expected_customers=req.expected_customers,
        event_type=req.event_type,
        weather=req.weather,
        prepared_quantity=req.prepared_quantity,
        predicted_demand=prediction_result.predicted_demand,
        potential_surplus=prediction_result.potential_surplus,
        confidence=prediction_result.confidence,
        recommendation=prediction_result.recommendation
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    prediction_result.id = db_pred.id
    return prediction_result

# --- IMPACT ANALYTICS ROUTE ---
@app.get("/api/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    # Calculate stats from completed or active data + baseline hackathon metrics
    completed_listings = db.query(FoodListing).filter(
        (FoodListing.status == ListingStatus.COMPLETED.value) |
        (FoodListing.status == ListingStatus.ACCEPTED.value) |
        (FoodListing.status == ListingStatus.PICKUP_IN_PROGRESS.value)
    ).all()

    rescued_portions = sum(item.portion_count or 50 for item in completed_listings) + 12450
    waste_avoided_kg = round(rescued_portions * 0.35, 1)
    co2_reduction_kg = round(waste_avoided_kg * 2.5, 1)
    money_saved_inr = round(rescued_portions * 65.0, 2)

    active_providers = db.query(User).filter(User.role == UserRole.PROVIDER.value).count()
    registered_ngos = db.query(User).filter(User.role == UserRole.RECIPIENT.value).count()
    active_volunteers = db.query(User).filter(User.role == UserRole.VOLUNTEER.value).count()

    category_breakdown = {
        "Prepared Meals": 65,
        "Bakery & Snacks": 18,
        "Fruits & Vegetables": 12,
        "Grains & Groceries": 5
    }

    return AnalyticsResponse(
        total_portions_rescued=rescued_portions,
        total_listings_completed=len(completed_listings) + 645,
        waste_avoided_kg=waste_avoided_kg,
        co2_reduction_kg=co2_reduction_kg,
        money_saved_inr=money_saved_inr,
        active_providers=active_providers,
        registered_ngos=registered_ngos,
        active_volunteers=active_volunteers,
        rescue_by_category=category_breakdown
    )

# --- NOTIFICATIONS ROUTE ---
@app.get("/api/notifications")
def get_notifications():
    return [
        {
            "id": 1,
            "title": "🔔 Urgent Surplus Food Available",
            "message": "Shri Ram Bhandara added 150 portions of Puri Aloo Sabji (1.8 km away). Pickup before 10:15 PM.",
            "time": "5 mins ago",
            "type": "urgent"
        },
        {
            "id": 2,
            "title": "✅ Food Request Accepted",
            "message": "Grand Haveli Restaurant accepted your request for 40 portions of Bakery items.",
            "time": "15 mins ago",
            "type": "success"
        },
        {
            "id": 3,
            "title": "🚗 Volunteer Task Assigned",
            "message": "New pickup task available from Connaught Place to Paharganj (2.1 km).",
            "time": "25 mins ago",
            "type": "info"
        },
        {
            "id": 4,
            "title": "⚠ AI Surplus Alert",
            "message": "Predicted 45 portions surplus for Dinner service based on rain forecast.",
            "time": "1 hour ago",
            "type": "warning"
        }
    ]
