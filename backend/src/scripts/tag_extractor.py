from keybert import KeyBERT

def extract_keywords(text):
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words=None, top_n=5)
    return [kw for kw, _ in keywords]

if __name__ == "__main__":
    import sys
    text = sys.argv[1]
    keywords = extract_keywords(text)
    print(",".join(keywords))
