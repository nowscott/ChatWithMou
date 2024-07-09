import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TestAPIKey = ({ apiKey }) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setIsValid(false);
      localStorage.setItem('apiKeyStatus', 'false');
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2-7B-Instruct',
        messages: [{ role: 'user', content: '你好' }],
        max_tokens: 1,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
      }),
      signal,
    };

    fetch('https://api.siliconflow.cn/v1/chat/completions', options)
      .then(response => {
        if (response.status === 200) {
          setIsValid(true);
          localStorage.setItem('apiKeyStatus', 'true');
        } else {
          setIsValid(false);
          localStorage.setItem('apiKeyStatus', 'false');
        }
      })
      .catch(() => {
        setIsValid(false);
        localStorage.setItem('apiKeyStatus', 'false');
      });

    return () => {
      controller.abort();
    };
  }, [apiKey]);

  return (
    <div className="overflow-y-auto">
      {isValid === true ? (
        <FaCheckCircle color="lime" size="1em" />
      ) : (
        <FaTimesCircle color="red" size="1em" />
      )}
    </div>
  );
};

export default TestAPIKey;