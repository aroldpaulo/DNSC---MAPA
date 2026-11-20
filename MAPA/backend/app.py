"""
MAPA – Python backend (Flask) – PLACEHOLDER

What is already done:
  - serves index.html, map.html and the assets folder
  - reads GOOGLE_MAPS_API_KEY from backend/.env
  - API routes exist but only return a "not implemented" message

What YOU write: the functions marked TODO.

Run it:
  cd backend
  pip install -r requirements.txt
  copy .env.example to .env and put your key in it
  python app.py            ->  http://127.0.0.1:5000
"""
import os
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent          # .../MAPA/backend
SITE_DIR = BASE_DIR.parent                          # .../MAPA  (index.html, map.html, assets/)

load_dotenv(BASE_DIR / ".env")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

app = Flask(__name__, static_folder=None)


# ===================== PAGES (already done) =====================
@app.route("/")
def home():
    return send_from_directory(SITE_DIR, "index.html")


@app.route("/map")
@app.route("/map.html")
def map_page():
    return send_from_directory(SITE_DIR, "map.html")


@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(SITE_DIR / "assets", filename)


# ===================== API (placeholders) =====================
def not_implemented(name):
    """Every placeholder route answers with this until you write it."""
    return jsonify({"implemented": False, "message": f"TODO: write {name}()"}), 501


@app.route("/api/config")
def api_config():
    """TODO: decide what the browser needs.
    The Maps JavaScript key is visible in the browser by design, so RESTRICT it
    in Google Cloud Console (HTTP referrers + only the APIs you use).
    Currently returns the key from .env (empty if you have not set it)."""
    return jsonify({"implemented": True, "apiKey": GOOGLE_MAPS_API_KEY})


@app.route("/api/campuses")
def api_campuses():
    """TODO: return the list of campuses (name, lat, lng)."""
    return not_implemented("api_campuses")


@app.route("/api/search")
def api_search():
    """TODO: search buildings/offices.  Query: /api/search?q=library&campus=main"""
    query = request.args.get("q", "")
    campus = request.args.get("campus", "")
    return not_implemented("api_search")


@app.route("/api/directions")
def api_directions():
    """TODO: directions.  Query: /api/directions?from=...&to=...&mode=WALKING"""
    origin = request.args.get("from", "")
    destination = request.args.get("to", "")
    mode = request.args.get("mode", "WALKING")
    return not_implemented("api_directions")


if __name__ == "__main__":
    app.run(debug=True)
