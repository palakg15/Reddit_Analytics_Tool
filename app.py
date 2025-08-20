from flask import Flask, jsonify, request
from flask_cors import CORS
import praw

app = Flask(__name__)
CORS(app)

# Replace with your Reddit API credentials
reddit = praw.Reddit(
    client_id="S0DOVf57i5Q13H0oAJ76pg",
    client_secret="bJk3t6fHhCKLsDJaSZ9Kc80gSAI31g",
    user_agent="Reddit-Analyzer" # give a unique name for your project
)

@app.route("/")
def home():
    return jsonify({"message": "Hello from the Flask backend!"})

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "No query provided"}), 400

    results = []
    # Search for the top 5 posts related to the query
    for submission in reddit.subreddit("all").search(query, limit=5):
        results.append({
            "title": submission.title,
            "score": submission.score,
            "num_comments": submission.num_comments,
            "url": submission.url
        })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True)