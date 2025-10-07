"use client";

import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Maria', text: 'Oi, pessoal!' },
    { id: 2, from: 'Antonia', text: 'Oi, Maria!' },
    { id: 3, from: 'me', text: 'Oi, Maria!' },
  ]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage() {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { id: Date.now(), from: 'me', text: text.trim() },
    ]);
    setText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Mensagens */}
      <section className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg inline-block max-w-[80%] whitespace-pre-wrap break-words ${m.from === 'me'
                  ? 'bg-gray-200 text-black'
                  : 'bg-gray-800 text-white'
                  }`}
              >
                {m.from !== 'me' && (
                  <div className="text-xs font-semibold mb-1 text-green-400">{m.from}</div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* Input */}
      <footer className="p-4 border-t border-gray-700 bg-black">
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem..."
            className="flex-1 min-h-[44px] max-h-44 resize-none border rounded-md px-3 py-2 bg-gray-900 text-white focus:outline-none focus:ring focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-500"
          >
            Enviar
          </button>
        </div>
      </footer>
    </div>
  );
}