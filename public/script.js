let conversationHistory = [];

function adjustInputHeight() {
  const userInput = document.getElementById('user-input');
  userInput.style.height = 'auto';
  userInput.style.height = (userInput.scrollHeight) + 'px';
}

// 载入历史对话
function loadConversationHistory() {
  const history = localStorage.getItem('conversationHistory');
  if (history) {
    conversationHistory = JSON.parse(history);
    const chatMessages = document.getElementById('chat-messages');
    conversationHistory.forEach(message => {
      const messageElement = document.createElement('div');
      const roleClass = message.role === 'user' ? 'user-message' : 'ai-message';
      messageElement.classList.add(roleClass);
      if (message.role === 'user') {
        messageElement.textContent = `用户: ${message.content}`;
      } else {
        messageElement.innerHTML = `Qwen: ${marked.parse(message.content)}`;
      }
      chatMessages.appendChild(messageElement);
    });
  }
}

// 保存对话历史到 localStorage
function saveConversationHistory() {
  localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
}

function countTokens(message) {
  return message.content.length;
}

function trimConversationHistory(history, maxTokens) {
  let tokenCount = 0;
  let trimmedHistory = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i];
    const messageTokenCount = countTokens(message);
    if (tokenCount + messageTokenCount > maxTokens) {
      break;
    }
    tokenCount += messageTokenCount;
    trimmedHistory.unshift(message);
  }

  return trimmedHistory;
}

function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (!userInput) return;

  conversationHistory.push({ role: 'user', content: userInput });
  conversationHistory = trimConversationHistory(conversationHistory, 32768);

  const chatMessages = document.getElementById('chat-messages');
  const userMessage = document.createElement('div');
  userMessage.textContent = `用户: ${userInput}`;
  userMessage.classList.add('user-message');
  chatMessages.appendChild(userMessage);
  document.getElementById('user-input').value = '';
  adjustInputHeight(); // 调整输入框高度

  saveConversationHistory();

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen2-7B-Instruct',
      messages: conversationHistory,
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0.5,
      n: 1
    })
  };

  fetch('/api/chat', options)
    .then(response => response.text())
    .then(text => {
      let jsonString = text.replace(/data: /g, '').replace(/\n/g, '');
      jsonString = jsonString.replace(/\[DONE\]$/, '');

      try {
        const data = JSON.parse(jsonString);
        if (data.choices && data.choices.length > 0) {
          const aiResponse = data.choices[0].message.content;
          conversationHistory.push({ role: 'assistant', content: aiResponse });
          
          const aiMessage = document.createElement('div');
          aiMessage.innerHTML = `Qwen: ${marked.parse(aiResponse)}`;
          aiMessage.classList.add('ai-message');
          chatMessages.appendChild(aiMessage);
          
          saveConversationHistory();
        } else {
          const errorMessage = document.createElement('div');
          errorMessage.textContent = `Qwen: 无法获取响应，请稍后重试。`;
          chatMessages.appendChild(errorMessage);
        }
      } catch (error) {
        console.error('JSON parse error:', error);
        console.log('Raw JSON string:', jsonString);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Qwen: JSON 解析失败，请稍后重试。`;
        chatMessages.appendChild(errorMessage);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      const errorMessage = document.createElement('div');
      errorMessage.textContent = `Qwen: 请求失败，请稍后重试。`;
      chatMessages.appendChild(errorMessage);
    });
}

function deleteConversationHistory() {
  if (confirm('是否确认删除所有对话记录？')) {
    conversationHistory = [];
    localStorage.removeItem('conversationHistory');
    document.getElementById('chat-messages').innerHTML = '';
  }
}

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('delete-button').addEventListener('click', deleteConversationHistory);
document.getElementById('user-input').addEventListener('input', adjustInputHeight);
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

window.onload = loadConversationHistory;