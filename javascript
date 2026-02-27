let concerns = [
    { id: 1, type: "Concern", text: "The air conditioning in Room 304 is dripping water.", date: new Date().toISOString(), status: "Approved" },
    { id: 2, type: "Request", text: "We need more updated books in the science section.", date: new Date().toISOString(), status: "Approved" }
];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId + '-page').classList.add('active');
    if (pageId === 'admin') renderAdmin();
    window.scrollTo(0, 0);
}

function handleFormSubmit(event) {
    event.preventDefault();
    const type = document.getElementById('message-type').value;
    const text = document.getElementById('message-text').value;
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerText = "Sending...";
    setTimeout(() => {
        concerns.unshift({ id: Date.now(), type, text, date: new Date().toISOString(), status: "Pending" });
        event.target.reset();
        btn.disabled = false;
        btn.innerText = "Send Anonymously";
        showToast("Message Sent!");
    }, 1000);
}

function handleLogin(event) {
    event.preventDefault();
    if (document.getElementById('admin-password').value === 'admin123') {
        showPage('admin');
        document.getElementById('admin-password').value = '';
    } else {
        alert("Access Denied");
    }
}

function logout() { showPage('home'); }

function renderAdmin() {
    const pendingList = document.getElementById('pending-list');
    const historyList = document.getElementById('history-list');
    const pending = concerns.filter(c => c.status === 'Pending');
    const processed = concerns.filter(c => c.status !== 'Pending');
    
    document.getElementById('pending-count').innerText = `${pending.length} Pending`;
    pendingList.innerHTML = pending.length ? pending.map(c => `
        <div class="message-card">
            <div class="message-card-header"><span>${c.type}</span><span>${new Date(c.date).toLocaleDateString()}</span></div>
            <div class="message-card-body"><p>${c.text}</p>
                <div class="message-actions">
                    <button class="btn-sm btn-reject" onclick="process(${c.id}, 'Rejected')">Reject</button>
                    <button class="btn-sm btn-approve" onclick="process(${c.id}, 'Approved')">Approve</button>
                </div>
            </div>
        </div>`).join('') : '<div style="text-align:center;padding:40px;color:#64748b">No pending concerns.</div>';

    historyList.innerHTML = processed.map(c => `
        <div class="history-item">
            <div style="display:flex;justify-content:space-between">
                <span class="badge" style="background:${c.status==='Approved'?'#dcfce7':'#fee2e2'}">${c.status}</span>
                <span style="font-size:11px">${new Date(c.date).toLocaleDateString()}</span>
            </div>
            <p style="font-size:13px;color:#64748b">${c.text}</p>
        </div>`).join('');
}

function process(id, status) {
    const idx = concerns.findIndex(c => c.id === id);
    if (idx !== -1) { concerns[idx].status = status; renderAdmin(); showToast(`Message ${status}`); }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'),
