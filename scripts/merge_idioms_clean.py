import csv
import os

def process():
    # Input files
    moe_file = 'src/data/idioms_processed.csv' # The validation source (MOE list)
    original_file = 'src/data/idioms.csv'      # The source of 'is_common' flags
    output_file = 'src/data/idioms_clean.csv'  # Final output

    if not os.path.exists(moe_file) or not os.path.exists(original_file):
        print("Input files missing.")
        return

    # 1. Load Common Flags from original file
    # We trust the user's manual markings in idioms.csv
    common_flags = {}
    try:
        with open(original_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Support both potential header names just in case
                term = row.get('成語') or row.get('term')
                common = row.get('常用') or row.get('is_common') or row.get('common')
                
                if term:
                    term = term.strip()
                    is_common = str(common).lower() == 'true'
                    common_flags[term] = is_common
    except Exception as e:
        print(f"Error reading original idioms: {e}")
        return

    # 2. Iterate through MOE list to filter and build final list
    # We only keep idioms that are in the MOE list (idioms_processed.csv).
    # We use a set to deduplicate.
    seen_terms = set()
    final_list = []
    common_count = 0

    try:
        with open(moe_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                term = row.get('term')
                if not term:
                    continue
                
                term = term.strip()
                
                if term in seen_terms:
                    continue
                
                seen_terms.add(term)
                
                # Check if it was marked common in original data
                is_common = common_flags.get(term, False)
                
                # Filter: Remove length 3
                if len(term) == 3:
                    continue

                # Filter: Remove bad characters
                # User specifically asked for "？"
                # We also observed "□" and punctuation like "，" in the data
                bad_chars = ['？', '?', '□', '，', '。', '、']
                if any(char in term for char in bad_chars):
                    continue
                
                # Filter: Remove URLs or garbage
                if term.startswith('http') or term.startswith('www') or 'txt' in term:
                    continue

                # Limit common entries to 100
                if is_common:
                    if common_count < 100:
                        common_count += 1
                    else:
                        is_common = False
                
                final_list.append({
                    '成語': term,
                    '常用': str(is_common).lower()
                })
    except Exception as e:
        print(f"Error reading MOE idioms: {e}")
        return

    # Sort the list by idiom text (Unicode ascending)
    final_list.sort(key=lambda x: x['成語'])

    # 3. Write Output
    try:
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            fieldnames = ['成語', '常用']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(final_list)
        print(f"Successfully wrote {len(final_list)} unique idioms to {output_file}")
    except Exception as e:
        print(f"Error writing output: {e}")

if __name__ == '__main__':
    process()
