<<<<<<< HEAD
     #    PRD — BhojanSetu
## AI-Powered Surplus Food Rescue & Redistribution Platform

**Document Type:** Hackathon Product Requirements Document  
**Project:** BhojanSetu  
**Target Users:** Restaurants, Bhandaras, College Canteens, NGOs, Volunteers, Shelters, and Individuals  
**Primary Goal:** Reduce food waste by connecting surplus prepared food with people or organizations that can collect and consume it.

---

# 1. Product Overview

BhojanSetu is a web-based surplus food rescue platform.

Restaurants, bhandaras, college canteens, event organizers, and other food providers can report surplus food that would otherwise be wasted.

Once food is reported, the platform makes the listing visible to suitable nearby recipients such as NGOs, shelters, volunteers, and individuals. Recipients can request or claim the available food and arrange pickup.

The platform can additionally use AI to predict potential food surplus and intelligently match available food with nearby recipients.

### Core Concept

```text
Restaurant / Bhandara / Canteen
              ↓
        Surplus Food
              ↓
       Report on Platform
              ↓
       Matching Engine
              ↓
 ┌────────────┼─────────────┐
 ↓            ↓             ↓
NGOs      Volunteers    Individuals
 └────────────┼─────────────┘
              ↓
        Food Collected
              ↓
       Less Food Waste
```

---

# 2. Problem Statement

Large quantities of prepared food can remain unused after restaurant operations, college events, weddings, community meals, bhandaras, and other gatherings.

At the same time, people and organizations may need access to food but have no easy way to discover nearby surplus food.

The main problems are:

- Surplus food is difficult to discover in real time.
- Food providers may not know who can collect the food.
- Potential recipients may not know where surplus food is available.
- Short time windows make manual coordination difficult.
- There is no simple centralized system for matching surplus food with nearby recipients.
- Food providers may throw away usable surplus because they cannot find a recipient quickly.

BhojanSetu aims to solve this coordination problem through a real-time digital platform.

---

# 3. Product Goals

## Primary Goals

1. Allow food providers to quickly report surplus food.
2. Show available surplus food to nearby eligible recipients.
3. Match food with suitable recipients.
4. Allow recipients to request or claim food.
5. Coordinate pickup.
6. Track the status of each food listing.
7. Reduce avoidable food waste.
8. Provide transparency through activity and impact statistics.

## Secondary Goals

1. Predict potential surplus using historical data.
2. Prioritize urgent food listings.
3. Recommend suitable recipients.
4. Provide food-waste analytics.
5. Build a network of restaurants, NGOs, volunteers, and community organizations.

---

# 4. Target Users

## 4.1 Food Providers

Examples:

- Restaurants
- Hotels
- College canteens
- Bhandaras
- Wedding/event organizers
- Community kitchens
- Caterers

They can:

- Create an account
- Report surplus food
- Specify quantity
- Specify preparation time
- Specify availability deadline
- Add location
- Select food category
- Track pickup status

---

## 4.2 NGOs / Shelters

They can:

- Register organization details
- Set service area
- Specify approximate food requirements
- View nearby surplus food
- Request food
- Accept available listings
- Coordinate pickup

---

## 4.3 Volunteers

Volunteers can:

- Register
- Set service area
- View nearby pickup requests
- Accept pickup tasks
- Collect food
- Deliver food to a recipient
- Mark delivery as completed

---

## 4.4 Individuals

Individuals can:

- View nearby available food
- See quantity and pickup location
- Request available food
- Receive pickup instructions
- Mark collection as completed

The exact eligibility and access rules can be configured by the platform.

---

# 5. Core User Journey

## Food Provider Journey

```text
Register/Login
      ↓
Provider Dashboard
      ↓
Report Surplus Food
      ↓
Enter Food Details
      ↓
Confirm Location
      ↓
Set Available Until Time
      ↓
Publish Listing
      ↓
Nearby Recipients Notified
      ↓
Recipient Requests Food
      ↓
Provider Accepts Request
      ↓
Pickup
      ↓
Listing Completed
```

---

## Recipient Journey

```text
Register/Login
      ↓
Recipient Dashboard
      ↓
View Nearby Food
      ↓
Open Food Listing
      ↓
Check Quantity / Time / Distance
      ↓
Request Food
      ↓
Request Accepted
      ↓
Pickup / Delivery
      ↓
Mark Completed
```

---

# 6. MVP Scope

The MVP must focus on the basic food-rescue workflow.

## P0 — Must Have

### 1. User Registration/Login

Support basic user types:

- Food Provider
- Recipient
- Volunteer

---

### 2. Report Surplus Food

