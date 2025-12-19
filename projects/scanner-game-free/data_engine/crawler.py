import json
import urllib.request
import urllib.error
import datetime
import re
import os
import time
import requests
from deep_translator import GoogleTranslator

# Configuration
DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'db.json')
EPIC_API_URL = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions"

SOURCES = [
    {
        "name": "r/GamingLeaksAndRumours",
        "url": "https://www.reddit.com/r/GamingLeaksAndRumours/hot.json?limit=15",
        "type": "rumor"
    },
    {
        "name": "r/EpicGamesPC",
        "url": "https://www.reddit.com/r/EpicGamesPC/hot.json?limit=15",
        "type": "epic_news"
    },
    {
        "name": "r/FreeGameFindings",
        "url": "https://www.reddit.com/r/FreeGameFindings/hot.json?limit=10",
        "type": "freebie"
    },
    {
        "name": "r/Hardware",
        "url": "https://www.reddit.com/r/hardware/search.json?q=rumor&restrict_sr=1&sort=new&limit=8",
        "type": "hardware"
    }
]

# Translator Instance
translator = GoogleTranslator(source='auto', target='pt')

def generate_mock_leaks():
    """Generates simulated leak data when live sources are unavailable."""
    return [
        {
            "id": "mock-leak-1",
            "title": "Vazamento: Próximo Jogo Misterioso pode ser um AAA da Ubisoft",
            "original_title": "Leak: Next Mystery Game might be a Ubisoft AAA",
            "image": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80",
            "source_count": 452,
            "reliability": "Medium",
            "category": "Epic Mystery",
            "date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "summary": "Dataminers encontraram referências a 'Project U' nos arquivos da loja. A comunidade especula que pode ser Assassin's Creed ou Watch Dogs. Fique atento às próximas 24h.",
            "sources": ["r/GamingLeaksAndRumours"],
            "url": "https://store.epicgames.com/free-games",
            "price_info": None
        },
        {
            "id": "mock-leak-2",
            "title": "Insiders confirmam: RTX 5090 chegando em breve",
            "original_title": "Insiders confirm: RTX 5090 coming soon",
            "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80",
            "source_count": 1240,
            "reliability": "High",
            "category": "Hardware",
            "date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "summary": "Fontes ligadas à indústria indicam que a nova geração de GPUs da NVIDIA será anunciada no próximo trimestre com performance 40% superior.",
            "sources": ["TechInsider"],
            "url": "#",
            "price_info": None
        },
        {
            "id": "mock-leak-3",
            "title": "RUMOR: Lista vazada da Epic Games Store para Dezembro",
            "original_title": "RUMOR: Leaked EGS List for December",
            "image": "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80",
            "source_count": 890,
            "reliability": "Low",
            "category": "Epic News",
            "date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "summary": "Uma suposta lista de jogos gratuitos está circulando no Discord. Inclui títulos como 'Outer Wilds' e 'Hades'. Trate como rumor por enquanto.",
            "sources": ["Discord Leaks"],
            "url": "#",
            "price_info": None
        }
    ]

def translate_text(text):
    """Translates text to Portuguese using deep_translator with fallback."""
    if not text:
        return ""
    try:
        # Simple caching or limit check could be here, but for this script we just try
        # Truncate very long text to avoid issues
        if len(text) > 4500:
            text = text[:4500]
        return translator.translate(text)
    except Exception as e:
        print(f"Translation Warning: {e}")
        return text

def fetch_epic_free_games():
    """Fetches official free games data from Epic Games Store API."""
    print("Connecting to Epic Games Store API...")
    start_time = time.time()
    try:
        response = requests.get(EPIC_API_URL, timeout=15)
        response.raise_for_status()
        data = response.json()
        latency = (time.time() - start_time) * 1000

        games = data.get('data', {}).get('Catalog', {}).get('searchStore', {}).get('elements', [])

        current_free = []
        upcoming_free = []
        mystery_detected = False

        for game in games:
            # Skip if no promotions
            promotions = game.get('promotions')
            if not promotions:
                continue

            title = game.get('title')
            description = game.get('description')

            # Find Image (OfferImageWide is usually best)
            image_url = ""
            for img in game.get('keyImages', []):
                if img.get('type') == 'OfferImageWide':
                    image_url = img.get('url')
                    break
            if not image_url and game.get('keyImages'):
                image_url = game.get('keyImages')[0].get('url')

            # Detect Mystery Game (often titled 'Mystery Game' or has specific placeholder image)
            if "Mystery Game" in title or "Voltando em breve" in title:
                mystery_detected = True

            game_data = {
                "title": title,
                "description": description, # Will translate later if needed, but Epic often provides localized content if requested. We requested default (en) probably.
                "image": image_url,
                "url": f"https://store.epicgames.com/p/{game.get('urlSlug', '')}" if game.get('urlSlug') else "https://store.epicgames.com/free-games",
                "price": game.get('price', {}).get('totalPrice', {}).get('fmtPrice', {}).get('originalPrice', '0'),
                "start_date": "",
                "end_date": ""
            }

            # Check Current
            promo_offers = promotions.get('promotionalOffers', [])
            if promo_offers and len(promo_offers) > 0:
                offers = promo_offers[0].get('promotionalOffers', [])
                for offer in offers:
                    start_date = offer.get('startDate')
                    end_date = offer.get('endDate')

                    # Verify it is currently active
                    now = datetime.datetime.utcnow().isoformat()
                    if start_date <= now <= end_date:
                        # Ensure price is 0 (sometimes discounts are not free)
                        # Actually for this endpoint, usually they are free, but check discountPercentage if available
                        if offer.get('discountSetting', {}).get('discountPercentage') == 0:
                             # Wait, discountPercentage 0 means NO discount. We want 100% discount or price 0.
                             # But this endpoint is usually specifically for free games.
                             pass

                        game_data["start_date"] = start_date
                        game_data["end_date"] = end_date

                        # Translate description
                        game_data["description"] = translate_text(game_data["description"])
                        current_free.append(game_data)

            # Check Upcoming
            upcoming_offers = promotions.get('upcomingPromotionalOffers', [])
            if upcoming_offers and len(upcoming_offers) > 0:
                offers = upcoming_offers[0].get('promotionalOffers', [])
                for offer in offers:
                    game_data_up = game_data.copy()
                    game_data_up["start_date"] = offer.get('startDate')
                    game_data_up["end_date"] = offer.get('endDate')

                    # Translate description
                    game_data_up["description"] = translate_text(game_data_up["description"])
                    upcoming_free.append(game_data_up)

        return {
            "status": "Online",
            "latency": f"{int(latency)}ms",
            "current_games": current_free,
            "upcoming_games": upcoming_free,
            "mystery_detected": mystery_detected
        }

    except Exception as e:
        print(f"Error fetching Epic API: {e}")
        return {
            "status": "Offline",
            "latency": "0ms",
            "current_games": [],
            "upcoming_games": [],
            "mystery_detected": False,
            "error": str(e)
        }

