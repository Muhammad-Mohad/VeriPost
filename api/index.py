from flask import Flask, request, render_template, jsonify
import pickle

app = Flask(__name__, 
            template_folder='../templates', 
            static_folder='../static')

try:
    model = pickle.load(open('models/model.pkl', 'rb'))
    vectorizer = pickle.load(open('models/tfidfvectorizer.pkl', 'rb'))
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
    app.run()