Provider enters:

- Food name
- Food category
- Vegetarian/non-vegetarian
- Approximate quantity
- Number of portions
- Preparation time
- Available until
- Pickup location
- Optional description
- Optional image

Example:

```text
Food: Rice + Dal + Sabji
Quantity: 80 portions
Prepared: 7:00 PM
Available until: 10:30 PM
Location: ABC Restaurant
Pickup: Available
```

---

### 3. Food Listing

Each surplus listing should show:

```text
🍛 Rice + Dal + Sabji

80 portions
Vegetarian
1.2 km away

Prepared: 7:00 PM
Available until: 10:30 PM

[Request Food]
```

---

### 4. Location-Based Discovery

Recipients should be able to see nearby food listings.

The system can sort by:

- Distance
- Urgency
- Quantity
- Time remaining

For the MVP, approximate location can be used instead of implementing complex real-time tracking.

---

### 5. Request / Claim Food

A recipient can request an available listing.

The provider can:

- Accept request
- Reject request

Once accepted:

```text
Listing Status:
CLAIMED
```

---

### 6. Pickup Status

Track:

```text
AVAILABLE
   ↓
REQUESTED
   ↓
ACCEPTED
   ↓
PICKUP IN PROGRESS
   ↓
COLLECTED
   ↓
COMPLETED
```

---

### 7. Notifications

Notify suitable nearby recipients when new surplus food becomes available.

Example:

```text
🔔 New Food Available

80 portions of rice, dal and sabji
Available 1.2 km away
Pickup before 10:30 PM
```

---

# 7. Food Listing Data

Each listing should contain:

```text
id
providerId
foodName
foodCategory
vegType
quantity
portionCount
preparedAt
availableUntil
pickupLocation
latitude
longitude
description
image
status
createdAt
```

---

# 8. Recipient Data

```text
id
userId
organizationName
recipientType
contactInformation
serviceArea
latitude
longitude
capacity
foodPreferences
verificationStatus
```

---

# 9. Volunteer Data

```text
id
userId
name
phone
latitude
longitude
serviceRadius
availability
verificationStatus
currentTask
```

---

# 10. Matching Engine

The matching engine is a major feature of the platform.

When surplus food is reported, the system evaluates nearby recipients.

Possible matching factors:

1. Distance
2. Quantity required
3. Quantity available
4. Time remaining
5. Recipient type
6. Recipient capacity
7. Urgency
8. Food preferences
9. Volunteer availability

Example:

```text
Surplus:
100 portions
Remaining time: 90 minutes

Nearby:

NGO A
Distance: 2 km
Capacity: 80
Can collect: Yes

Shelter B
Distance: 4 km
Capacity: 50
Can collect: Yes

Person C
Distance: 1 km
Capacity: 2
```

The system can recommend:

```text
Recommended Recipient:
NGO A

Reason:
✓ Nearby
✓ Can accept most of the food
✓ Pickup available
✓ Suitable capacity
```

---

# 11. Urgency Score

Food becomes more urgent as its available time decreases.

Example:

```text
More than 3 hours:
LOW

1–3 hours:
MEDIUM

30–60 minutes:
HIGH

Less than 30 minutes:
CRITICAL
```

The exact thresholds can be configured.

The dashboard can highlight urgent listings.

---

# 12. AI Surplus Prediction

AI can be added as an advanced feature.

Instead of only reacting after food is left over, the system can predict possible surplus.

### Input Data

Possible data:

- Historical food preparation quantity
- Historical sales
- Day of week
- Meal period
- Number of expected customers
- College attendance
- Events
- Holidays
- Weather
- Food item
- Price
- Previous leftover quantity

### Example

```text
Historical data
      +
Expected customers
      +
Today's conditions
      ↓
Prediction Model
      ↓
Expected demand
      ↓
Potential surplus
```

Example:

```text
Prepared: 300 portions
Predicted demand: 240 portions

Potential surplus:
~60 portions
```

The system can then alert the provider:

```text
⚠ Possible surplus detected

Approximately 60 portions may remain.

Consider preparing less or enabling food-rescue notification.
```

---

# 13. AI Matching

AI/algorithmic matching can also help select the best recipient.

Example:

```text
Food Available
      ↓
Analyze:
Distance
Quantity
Urgency
Capacity
Pickup ability
      ↓
Matching Score
      ↓
Top Recommended Recipients
```

This creates a stronger technical component for the hackathon.

---

# 14. What-If Prediction

Optional advanced feature.

Providers can test scenarios.

Example:

```text
Expected customers: 1,500
Event: Yes
Weather: Rain
Food: Biryani
```

System:

