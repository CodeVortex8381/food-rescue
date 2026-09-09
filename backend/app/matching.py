import math
from typing import List
from .models import FoodListing, User, UserRole
from .schemas import MatchRecipientResult, MatchResponse

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two coordinates in kilometers."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def calculate_smart_matches(listing: FoodListing, recipients: List[User]) -> MatchResponse:
    results: List[MatchRecipientResult] = []

    for recipient in recipients:
        if recipient.role != UserRole.RECIPIENT.value and recipient.role != "RECIPIENT":
            continue

        rec_lat = recipient.latitude or listing.latitude + 0.01
        rec_lng = recipient.longitude or listing.longitude + 0.01
        dist_km = calculate_haversine_distance(listing.latitude, listing.longitude, rec_lat, rec_lng)

        # Distance Score (0-35)
        if dist_km <= 2.0:
            dist_score = 35
        elif dist_km <= 5.0:
            dist_score = 28
        elif dist_km <= 10.0:
            dist_score = 18
        else:
            dist_score = 8

        # Capacity Score (0-35)
        portion_cnt = listing.portion_count or 50
        rec_capacity = recipient.capacity or 40
        capacity_ratio = min(1.0, rec_capacity / portion_cnt)
        capacity_score = int(capacity_ratio * 35)

        # Urgency & Readiness Score (0-15)
        urgency_score = 15 if listing.urgency_level in ["HIGH", "CRITICAL"] else 10

        # Verification Score (0-15)
        verification_score = 15 if recipient.verification_status == "VERIFIED" else 10

        total_score = min(99, dist_score + capacity_score + urgency_score + verification_score)

        # Build human-readable match reasons
        reasons = []
        if dist_km <= 3.0:
            reasons.append(f"✓ Very close ({dist_km} km away)")
        else:
            reasons.append(f"✓ Accessible distance ({dist_km} km away)")

        if rec_capacity >= portion_cnt:
            reasons.append(f"✓ Full capacity available ({rec_capacity} portions)")
        else:
            reasons.append(f"✓ Partial capacity ({rec_capacity} of {portion_cnt} portions)")

        if listing.urgency_level in ["HIGH", "CRITICAL"]:
            reasons.append("✓ Express pickup capability")

        if recipient.verification_status == "VERIFIED":
            reasons.append("✓ Verified NGO recipient")

        results.append(
            MatchRecipientResult(
                recipient_id=recipient.id,
                recipient_name=recipient.name,
                address=recipient.address or "Local Area",
                distance_km=dist_km,
                capacity=rec_capacity,
                match_score=total_score,
                match_reasons=reasons,
                latitude=rec_lat,
                longitude=rec_lng,
            )
        )

    # Sort by highest match score
    results.sort(key=lambda x: x.match_score, reverse=True)

    return MatchResponse(
        listing_id=listing.id,
        food_name=listing.food_name,
        quantity_portions=listing.portion_count or 50,
        urgency_level=listing.urgency_level or "MEDIUM",
        recommended_recipients=results[:5]
    )
