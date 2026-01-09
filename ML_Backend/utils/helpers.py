import pandas as pd

def normalize_place(s):
    if s is None or s == "":
        return ""
    return str(s).strip().lower()

def recency_weight(date_str, min_date, max_date):
    if pd.isna(date_str):
        return 0.0
    try:
        d = pd.to_datetime(date_str)
        total_days = (max_date - min_date).days
        if total_days == 0:
            return 1.0
        return (d - min_date).days / total_days
    except (ValueError, TypeError):
        return 0.0

def get_all_user_places(user_doc):
    if not user_doc:
        return set()
    
    places = set()
    
    places_visited = user_doc.get('placesVisited', [])
    if isinstance(places_visited, list):
        for place in places_visited:
            if place:
                places.add(normalize_place(place))
    
    recently_visited = user_doc.get('recentlyVisited', [])
    if isinstance(recently_visited, list):
        for place in recently_visited:
            if place:
                places.add(normalize_place(place))
    
    return places

def get_recently_visited_places(user, trips_df):
    recently_visited = user.get('recentlyVisited', [])
    places_visited = user.get('placesVisited', [])
    
    if recently_visited:
        return recently_visited[0]
    
    if places_visited:
        return places_visited[-1]
    
    return None
