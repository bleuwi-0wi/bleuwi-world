import os
import re
import json

out_dir = os.path.join("src", "data", "encyclopedia")
os.makedirs(out_dir, exist_ok=True)

def count_words(text):
    words = re.findall(r'[\w\u0600-\u06FF]+', text)
    return len(words)

print("Starting 100,000+ Word Authority Encyclopedia Generation...")
