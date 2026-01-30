import csv
import os

def process():
    source_path = 'src/data/成語大全(31648個成語解釋).txt'
    output_path = 'src/data/idioms_processed.csv'
    
    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found.")
        return

    # Try CP950 first, then fallback to others if needed, but iconv suggested Big5-compatible
    try:
        with open(source_path, 'r', encoding='cp950', errors='replace') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Failed to read file: {e}")
        return
    
    data = []
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # User requested explicitly: "每一行的前四個" (First 4 chars of each line)
        # We will extract that as the 'term'.
        # We also attempt to extract definition for completeness.
        idiom = line[:4].strip()
        
        # Simple definition extraction logic
        definition = ""
        if '釋義：' in line:
            parts = line.split('釋義：', 1)
            if len(parts) > 1:
                def_part = parts[1]
                # Definition segments typically end before '出處：' or '示例：'
                end_markers = ['出處：', '示例：', '★']
                min_idx = len(def_part)
                for marker in end_markers:
                    idx = def_part.find(marker)
                    if idx != -1 and idx < min_idx:
                        min_idx = idx
                definition = def_part[:min_idx].strip()
        
        # If we have an idiom, add it
        if idiom:
            data.append([idiom, definition])

    try:
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['term', 'definition'])
            writer.writerows(data)
        print(f"Successfully processed {len(data)} idioms to {output_path}")
    except Exception as e:
        print(f"Failed to write output: {e}")

if __name__ == '__main__':
    process()
