/* ═══════════════════════════════════════
   CHATBOT — chatbot.js
   ═══════════════════════════════════════ */
(function () {
    const toggle = document.getElementById('cb-toggle');
    const box = document.getElementById('cb-box');
    const closeBtn = document.getElementById('cb-close');
    const input = document.getElementById('cb-input');
    const sendBtn = document.getElementById('cb-send');
    const messages = document.getElementById('cb-messages');
    const notif = document.getElementById('cb-notif');
    const iconChat = toggle.querySelector('.cb-icon-chat');
    const iconX = toggle.querySelector('.cb-icon-close');

    let isOpen = false;
    let isLoading = false;
    let history = []; // conversation history for Groq

    /* ── Open / Close ── */
    function openChat() {
        isOpen = true;
        box.classList.add('open');
        iconChat.style.display = 'none';
        iconX.style.display = 'block';
        notif.classList.add('hidden');
        setTimeout(() => input.focus(), 350);
    }
    function closeChat() {
        isOpen = false;
        box.classList.remove('open');
        iconChat.style.display = 'block';
        iconX.style.display = 'none';
    }

    toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
    closeBtn.addEventListener('click', closeChat);

    /* ── Add Message to UI ── */
    function addMessage(text, role) {
        const div = document.createElement('div');
        div.className = `cb-msg cb-${role}`;
        div.innerHTML = `<p>${text}</p>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    /* ── Typing Indicator ── */
    function showTyping() {
        const div = document.createElement('div');
        div.className = 'cb-msg cb-bot cb-typing';
        div.id = 'cb-typing-indicator';
        div.innerHTML = `<p>
      <span class="cb-dot-1"></span>
      <span class="cb-dot-2"></span>
      <span class="cb-dot-3"></span>
    </p>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
    function hideTyping() {
        const el = document.getElementById('cb-typing-indicator');
        if (el) el.remove();
    }

    /* ── Send Message ── */
    async function sendMessage() {
        const text = input.value.trim();
        if (!text || isLoading) return;

        input.value = '';
        isLoading = true;
        sendBtn.disabled = true;

        addMessage(text, 'user');
        history.push({ role: 'user', content: text });
        showTyping();

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history })
            });

            const data = await res.json();
            hideTyping();

            const reply = data.reply || 'Sorry, kuch masla ho gaya. Dobara try karo!';
            addMessage(reply, 'bot');
            history.push({ role: 'assistant', content: reply });

            // Keep history to last 8 messages (4 turns) to save tokens
            if (history.length > 8) history = history.slice(-8);

        } catch (err) {
            hideTyping();
            addMessage('Connection error. Please try again!', 'bot');
        }

        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    /* ── Cursor expand on chatbot elements ── */
    // (existing cursor logic ke saath compatible)
    [toggle, closeBtn, sendBtn, input].forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.getElementById('cdot')?.classList.add('expand');
            document.getElementById('cring')?.classList.add('expand');
        });
        el.addEventListener('mouseleave', () => {
            document.getElementById('cdot')?.classList.remove('expand');
            document.getElementById('cring')?.classList.remove('expand');
        });
    });

})();