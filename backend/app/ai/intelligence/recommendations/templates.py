"""
templates.py — IE-6 Recommendation Templates

Single source of truth mapping canonical categories to default department
assignments, actions, and base templates.
"""

# Maps canonical categories to department and action templates
RECOMMENDATION_TEMPLATES: dict[str, dict[str, str]] = {
    "Water Supply": {
        "department": "Department of Water Resources & Sanitation",
        "action_template": "Inspect water treatment/distribution systems and restore regular supply to {locality}.",
        "reason_template": "Resolve severe water supply issues in {locality} to prevent public distress.",
    },
    "Road Infrastructure": {
        "department": "Public Works Department (PWD)",
        "action_template": "Conduct road surveys and initiate pothole/repair works on affected routes in {locality}.",
        "reason_template": "Address critical safety and structural damage to road infrastructure in {locality}.",
    },
    "Electricity": {
        "department": "State Electricity Board / Power Distribution Company",
        "action_template": "Audit power grid stability and repair damaged lines/streetlights in {locality}.",
        "reason_template": "Ensure reliable electricity supply and functional street lighting to improve safety in {locality}.",
    },
    "Sanitation": {
        "department": "Municipal Corporation / Sanitation Department",
        "action_template": "Clear sewage blockages and clean public facilities in {locality}.",
        "reason_template": "Address public hygiene and health concerns related to sanitation systems in {locality}.",
    },
    "Healthcare": {
        "department": "Ministry of Health & Family Welfare / District Health Office",
        "action_template": "Deploy emergency medical resources or audit local health facilities in {locality}.",
        "reason_template": "Resolve immediate public healthcare access issues in {locality}.",
    },
    "Education": {
        "department": "Department of School Education & Literacy",
        "action_template": "Audit school infrastructure and fill critical teacher vacancies in {locality}.",
        "reason_template": "Address education facility standards and accessibility in {locality}.",
    },
    "Public Safety": {
        "department": "Home Department / Local Police Authority",
        "action_template": "Increase patrolling and inspect/install functional CCTV surveillance systems in {locality}.",
        "reason_template": "Enhance security and address public safety threats in {locality}.",
    },
    "Drainage & Flooding": {
        "department": "Irrigation & Flood Control Department / Municipal Drainage Wing",
        "action_template": "Dredge blocked storm drains and build flood barriers in affected zones of {locality}.",
        "reason_template": "Mitigate immediate flooding and waterlogging risks to prevent property damage in {locality}.",
    },
    "Waste Management": {
        "department": "Municipal Waste Management Division",
        "action_template": "Establish daily waste clearance routines and clear illegal dumping sites in {locality}.",
        "reason_template": "Prevent open waste dumping and clean environmental hazards in {locality}.",
    },
    "Green Spaces": {
        "department": "Forest & Environment Department / Parks Wing",
        "action_template": "Initiate park maintenance, tree pruning, or local plantation drives in {locality}.",
        "reason_template": "Improve environmental quality and maintain green spaces in {locality}.",
    },
    "Housing": {
        "department": "Housing & Urban Development Authority",
        "action_template": "Inspect shelter standards and coordinate affordable housing support in {locality}.",
        "reason_template": "Provide adequate shelter and sanitation access to low-income residents in {locality}.",
    },
    "Transportation": {
        "department": "Department of Transport / Metropolitan Transit Authority",
        "action_template": "Adjust public transit frequency or repair transit stops serving {locality}.",
        "reason_template": "Address transport connectivity bottlenecks and route availability issues in {locality}.",
    },
    "Other": {
        "department": "District Collectorate / General Administration Department",
        "action_template": "Investigate citizen grievances and direct to relevant local desk in {locality}.",
        "reason_template": "Examine unclassified civic issue reported in {locality}.",
    },
}

DEFAULT_DEPARTMENT = "District Collectorate"
DEFAULT_ACTION = "Investigate citizen grievances and direct to the local municipal wing."
DEFAULT_REASON = "Examine the reported issue to determine appropriate department assignment."
