// ============================================
// TAROT REQUEST SYSTEM - Local Storage Edition
// ============================================

// --- DOM References ---
const form = document.getElementById('tarotForm');
const formMessage = document.getElementById('formMessage');
const requestsList = document.getElementById('requestsList');

// --- Load requests from localStorage ---
function loadRequests() {
    const stored = localStorage.getItem('tarotRequests');
    return stored ? JSON.parse(stored) : [];
}

// --- Save requests to localStorage ---
function saveRequests(requests) {
    localStorage.setItem('tarotRequests', JSON.stringify(requests));
}

// --- Display all requests ---
function renderRequests() {
    const requests = loadRequests();
    
    if (requests.length === 0) {
        requestsList.innerHTML = `
            <div style="text-align:center;padding:3rem;color:#8a7a6a;">
                🌙 هنوز درخواستی دریافت نشده است
            </div>
        `;
        return;
    }

    // Show newest first
    const sorted = [...requests].reverse();

    requestsList.innerHTML = sorted.map((req, index) => {
        const realIndex = requests.length - 1 - index;
        return `
            <div class="request-item" data-index="${realIndex}">
                <div style="display:flex;justify-content:space-between;flex-wrap:wrap;">
                    <span class="req-name">${req.name || 'ناشناس'}</span>
                    <span class="req-date">${new Date(req.date).toLocaleDateString('fa-IR')}</span>
                </div>
                <div class="req-question">📩 ${req.question}</div>
                ${req.reply ? `
                    <div style="margin-top:0.8rem;padding:0.8rem 1rem;background:rgba(218,165,32,0.08);border-radius:8px;border-right:2px solid #daa520;">
                        <strong style="color:#daa520;">پاسخ:</strong>
                        <span style="color:#e0d6c8;">${req.reply}</span>
                    </div>
                ` : `
                    <div class="req-reply">
                        <textarea placeholder="پاسخ خود را بنویسید..." class="reply-textarea"></textarea>
                        <button onclick="submitReply(${realIndex})" style="background:#daa520;color:#0a0a0f;padding:0.6rem 1.5rem;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">
                            ارسال پاسخ ✨
                        </button>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

// --- Submit new request ---
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const question = document.getElementById('question').value.trim();

    if (!question) {
        formMessage.textContent = '⚠️ لطفاً سوال خود را بنویسید.';
        formMessage.style.color = '#e74c3c';
        return;
    }

    const requests = loadRequests();
    requests.push({
        id: Date.now(),
        name: name || 'ناشناس',
        email: email,
        question: question,
        date: new Date().toISOString(),
        reply: null,
        repliedAt: null
    });

    saveRequests(requests);
    renderRequests();
    
    form.reset();
    formMessage.textContent = '✅ درخواست شما با موفقیت ارسال شد! ✨';
    formMessage.style.color = '#2ecc71';
    
    setTimeout(() => {
        formMessage.textContent = '';
    }, 5000);
});

// --- Submit reply to a request ---
window.submitReply = function(index) {
    const requests = loadRequests();
    const request = requests[index];
    
    const container = document.querySelector(`.request-item[data-index="${index}"]`);
    const textarea = container.querySelector('.reply-textarea');
    const replyText = textarea.value.trim();
    
    if (!replyText) {
        alert('⚠️ لطفاً پاسخ را بنویسید.');
        return;
    }
    
    request.reply = replyText;
    request.repliedAt = new Date().toISOString();
    saveRequests(requests);
    renderRequests();
};

// --- Auto-refresh every 30 seconds (for demo) ---
setInterval(() => {
    renderRequests();
}, 30000);

// --- Initial render ---
renderRequests();

// --- Smooth scrolling ---
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// --- Console greeting ---
console.log('👁️ Eyeless Tarot - Ready to receive your requests!');
console.log('📊 All data stored in localStorage for demo purposes.');
console.log('💡 To make it persistent, connect a backend (Node.js, Firebase, etc.)');
