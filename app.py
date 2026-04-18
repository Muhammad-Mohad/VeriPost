from flask import Flask, request, render_template, jsonify
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, '..', 'models', 'model.pkl')
vectorizer_path = os.path.join(BASE_DIR, '..', 'models', 'tfidfvectorizer.pkl')

app = Flask(__name__)

try:
    model = pickle.load(open(model_path, 'rb'))
    vectorizer = pickle.load(open(vectorizer_path, 'rb'))
except FileNotFoundError:
    print("Error: Model or Vectorizer files not found.")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    news_text = data.get('text', '')

    if not news_text:
        return jsonify({'error': 'No text provided'}), 400

    transformed_text = vectorizer.transform([news_text])
    
    prediction_num = model.predict(transformed_text)[0]
    
    label = "REAL" if prediction_num == 1 else "FAKE"
    
    confidence = abs(model.decision_function(transformed_text)[0])
    
    return jsonify({
        'prediction': label,
        'confidence_score': round(confidence, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)