import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier

df = pd.read_csv('data/WELFake_Dataset.csv')

df = df.fillna('') 

df['combined_text'] = df['title'] + " " + df['text']

x = df['combined_text']
y = df['label']

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_df=0.8, max_features=5000)
tfidf_train = tfidf_vectorizer.fit_transform(x_train)
tfidf_test = tfidf_vectorizer.transform(x_test)

pac = SGDClassifier(
    loss='hinge', 
    penalty=None, 
    learning_rate='pa1', 
    eta0=1.0, 
    max_iter=50, 
    random_state=42
)
pac.fit(tfidf_train, y_train)

pickle.dump(pac, open('models/model.pkl', 'wb'))
pickle.dump(tfidf_vectorizer, open('models/tfidfVectorizer.pkl', 'wb'))

accuracy = pac.score(tfidf_test, y_test) * 100
print(f"Model trained. Test Accuracy: {accuracy:.2f}%")