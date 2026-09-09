# Python Script to generate 100,000+ words across 10 structured volume files for BLEUWI WORLD.
import os
import json
import re

out_dir = os.path.join("src", "data", "encyclopedia")
os.makedirs(out_dir, exist_ok=True)

def count_words(text):
    words = re.findall(r'[\w\u0600-\u06FF]+', text)
    return len(words)

print("Starting generation...")
