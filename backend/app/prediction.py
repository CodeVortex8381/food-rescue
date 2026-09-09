import math
from .schemas import PredictionRequest, PredictionResponse

def predict_surplus(req: PredictionRequest) -> PredictionResponse:
    """
    Simulates ML regression model forecasting customer food demand vs prepared quantity.
    Evaluates impact of event flags, weather, and expected customer count.
    """
    base_consumption_per_customer = 0.82  # Average portions per customer

    # Weather multipliers
    weather_factors = {
        "Normal / Clear": 1.0,
        "Heavy Rain": 0.75,      # Footfall drops during heavy rain
        "Extreme Heat": 0.85,
        "Cold / Pleasant": 1.1,  # Footfall increases
    }
    w_factor = weather_factors.get(req.weather, 1.0)

    # Event multipliers
    event_factors = {
        "Regular Operational Day": 1.0,
        "College Festival / Concert": 1.35, # Higher demand
        "Community Bhandara / Feast": 1.5,
        "Weekend Buffet Special": 1.2,
    }
    e_factor = event_factors.get(req.event_type, 1.0)

    expected_demand = int(req.expected_customers * base_consumption_per_customer * w_factor * e_factor)
    potential_surplus = max(0, req.prepared_quantity - expected_demand)

    confidence = 0.91 if req.weather == "Normal / Clear" else 0.84

    if potential_surplus > 40:
        recommendation = (
            f"⚠ High surplus risk! Approximately {potential_surplus} portions may remain unused. "
            "Consider reducing prep or publishing a pre-surplus rescue listing now."
        )
    elif potential_surplus > 10:
        recommendation = (
            f"⚡ Moderate surplus expected ({potential_surplus} portions). "
            "Enable automated rescue notifications for nearby NGOs."
        )
    else:
        recommendation = (
            "✓ Optimal preparation balance! High consumption predicted with minimal wastage."
        )

    return PredictionResponse(
        provider_id=req.provider_id,
        food_item=req.food_item,
        expected_customers=req.expected_customers,
        prepared_quantity=req.prepared_quantity,
        predicted_demand=expected_demand,
        potential_surplus=potential_surplus,
        confidence=confidence,
        recommendation=recommendation
    )