```text
Expected demand: 230
Potential surplus: 40
```

Change expected customers:

```text
Expected customers: 2,000
```

System:

```text
Expected demand: 285
Potential surplus: 0
```

This allows providers to make better preparation decisions.

---

# 15. Dashboard

## Provider Dashboard

Show:

- Active surplus listings
- Claimed food
- Completed donations
- Food rescued
- Estimated waste avoided
- Urgent listings
- Prediction alerts

Example:

```text
TODAY

Active Listings: 3
Food Rescued: 145 portions
Pending Requests: 4
Urgent Listings: 1

This Month
Food Rescued: 2,450 portions
```

---

## Recipient Dashboard

Show:

- Nearby food
- Urgent listings
- Requested food
- Accepted requests
- Pickup tasks
- Completed collections

---

## Volunteer Dashboard

Show:

- Available pickup tasks
- Distance
- Pickup deadline
- Assigned deliveries
- Completed deliveries

---

# 16. Food Detail Page

The detail page should show:

```text
Rice + Dal + Sabji

🍛 80 portions
📍 1.2 km away
⏰ Available until 10:30 PM
🥗 Vegetarian

Prepared at: 7:00 PM

Pickup location:
ABC Restaurant

[Request Food]
```

The platform should not represent food as guaranteed safe. Providers should supply relevant preparation/storage information and users should follow appropriate food-safety practices.

---

# 17. Notifications

Notification types:

### New Food

```text
🍲 80 portions available near you.
```

### Request Accepted

```text
✅ Your food request was accepted.
```

### Pickup Reminder

```text
⏰ Pickup deadline is approaching.
```

### Urgent Food

```text
🚨 30 portions available for the next 30 minutes.
```

### Volunteer Task

```text
🚗 New pickup task 1.5 km away.
```

---

# 18. Map View

Optional MVP/P1 feature.

Show available food on a map.

Example:

```text
        MAP

   🍲 Restaurant A
          |
          | 1.2 km
          |
       👤 Recipient
```

Users can click a marker to see:

- Food
- Quantity
- Distance
- Deadline
- Request button

---

# 19. Verification

Because this platform involves real-world food distribution, basic verification is recommended.

Possible statuses:

```text
UNVERIFIED
PENDING
VERIFIED
SUSPENDED
```

For the hackathon MVP, verification can be simple.

Future versions can support stronger organization/provider verification.

---

# 20. Safety & Trust

The platform should provide:

- Preparation time
- Available-until time
- Storage information
- Food type
- Allergen information where provided
- Provider identity
- Report listing option
- Expired listing removal
- Basic verification

Expired listings should automatically become unavailable.

The platform should make clear that food providers are responsible for accurate food information and that recipients should assess food safety before consumption.

---

# 21. Database Structure

## User

```text
id
name
email
phone
passwordHash
role
createdAt
```

## FoodListing

```text
id
providerId
foodName
category
vegType
quantity
portionCount
preparedAt
availableUntil
latitude
longitude
address
description
imageUrl
status
createdAt
```

## FoodRequest

```text
id
listingId
recipientId
requestedQuantity
status
requestedAt
acceptedAt
completedAt
```

## Pickup

```text
id
requestId
volunteerId
pickupTime
deliveryTime
status
```

## Prediction

```text
id
providerId
foodItem
predictionDate
predictedDemand
potentialSurplus
confidence
createdAt
```

---

# 22. Suggested API

```text
POST   /api/auth/register
POST   /api/auth/login

POST   /api/food
GET    /api/food
GET    /api/food/:id
PUT    /api/food/:id
DELETE /api/food/:id

POST   /api/food/:id/request
GET    /api/requests
PUT    /api/requests/:id

POST   /api/pickups
PUT    /api/pickups/:id

GET    /api/nearby-food
GET    /api/notifications

POST   /api/prediction
POST   /api/match

GET    /api/analytics
```

The final API structure can be simplified during the 24-hour hackathon.

---

# 23. System Architecture

```text
                    USER
                     │
                     ▼
              ┌─────────────┐
              │  Frontend   │
              │ Web / PWA   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   Backend   │
              │   REST API  │
              └───┬─────┬───┘
                  │     │
          ┌───────┘     └────────┐
          ▼                      ▼
   ┌──────────────┐       ┌──────────────┐
   │  Database    │       │ AI / Matching│
   │ Users/Food   │       │    Engine    │
   └──────────────┘       └──────┬───────┘
                                  │
                                  ▼
                         Notifications
```

---

# 24. Suggested Technology Stack

The team should select technology based on its existing skills.

### Frontend

- React
- Next.js
- Tailwind CSS

