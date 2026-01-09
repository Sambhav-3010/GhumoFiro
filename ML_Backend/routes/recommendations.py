from flask import Blueprint, request, jsonify
from bson import ObjectId
from database.mongodb import fetch_users_df, fetch_trips_df, get_user_by_id, get_all_users
from utils.helpers import normalize_place, get_all_user_places, get_recently_visited_places
from services.recommendation_service import (
    get_age_based_recommendations,
    get_co_visitation_recommendations,
    get_city_based_recommendations,
    get_fallback_recommendations
)

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/recommend_cities', methods=['GET'])
def recommend_cities_route():
    user_oid_str = request.args.get('id', '').strip().lower()
    if not user_oid_str:
        return jsonify({"error": "Missing user ID parameter"}), 400

    try:
        ObjectId(user_oid_str)
    except Exception:
        return jsonify({"error": "Invalid user ID format"}), 400

    user = get_user_by_id(user_oid_str)
    if user is None:
        return jsonify({"error": "User ID not found"}), 404

    users_df = fetch_users_df()
    trips_df = fetch_trips_df()

    user['_id'] = str(user['_id']).strip().lower()
    user_age = user.get('age')
    user_city = normalize_place(user.get('city', ''))
    user_recent_place = normalize_place(get_recently_visited_places(user, trips_df) or '')
    user_visited_places = get_all_user_places(user)

    top_n = 7
    
    print(f"\n=== RECOMMENDATION DEBUG ===")
    print(f"User ID: {user['_id']}")
    print(f"User age: {user_age}")
    print(f"User city: {user_city}")
    print(f"User recent place: {user_recent_place}")
    print(f"User visited places: {user_visited_places}")
    print(f"Users DF shape: {users_df.shape}")
    print(f"Trips DF shape: {trips_df.shape}")

    sec1 = get_age_based_recommendations(user, users_df, trips_df, user_visited_places, top_n)

    sec2 = get_co_visitation_recommendations(user, users_df, trips_df, user_visited_places, sec1, top_n)

    sec3 = get_city_based_recommendations(user, users_df, trips_df, user_visited_places, sec1 + sec2, top_n)

    print(f"\nData-driven recommendations:")
    print(f"Age-based: {len(sec1)} - {sec1}")
    print(f"Co-visitation: {len(sec2)} - {sec2}")
    print(f"Same city: {len(sec3)} - {sec3}")

    total_data_recs = len(sec1) + len(sec2) + len(sec3)
    
    if total_data_recs == 0:
        print("\nNo data-driven recommendations found, using fallbacks")
        fallback_recs = get_fallback_recommendations(
            exclude_places=list(user_visited_places), count=21
        )
        
        sec1 = fallback_recs[:7] if len(fallback_recs) >= 7 else fallback_recs
        sec2 = fallback_recs[7:14] if len(fallback_recs) >= 14 else []
        sec3 = fallback_recs[14:21] if len(fallback_recs) >= 21 else []
    else:
        all_current_recs = sec1 + sec2 + sec3 + list(user_visited_places)
        
        if not sec1 and total_data_recs < 7:
            sec1 = get_fallback_recommendations(exclude_places=all_current_recs, count=2)
        if not sec2 and total_data_recs < 7:
            sec2 = get_fallback_recommendations(exclude_places=all_current_recs + sec1, count=2)
        if not sec3 and total_data_recs < 7:
            sec3 = get_fallback_recommendations(exclude_places=all_current_recs + sec1 + sec2, count=2)

    print(f"\nFinal recommendations:")
    print(f"Age-based: {len(sec1)} - {sec1}")
    print(f"Co-visitation: {len(sec2)} - {sec2}")  
    print(f"Same city: {len(sec3)} - {sec3}")
    print(f"Total: {len(sec1) + len(sec2) + len(sec3)}")

    response = {
        "user": {
            "recommendations": {
                "based_on_similar_age_group": sec1,
                "based_on_co_visitation": sec2,
                "based_on_same_city": sec3,
            },
        }
    }
    return jsonify(response)

@recommendations_bp.route('/', methods=["GET"])
def home():
    return 'Hello from the recommendation backend!'

@recommendations_bp.route('/debug', methods=['GET'])
def debug_data():
    try:
        users_df = fetch_users_df()
        trips_df = fetch_trips_df()
        
        sample_user = None
        if not users_df.empty:
            for _, user_row in users_df.head(5).iterrows():
                user_doc = get_user_by_id(user_row['_id'])
                if user_doc and (user_doc.get('placesVisited') or user_doc.get('recentlyVisited')):
                    sample_user = user_doc
                    break
        
        return jsonify({
            "users_count": len(users_df),
            "trips_count": len(trips_df),
            "users_columns": list(users_df.columns) if not users_df.empty else [],
            "trips_columns": list(trips_df.columns) if not trips_df.empty else [],
            "sample_user": sample_user,
            "sample_trip": trips_df.head(1).to_dict('records') if not trips_df.empty else None,
            "sample_user_places": list(get_all_user_places(sample_user)) if sample_user else None
        })
    except Exception as e:
        return jsonify({"error": str(e)})
