import pandas as pd
import re
import pickle

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix



df = pd.read_csv('data/WELFake_Dataset.csv')


df = df.fillna('')


df['combined_text'] = df['title'] + " " + df['text']


df = df[df['combined_text'].str.len() > 50]



def clean_text(text):
    text = text.lower()

    
    text = re.sub(r'http\S+', '', text)

   
    text = re.sub(r'\d+', '', text)

    
    text = re.sub(r'[^a-zA-Z\s]', '', text)

    text = re.sub(r'\s+', ' ', text).strip()

    return text


df['combined_text'] = df['combined_text'].apply(clean_text)



X = df['combined_text']
y = df['label']



X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)



tfidf_vectorizer = TfidfVectorizer(
    stop_words='english',
    max_df=0.7,
    min_df=2,
    max_features=20000,
    ngram_range=(1, 2),
    sublinear_tf=True
)

tfidf_train = tfidf_vectorizer.fit_transform(X_train)
tfidf_test = tfidf_vectorizer.transform(X_test)



model = LinearSVC()

model.fit(tfidf_train, y_train)



predictions = model.predict(tfidf_test)


accuracy = accuracy_score(y_test, predictions) * 100

print(f"\nModel Accuracy: {accuracy:.2f}%\n")

print("Classification Report:\n")
print(classification_report(y_test, predictions))

print("Confusion Matrix:\n")
print(confusion_matrix(y_test, predictions))


cv_scores = cross_val_score(model, tfidf_train, y_train, cv=5)

print("\nCross Validation Scores:")
print(cv_scores)

print(f"\nAverage CV Accuracy: {cv_scores.mean() * 100:.2f}%")


pickle.dump(model, open('models/model.pkl', 'wb'))
pickle.dump(tfidf_vectorizer, open('models/tfidfVectorizer.pkl', 'wb'))