### Backend

- Node.js
- Express
- FastAPI if using Python

### Database

- PostgreSQL
- MongoDB

### Maps

- OpenStreetMap / suitable map provider
- Geolocation APIs as required

### AI/ML

- Python
- scikit-learn
- Suitable prediction model

### Notifications

- Web push
- Email
- SMS/WhatsApp integration if available and permitted

For the hackathon, avoid depending on too many external services.

---

# 25. Recommended MVP Tech Architecture

For a 24-hour build, keep it simple:

```text
Next.js / React
       ↓
Node.js / API
       ↓
PostgreSQL
       ↓
Simple Matching Algorithm
       ↓
Optional Python ML Service
```

The AI prediction service can be added after the core rescue workflow works.

---

# 26. MVP Priority

## P0 — Must Have

- Registration/login
- Provider dashboard
- Recipient dashboard
- Report surplus food
- Food listing
- Nearby food discovery
- Request food
- Accept/reject request
- Pickup/completion status
- Basic notifications
- Expiry handling

## P1 — Should Have

- Map view
- Volunteer role
- Smart matching
- Urgency score
- Impact analytics
- Food images

## P2 — Advanced

- AI surplus prediction
- What-if prediction
- AI recipient recommendation
- Route optimization
- Advanced analytics
- Automatic notifications

## P3 — Future

- Multi-city network
- Corporate partnerships
- IoT food monitoring
- Advanced demand forecasting
- Integration with restaurant POS systems
- Large NGO network

---

# 27. Hackathon Development Strategy

The team should NOT start by building AI.

Build the rescue workflow first.

## Phase 1 — Core Product

```text
Provider
   ↓
Reports food
   ↓
Food appears
   ↓
Recipient sees food
   ↓
Recipient requests
   ↓
Provider accepts
   ↓
Pickup completed
```

Once this works, the project already has a functional MVP.

## Phase 2 — Smart Features

Add:

```text
Smart matching
       ↓
Urgency score
       ↓
Notifications
       ↓
AI prediction
       ↓
Analytics
```

---

# 28. 24-Hour Hackathon Plan

## Hour 0–1

- Understand the problem
- Finalize MVP
- Divide responsibilities
- Design database
- Design user flow

## Hour 1–4

- Project setup
- Authentication
- Database
- Basic UI

## Hour 4–8

- Food listing
- Report food
- Food detail page
- Request system

## Hour 8–12

- Provider/recipient dashboards
- Request approval
- Pickup workflow
- Notifications

## Hour 12–15

- Location-based discovery
- Matching algorithm
- Urgency system

## Hour 15–18

- Analytics
- Map
- UI polish
- Expiry handling

## Hour 18–21

- AI prediction / advanced feature
- Testing
- Bug fixing

## Hour 21–23

- README
- PPT
- Demo dataset
- Demo script

## Hour 23–24

- Final testing
- Backup
- Final submission
- Demo rehearsal

---

# 29. Team Responsibilities

## Frontend Developer

- Login
- Dashboards
- Food listing
- Food detail
- Request UI
- Map
- Charts

## Backend Developer

- Authentication
- Database
- APIs
- Request workflow
- Notifications
- Listing expiry

## AI/Logic Developer

- Matching algorithm
- Urgency score
- Prediction model
- Analytics calculations

## Integration / Presentation

- Connect all modules
- Testing
- README
- Demo data
- PPT
- Demo script
- Q&A preparation

All members should understand the important parts of the project.

---

# 30. Demo Scenario

The best demo should tell a simple story.

## Step 1 — Restaurant

Restaurant has:

```text
80 portions
Rice + Dal + Sabji
Available until 10:30 PM
```

Provider clicks:

```text
[Report Surplus]
```

---

## Step 2 — Platform

The listing becomes:

```text
🍲 80 portions available

1.2 km away
2 hours remaining

Status: AVAILABLE
```

Nearby NGOs and recipients receive a notification.

---

## Step 3 — NGO

NGO sees:

```text
80 portions available
1.2 km away

[Request 80 Portions]
```

---

## Step 4 — Restaurant

Restaurant receives:

```text
NGO ABC requested 80 portions.
```

Provider accepts.

---

## Step 5 — Volunteer

Volunteer sees:

```text
Pickup:
ABC Restaurant

Deliver to:
NGO ABC

Distance:
2.1 km

[Accept Pickup]
```

---

## Step 6 — Completion

Volunteer collects the food.

Status becomes:

```text
COMPLETED ✓
```

Dashboard:

```text
Food Rescued: 80 portions
Estimated Waste Avoided: 80 portions
```

