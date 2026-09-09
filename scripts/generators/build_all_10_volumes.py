# -*- coding: utf-8 -*-
import os
import re
import json

out_dir = os.path.join("src", "data", "encyclopedia")
os.makedirs(out_dir, exist_ok=True)

def count_words(text):
    return len(re.findall(r'[\w\u0600-\u06FF]+', text))

def save_volume(filename, export_name, title_ar, title_en, badge_ar, badge_en, chapters):
    volume_obj = {
        "id": filename.replace(".js", ""),
        "exportName": export_name,
        "titleAr": title_ar,
        "titleEn": title_en,
        "badgeAr": badge_ar,
        "badgeEn": badge_en,
        "chapters": chapters
    }
    file_path = os.path.join(out_dir, filename)
    content = f"// BLEUWI WORLD - 100,000+ Word Authority Encyclopedia\n// Volume: {title_en}\n\nexport const {export_name} = {json.dumps(volume_obj, ensure_ascii=False, indent=2)};\n"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    words = count_words(content)
    print(f"Generated {filename}: {words} words")
    return words

print("Generating 10 Volumes...")
