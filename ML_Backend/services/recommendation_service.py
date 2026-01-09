import random
import pandas as pd
from collections import defaultdict
from database.mongodb import get_user_by_id, get_all_users, get_users_collection
from utils.helpers import normalize_place, recency_weight, get_all_user_places
from config.settings import FALLBACK_RECOMMENDATIONS

def extract_places_from_users(user_ids):
    place_scores = defaultdict(float)
    place_counts = defaultdict(int)
    
    for user_id in user_ids:
        user_doc = get_user_by_id(user_id)
        if user_doc:
            places = get_all_user_places(user_doc)
            for place in places:
                if place:
                    place_scores[place] += 1.0
                    place_counts[place] += 1
    
    return place_scores, place_counts

def get_recommendations_from_group(target_user_id, group_user_ids, trips_df, top_n=7, exclude_places=None):
    if exclude_places is None:
        exclude_places = []

    if not group_user_ids:
        print(f"No group users found for recommendations")
        return []

    print(f"Getting recommendations from {len(group_user_ids)} users")

    target_user = get_user_by_id(target_user_id)
    target_visited = set()
    if target_user:
        target_visited = get_all_user_places(target_user)
    
    exclude_places_norm = set(normalize_place(place) for place in exclude_places)
    all_excluded = target_visited.union(exclude_places_norm)

    place_scores = defaultdict(float)
    
    user_place_scores, _ = extract_places_from_users(group_user_ids)
    
    for place, score in user_place_scores.items():
        if place and place not in all_excluded:
            place_scores[place] += score

    if not trips_df.empty:
        group_trips = trips_df[trips_df['user_id'].isin(group_user_ids)].copy()
        
        if not group_trips.empty:
            place_field = None
            possible_place_fields = ['destination', 'place', 'city', 'location', 'to', 'place_name', 'trip_destination']
            
            for field in possible_place_fields:
                if field in group_trips.columns:
                    place_field = field
                    break
            
            if place_field:
                print(f"Found place field '{place_field}' in trips data")
                group_trips["place_norm"] = group_trips[place_field].apply(normalize_place)
                
                date_field = None
                possible_date_fields = ['updatedAt', 'createdAt', 'trip_date', 'date']
                
                for field in possible_date_fields:
                    if field in group_trips.columns:
                        date_field = field
                        break
                
                if date_field:
                    group_trips["trip_date"] = pd.to_datetime(group_trips[date_field], errors='coerce')
                    min_date = group_trips["trip_date"].min()
                    max_date = group_trips["trip_date"].max()
                    
                    if pd.notna(min_date) and pd.notna(max_date):
                        group_trips["recency"] = group_trips["trip_date"].apply(
                            lambda d: recency_weight(d, min_date, max_date)
                        )
                    else:
                        group_trips["recency"] = 0.5
                else:
                    group_trips["recency"] = 0.5

                for _, row in group_trips.iterrows():
                    place = row["place_norm"]
                    if place and place not in all_excluded:
                        place_scores[place] += 1.0 + row.get("recency", 0.5)

    if not place_scores:
        print("No places found from primary methods, trying broader approach...")
        
        all_users_places = defaultdict(int)
        try:
            all_users = get_all_users()
            for user_doc in all_users:
                user_id = str(user_doc['_id']).strip().lower()
                if user_id in group_user_ids:
                    places = get_all_user_places(user_doc)
                    for place in places:
                        if place and place not in all_excluded:
                            all_users_places[place] += 1
        except Exception as e:
            print(f"Error in broader approach: {e}")
        
        for place, count in all_users_places.items():
            place_scores[place] += count

    if place_scores:
        ranked_places = sorted(place_scores.items(), key=lambda x: x[1], reverse=True)
        recommendations = [place for place, score in ranked_places[:top_n] if place]
        print(f"Generated {len(recommendations)} recommendations from data")
        return recommendations
    
    print("No data-driven recommendations found")
    return []

def get_fallback_recommendations(exclude_places=None, count=7):
    if exclude_places is None:
        exclude_places = []
    
    exclude_places_norm = [normalize_place(place) for place in exclude_places if place]
    
    available_places = [place for place in FALLBACK_RECOMMENDATIONS 
                       if normalize_place(place) not in exclude_places_norm]
    
    if available_places:
        return random.sample(available_places, min(count, len(available_places)))
    return []

def get_age_based_recommendations(user, users_df, trips_df, user_visited_places, top_n=7):
    user_age = user.get('age')
    if user_age is None or users_df.empty:
        return []
    
    age_window = 5
    similar_age_users = users_df[
        (users_df['age'].notna()) &
        (users_df['age'].between(user_age - age_window, user_age + age_window)) &
        (users_df['_id'] != user['_id'])
    ]
    sim_age_ids = similar_age_users['_id'].tolist()
    print(f"Similar age users found: {len(sim_age_ids)}")
    
    if sim_age_ids:
        return get_recommendations_from_group(
            user['_id'], sim_age_ids, trips_df, 
            top_n=top_n, exclude_places=list(user_visited_places)
        )
    return []

def get_co_visitation_recommendations(user, users_df, trips_df, user_visited_places, exclude_places, top_n=7):
    if not user_visited_places or users_df.empty:
        return []
    
    co_visitor_ids = []
    
    try:
        all_users = get_all_users()
        for other_user_doc in all_users:
            other_user_id = str(other_user_doc['_id']).strip().lower()
            if other_user_id == user['_id']:
                continue
            
            other_places = get_all_user_places(other_user_doc)
            
            if user_visited_places.intersection(other_places):
                co_visitor_ids.append(other_user_id)
    
    except Exception as e:
        print(f"Error finding co-visitors: {e}")
    
    print(f"Co-visitor users found: {len(co_visitor_ids)}")
    
    if co_visitor_ids:
        return get_recommendations_from_group(
            user['_id'], co_visitor_ids, trips_df, 
            top_n=top_n, exclude_places=list(user_visited_places) + exclude_places
        )
    return []

def get_city_based_recommendations(user, users_df, trips_df, user_visited_places, exclude_places, top_n=7):
    user_city = normalize_place(user.get('city', ''))
    if not user_city or users_df.empty:
        return []
    
    same_city_users = users_df[
        (users_df['city'].apply(normalize_place) == user_city) &
        (users_df['_id'] != user['_id'])
    ]
    same_city_ids = same_city_users['_id'].tolist()
    print(f"Same city users found: {len(same_city_ids)}")
    
    if same_city_ids:
        return get_recommendations_from_group(
            user['_id'], same_city_ids, trips_df, 
            top_n=top_n, exclude_places=list(user_visited_places) + exclude_places
        )
    return []