---

# 31. AI Demo Scenario

After showing the rescue workflow, demonstrate the advanced feature.

Restaurant enters:

```text
Food: Biryani
Prepared: 300
Expected customers: 220
Historical demand: 230
Event: No
Weather: Normal
```

System:

```text
Predicted demand: 235
Potential surplus: 65
```

Then:

```text
⚠ Potential surplus detected.

Would you like to enable food-rescue notification?
[YES]
```

This connects the prediction system directly to the rescue platform.

---

# 32. Innovation

The key innovation is not simply:

> "A website where restaurants donate food."

The stronger product concept is:

> **A real-time food rescue network that detects or receives surplus food, predicts urgency, intelligently matches it with nearby recipients, and coordinates collection before the food becomes waste.**

This combines:

- Real-time food reporting
- Location-based discovery
- Smart matching
- Urgency
- Notifications
- Volunteer logistics
- AI prediction
- Impact analytics

---

# 33. Impact Metrics

The platform should measure:

- Portions rescued
- Food listings completed
- Food waste avoided
- Number of providers
- Number of recipients
- Number of volunteers
- Average pickup time
- Average distance
- Expired listings
- Estimated monetary value of rescued food

Example dashboard:

```text
TOTAL FOOD RESCUED

12,450 portions

Food Providers
82

NGOs / Recipients
31

Completed Pickups
645

Estimated Waste Avoided
12,450 portions
```

Demo values should be clearly identified as sample/simulated data unless they represent actual measured results.

---

# 34. Risks & Solutions

## Risk 1 — Food Safety

**Problem:** Food may not be safe for consumption.

**Solution:**
- Collect preparation/storage information.
- Show available-until time.
- Add clear safety guidance and disclaimer.
- Allow users to report unsafe listings.

---

## Risk 2 — Recipient Does Not Arrive

**Solution:**
- Pickup confirmation.
- Time limit.
- Volunteer fallback.
- Automatic escalation to another recipient.

---

## Risk 3 — Food Expires Before Pickup

**Solution:**
- Urgency score.
- Countdown.
- Notifications.
- Automatically expire listings.

---

## Risk 4 — Too Many Requests

**Solution:**
- Request queue.
- Quantity allocation.
- Matching score.
- Provider approval.

---

## Risk 5 — Too Little Food

**Solution:**
Allow partial claims.

Example:

```text
Available: 100

NGO A requests: 60
NGO B requests: 40

Total:
100 / 100 claimed
```

---

# 35. Future Features

Future versions could include:

- POS integration
- Automatic surplus detection
- Advanced demand forecasting
- Route optimization
- Verified NGO network
- Volunteer reputation
- Food pickup scheduling
- Multi-city support
- Restaurant impact reports
- Corporate CSR dashboards
- Government/community partnerships
- Mobile application
- WhatsApp notifications
- QR-based pickup confirmation

---

# 36. Final Product Definition

BhojanSetu should allow a food provider to complete this workflow:

```text
I have surplus food
        ↓
Report it
        ↓
Platform finds nearby recipients
        ↓
Recipients receive notification
        ↓
Recipient requests food
        ↓
Provider accepts
        ↓
Volunteer/recipient collects it
        ↓
Food reaches people
        ↓
Platform records the impact
```

### Core Value Proposition

> **"Turn surplus food into an opportunity to feed someone instead of letting it become waste."**

---

# 37. Hackathon Rule Compliance

This PRD is a planning document.

According to the provided hackathon rulebook:

- The event is a 24-hour build-from-scratch event.
- Actual submission code must be built during the event window.
- Pre-existing projects cannot be submitted.
- Full pre-made templates or purchased clone kits cannot be the primary submission.
- Fully AI-generated submissions without genuine team understanding/modification are not allowed.
- Open-source libraries, frameworks, SDKs, pretrained models, public APIs, public datasets, and AI coding assistants are allowed under the stated rules.
- Planning, architecture, and idea development can be done before the event.
- Git commit history must be timestamped within the event window.
- The README must document the tech stack and third-party tools/APIs/datasets used.
- AI/API/dataset usage must be disclosed/attributed where required.

The actual event problem statement is released by the organizers at the scheduled time, so this PRD should be treated as a practice concept unless the released problem statement matches it.

---

# 38. One-Line Pitch

> **BhojanSetu connects surplus food from restaurants, bhandaras, canteens and events with nearby people and organizations who can use it, using smart matching and AI to rescue food before it becomes waste.**
=======
# Food Rescue Project

A platform to manage and d    istribute surplus food to prevent wastage and help communities.
 new changes my cp
>>>>>>> vedant
