import pandas as pd
from rapidfuzz import fuzz
import string
import sys
import json
import os

# Load and preprocess your dataset
data = pd.read_csv("C:\\Users\\HP\\Desktop\\myntra\\myntra-weforshe\\backend\\src\\scripts\\data.csv")

# Helper function to preprocess text
def preprocess(text):
    if pd.isnull(text):
        return ""
    text = text.lower().translate(str.maketrans('', '', string.punctuation))
    return text

data["name_processed"] = data["product_name"].apply(preprocess)

def get_products(keywords):
    results = []
    count = 0  # Initialize a counter for the number of products fetched
    for keyword in keywords:
        keyword_processed = preprocess(keyword)
        for index, row in data.iterrows():
            score_name = fuzz.partial_ratio(keyword_processed, row["name_processed"])
            if score_name >= 80:
                results.append({"keyword": keyword, "url": row["product_link"], "image": row["img_link"]})
                count += 1  # Increment the counter
                if count >= 4:
                    return results  # Stop fetching after 10 products
    return results

if __name__ == "__main__":
    # Read tags from command line argument
    tags = sys.argv[1]
    tags_list = tags.split(",")  # Split the comma-separated string into a list of tags
    products = get_products(tags_list)

    # Write results to a file
    output_file = os.path.join(os.path.dirname(__file__), 'products_output.json')
    with open(output_file, "w") as f:
        json.dump(products, f, indent=2)