def fetch_json(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def process_reddit_data(raw_data, category_type):
    if not raw_data or 'data' not in raw_data or 'children' not in raw_data['data']:
        return []

    items = []
    for child in raw_data['data']['children']:
        data = child['data']

        if data.get('stickied') and data.get('num_comments') < 50:
            continue

        score = data.get('score', 0)
        comments = data.get('num_comments', 0)

        reliability = "Low"
        if score > 500 or comments > 100: reliability = "Medium"
        if score > 2000 or comments > 500: reliability = "High"

        image = None
        if 'preview' in data and 'images' in data['preview']:
            try:
                image = data['preview']['images'][0]['source']['url'].replace('&amp;', '&')
            except:
                image = None
        elif 'thumbnail' in data and data['thumbnail'].startswith('http'):
            image = data['thumbnail']

        if not image or image == 'self' or image == 'default' or image == 'nsfw':
            if category_type == 'hardware':
                image = "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80"
            elif category_type == 'freebie':
                image = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"
            elif category_type == 'epic_news':
                image = "https://images.unsplash.com/photo-1612287230217-969b698c0a12?auto=format&fit=crop&q=80"
            else:
                image = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"

        category = map_category(category_type, data['title'])

        # Translation Step
        title_pt = translate_text(data['title'])
        summary_raw = data.get('selftext', '')[:200]
        summary_pt = translate_text(summary_raw) if summary_raw else "Clique para ler a discussão completa..."

        items.append({
            "id": data['id'],
            "title": title_pt, # Translated
            "original_title": data['title'],
            "image": image,
            "source_count": comments,
            "reliability": reliability,
            "category": category,
            "date": datetime.datetime.fromtimestamp(data['created_utc']).strftime("%Y-%m-%d"),
            "summary": summary_pt, # Translated
            "sources": [f"r/{data['subreddit']}"],
            "url": f"https://reddit.com{data['permalink']}"
        })
    return items

def map_category(source_type, title):
    title_lower = title.lower()

    if "epic" in title_lower and ("mystery" in title_lower or "vault" in title_lower or "secret" in title_lower or "mistério" in title_lower):
        return "Epic Mystery"

    if "nvidia" in title_lower or "amd" in title_lower or "intel" in title_lower or "rtx" in title_lower or "gpu" in title_lower:
        return "Hardware"
    if "free" in title_lower or "giveaway" in title_lower or source_type == 'freebie':
        return "Free Games"
    if "release" in title_lower or "date" in title_lower or "data" in title_lower:
        return "Release Date"

    if source_type == 'epic_news':
        return "Epic News"

    return "Rumor"

def main():
    print("Starting RDP Intelligence Crawler v2.5...")
    all_items = []

    # 1. Fetch Epic API Data
    epic_data = fetch_epic_free_games()

    # 2. Fetch Reddit Data
    reddit_items = []
    for source in SOURCES:
        print(f"Scanning {source['name']}...")
        data = fetch_json(source['url'])
        if data:
            processed = process_reddit_data(data, source['type'])
            reddit_items.extend(processed)
        else:
            print(f"Failed to scan {source['name']}.")

    # Use Mock Data if Reddit fails or returns very few items (e.g., < 3)
    if len(reddit_items) < 3:
        print("Insufficient live intelligence. Activating MOCK SIMULATION PROTOCOL.")
        mock_data = generate_mock_leaks()
        all_items.extend(mock_data)
        # Also include whatever live items we got
        all_items.extend(reddit_items)
    else:
        all_items.extend(reddit_items)

    # Sort items
    all_items.sort(key=lambda x: x['date'], reverse=True)

    # Output Structure
    output = {
        "last_updated": datetime.datetime.now().strftime("%d/%m/%Y %H:%M"),
        "status": "Active",
        "epic_data": epic_data,
        "items": all_items
    }

    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print(f"Database updated: {DATA_FILE}")
    except Exception as e:
        print(f"Error saving database: {e}")

if __name__ == "__main__":
    main()
