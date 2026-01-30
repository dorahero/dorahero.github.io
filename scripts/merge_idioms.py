import csv
import os

def merge():
    idioms_path = 'src/data/idioms.csv'
    processed_path = 'src/data/idioms_processed.csv'
    output_path = 'src/data/idioms_with_defs.csv'
    
    if not os.path.exists(idioms_path) or not os.path.exists(processed_path):
        print("One or more input files not found.")
        return

    # Load common usage flags from idioms.csv
    # Format: term, common (true/false)
    common_map = {}
    try:
        with open(idioms_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                term = row.get('成語', '').strip()
                is_common = row.get('常用', '').lower() == 'true'
                if term:
                    common_map[term] = is_common
    except Exception as e:
        print(f"Error reading idioms.csv: {e}")
        return

    # Load definitions from idioms_processed.csv and merge
    # Format: term, definition
    merged_data = []
    
    try:
        with open(processed_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                term = row.get('term', '').strip()
                definition = row.get('definition', '').strip()
                
                if term:
                    # Check if it was marked as common in the original file
                    is_common = common_map.get(term, False)
                    # We keep this entry because it exists in the 'processed' (MOE) list, 
                    # effectively filtering to only MOE recognized idioms.
                    merged_data.append({
                        'term': term,
                        'definition': definition,
                        'is_common': str(is_common).lower()
                    })
    except Exception as e:
        print(f"Error reading idioms_processed.csv: {e}")
        return

    # Write output
    try:
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['term', 'definition', 'is_common']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(merged_data)
        print(f"Successfully merged {len(merged_data)} idioms to {output_path}")
    except Exception as e:
        print(f"Failed to write output: {e}")

if __name__ == '__main__':
    merge()
