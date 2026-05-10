const $a = (id) => document.getElementById(id);
let pollTimer = null;

function authHeaders() {
    const t = $a('adminToken').value.trim();
    return t ? { 'X-Admin-Token': t, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function loadVersions() {
    try {
        const res = await fetch('/admin/versions', { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) {
            $a('versionsList').innerHTML = `<span class="hint">${data.error || 'Failed.'}</span>`;
            return;
        }
        const cur = data.current || {};
        $a('currentMeta').innerHTML = `
            <h3>Current Model</h3>
            <p><b>Version:</b> ${cur.version || 'n/a'}</p>
            <p><b>Accuracy:</b> ${cur.accuracy ?? 'n/a'}%</p>
            <p><b>CV Mean:</b> ${cur.cv_mean ?? 'n/a'}%</p>
            <p><b>Trained at:</b> ${cur.trained_at || 'n/a'}</p>
            <p><b>Samples:</b> ${cur.n_samples ?? 'n/a'}</p>
        `;
        const list = data.versions || [];
        $a('versionsList').innerHTML = list.length
            ? list.map(v => `
                <div class="version-row">
                    <span><b>${v.version}</b> &middot; ${v.accuracy}% &middot; ${v.trained_at}</span>
                    <button class="secondary-btn" onclick="activate('${v.version}')">Activate</button>
                </div>`).join('')
            : '<span class="hint">No versions yet.</span>';
    } catch (e) {
        $a('versionsList').innerHTML = '<span class="hint">Network error.</span>';
    }
}

async function activate(version) {
    const res = await fetch('/admin/activate', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ version }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || 'Failed'); return; }
    loadVersions();
}

async function startRetrain() {
    const version = $a('newVersion').value.trim() || null;
    const res = await fetch('/admin/retrain', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ version }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || 'Failed'); return; }
    $a('trainLog').textContent = 'Training started...';
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(pollStatus, 3000);
}

async function pollStatus() {
    const res = await fetch('/admin/train-status', { headers: authHeaders() });
    const data = await res.json();
    $a('trainLog').textContent = `Running: ${data.running}\nLast version: ${data.last_version || 'n/a'}\n\n${data.last_log || ''}`;
    if (!data.running && pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
        loadVersions();
    }
}

document.addEventListener('DOMContentLoaded', loadVersions);
