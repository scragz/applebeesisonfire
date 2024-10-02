document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');

    let messages = [];

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage('user', userMessage);
        userInput.value = '';

        try {
            const response = await sendMessage(userMessage);
            addMessage('assistant', response);
        } catch (error) {
            console.error('Error:', error);
            addMessage('assistant', 'Sorry, there was an error processing your request.');
        }
    });

    async function sendMessage(message) {
        messages.push({ role: 'user', content: message });

        const response = await fetch('/api/chat.mjs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            throw new Error('Failed to get response from server');
        }

        const data = await response.json();
        messages.push(data.message);
        return data.message.content;
    }

    function addMessage(role, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${role}-message`);
        messageElement.textContent = content;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
