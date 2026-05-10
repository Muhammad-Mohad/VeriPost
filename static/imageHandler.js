const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(btn => btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        $('tab-' + btn.dataset.tab).classList.add('active');
    }));

    const ta = $('newsInput');
    const cc = $('charCount');
    if (ta && cc) {
        const update = () => cc.textContent = `${ta.value.length} / 50000`;
        ta.addEventListener('input', update);
        update();
    }
});

async function handleImage(input) {
    const file = input.files[0];
    const status = $('ocrStatus');
    const textArea = $('newsInput');
    if (!file) return;

    status.textContent = 'Initializing OCR engine...';
    textArea.value = '';

    try {
        const result = await Tesseract.recognize(file, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    status.textContent = `Scanning Image: ${Math.round(m.progress * 100)}%`;
                }
            }
        });
        textArea.value = result.data.text.trim();
        status.textContent = '✅ Text extracted. Switch to Text tab to analyze.';
        textArea.dispatchEvent(new Event('input'));
        document.querySelector('.tab-btn[data-tab="text"]').click();
    } catch (e) {
        status.textContent = '❌ Error reading image. Ensure text is clear.';
        console.error(e);
    }
}

function renderResult(data) {
    const resultDiv = $('result');
    if (!data || !data.prediction) {
        resultDiv.innerHTML = '<span class="hint">No result.</span>';
        return;
    }

    const cls = data.prediction.toUpperCase();
    let html = `
        <div class="prediction-box ${cls}">${cls}</div>
        <div class="confidence-row">
            <span class="confidence">Confidence: <b>${data.confidence_score}%</b></span>
            <span class="confidence">Real probability: <b>${data.real_probability}%</b></span>
        </div>
        <div class="meter"><div class="meter-fill ${cls}" style="width:${data.real_probability}%"></div></div>
    `;

    if (data.language_warning) {
        html += `<div class="warn">${data.language_warning}</div>`;
    }

    if (data.explanation) {
        const tr = data.explanation.top_real || [];
        const tf = data.explanation.top_fake || [];
        html += '<div class="explain-grid">';
        html += '<div><h4>Pushed REAL</h4>' + (tr.length
            ? tr.map(w => `<span class="chip real">${w.word} <em>${w.weight}</em></span>`).join('')
            : '<span class="hint">none</span>') + '</div>';
        html += '<div><h4>Pushed FAKE</h4>' + (tf.length
            ? tf.map(w => `<span class="chip fake">${w.word} <em>${w.weight}</em></span>`).join('')
            : '<span class="hint">none</span>') + '</div>';
        html += '</div>';
    }

    if (data.sentences && data.sentences.length) {
        html += '<h4>Sentence breakdown</h4><div class="sentences">';
        data.sentences.forEach(s => {
            const c = s.prediction.toUpperCase();
            html += `<div class="sentence ${c}"><span class="badge ${c}">${s.real_probability}%</span> ${escapeHtml(s.text)}</div>`;
        });
        html += '</div>';
    }

    if (data.source_url) {
        html += `<p class="hint">Source: <a href="${data.source_url}" target="_blank" rel="noopener">${data.source_url}</a></p>`;
    }

    resultDiv.innerHTML = html;
}

function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function checkNews() {
    const text = $('newsInput').value.trim();
    const resultDiv = $('result');
    if (!text) {
        resultDiv.innerHTML = '<span class="hint">Please enter or extract some text first.</span>';
        return;
    }
    if (text.length > 50000) {
        resultDiv.innerHTML = '<span class="hint">Text exceeds 50,000 character limit.</span>';
        return;
    }
    resultDiv.innerHTML = '<i>Analyzing linguistic patterns...</i>';

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                explain: true,
                sentences: $('sentenceMode').checked,
            })
        });
        const data = await response.json();
        if (!response.ok) {
            resultDiv.innerHTML = `<span class="hint">${data.error || 'Request failed.'}</span>`;
            return;
        }
        renderResult(data);
    } catch (e) {
        resultDiv.innerHTML = 'Server error. Is the Flask backend running?';
    }
}

async function checkUrl() {
    const url = $('urlInput').value.trim();
    const resultDiv = $('result');
    if (!url) {
        resultDiv.innerHTML = '<span class="hint">Enter a URL.</span>';
        return;
    }
    resultDiv.innerHTML = '<i>Fetching article and analyzing...</i>';

    try {
        const response = await fetch('/predict-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
                sentences: $('urlSentenceMode').checked,
            })
        });
        const data = await response.json();
        if (!response.ok) {
            resultDiv.innerHTML = `<span class="hint">${data.error || 'Request failed.'}</span>`;
            return;
        }
        if (data.extracted_text) {
            $('newsInput').value = data.extracted_text;
            $('newsInput').dispatchEvent(new Event('input'));
        }
        renderResult(data);
    } catch (e) {
        resultDiv.innerHTML = 'Server error during URL fetch.';
    }
}

async function checkBatch() {
    const fileInput = $('batchInput');
    const out = $('batchResult');
    if (!fileInput.files.length) {
        out.innerHTML = '<span class="hint">Choose a CSV file first.</span>';
        return;
    }
    out.innerHTML = '<i>Processing batch...</i>';
    const fd = new FormData();
    fd.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/predict-batch', { method: 'POST', body: fd });
        const data = await response.json();
        if (!response.ok) {
            out.innerHTML = `<span class="hint">${data.error || 'Batch failed.'}</span>`;
            return;
        }
        let html = `<div class="batch-summary">
            <span>Total: <b>${data.total}</b></span>
            <span class="real">REAL: ${data.real_count}</span>
            <span class="fake">FAKE: ${data.fake_count}</span>
            <button class="secondary-btn" onclick='downloadBatchCsv(${JSON.stringify(JSON.stringify(data.rows))})'>Download CSV</button>
        </div>`;
        html += '<div class="batch-rows">';
        data.rows.slice(0, 50).forEach(r => {
            const c = r.prediction.toUpperCase();
            html += `<div class="sentence ${c}"><span class="badge ${c}">${r.real_probability}%</span> ${escapeHtml(r.snippet)}</div>`;
        });
        html += '</div>';
        if (data.rows.length > 50) {
            html += `<p class="hint">Showing first 50 of ${data.rows.length}. Download CSV for full results.</p>`;
        }
        out.innerHTML = html;
    } catch (e) {
        out.innerHTML = 'Server error during batch processing.';
    }
}

function downloadBatchCsv(jsonStr) {
    const rows = JSON.parse(jsonStr);
    const header = ['index', 'prediction', 'real_probability', 'confidence', 'snippet'];
    const lines = [header.join(',')];
    rows.forEach(r => {
        const cells = header.map(h => {
            const v = String(r[h] ?? '');
            return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
        });
        lines.push(cells.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'veripost-batch.csv';
    a.click();
    URL.revokeObjectURL(a.href);
}
