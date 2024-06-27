let conversationHistory = [];

function countTokens(message) {
  // 简单的估算 token 数量的方法，可以根据实际情况进行调整
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

  // 将用户输入添加到对话历史中
  conversationHistory.push({ role: 'user', content: userInput });

  // 截断对话历史，确保总 token 数量不超过 32768
  conversationHistory = trimConversationHistory(conversationHistory, 32768);

  const chatMessages = document.getElementById('chat-messages');
  const userMessage = document.createElement('div');
  userMessage.textContent = `用户: ${userInput}`;
  userMessage.classList.add('user-message');
  chatMessages.appendChild(userMessage);
  document.getElementById('user-input').value = '';

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen2-7B-Instruct',
      messages: conversationHistory, // 发送对话历史
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
      jsonString = jsonString.replace(/\[DONE\]$/, ''); // 移除多余的 [DONE]

      try {
        const data = JSON.parse(jsonString);
        // console.log('API response:', data); // 调试信息
        if (data.choices && data.choices.length > 0) {
          const aiResponse = data.choices[0].message.content;
          conversationHistory.push({ role: 'assistant', content: aiResponse }); // 将AI回复添加到对话历史中
          
          const aiMessage = document.createElement('div');
          aiMessage.innerHTML = `Qwen: ${marked.parse(aiResponse)}`; // 使用 marked 解析 Markdown
          aiMessage.classList.add('ai-message');
          chatMessages.appendChild(aiMessage);
        } else {
          const errorMessage = document.createElement('div');
          errorMessage.textContent = `Qwen: 无法获取响应，请稍后重试。`;
          chatMessages.appendChild(errorMessage);
        }
      } catch (error) {
        console.error('JSON parse error:', error);
        console.log('Raw JSON string:', jsonString); // 输出原始 JSON 字符串进行调试
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

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});