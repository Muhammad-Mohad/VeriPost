async function handleImage(input) {
    const file = input.files[0];
    const status = document.getElementById('ocrStatus');
    const textArea = document.getElementById('newsInput');

    if (!file) return;

    status.innerHTML = "Initializing OCR engine...";
    textArea.value = "";
    textArea.placeholder = "Reading text from image... please wait.";

    try {
        const result = await Tesseract.recognize(file, 'eng', {
            logger: m => {
                if(m.status === 'recognizing text') {
                    status.innerHTML = `Scanning Image: ${Math.round(m.progress * 100)}%`;
                }
            }
        });
        
        textArea.value = result.data.text.trim();
        status.innerHTML = "✅ Text extracted successfully!";
        textArea.placeholder = "Paste a news headline...";
    } 
    catch (e) {
        status.innerHTML = "❌ Error reading image. Ensure text is clear.";
        console.error(e);
    }
}

async function checkNews() {
    const text = document.getElementById('newsInput').value;
    const resultDiv = document.getElementById('result');

    if (!text.trim()) {
        resultDiv.innerHTML = "<span style='color: #94a3b8;'>Please enter or extract some text first.</span>";
        return;
    }

    resultDiv.innerHTML = "<i>Analyzing linguistic patterns...</i>";

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        if (data.prediction) {
            const statusClass = data.prediction.toUpperCase(); 
            resultDiv.innerHTML = `
                <div class="prediction-box ${statusClass}">
                    ${statusClass}
                </div>
                <span class="confidence">Linguistic Confidence Score: ${data.confidence_score}</span>
            `;
        } 
        else {
            resultDiv.innerHTML = "Error: Backend processing failed.";
        }
    } 
    catch (error) {
        resultDiv.innerHTML = "Server error. Is the Flask backend running?";
    }
}