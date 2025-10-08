"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Message {
  userId: string;
  from: string;
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState({ id: '', name: '' });
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("url", process.env.NEXT_PUBLIC_URL_WEBSOCKET)
    wsRef.current = new WebSocket(process.env.NEXT_PUBLIC_URL_WEBSOCKET || "");

    wsRef.current.onopen = () => console.log("Conectou!");
    wsRef.current.onerror = (err) => console.error("Erro WebSocket:", err);
    wsRef.current.onclose = () => console.log("Conexão fechada");
    wsRef.current.onmessage = processMessage

    console.log("state", wsRef.current.readyState, WebSocket.OPEN)

    // cleanup: fecha a conexão ao desmontar o componente
    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function processMessage(event: { data: string }) {
    console.log("event", event)
    const { data } = event;
    console.log("data", data)
    const { userId, from, text } = JSON.parse(data)

    const newMessage = { userId, from, text }

    setMessages((m) => [
      ...m,
      newMessage
    ]);
  }

  function sendMessage() {
    if (!text.trim()) return;

    const newMessage = { userId: user.id, from: user.name, text: text.trim() }

    setMessages((m) => [
      ...m,
      newMessage
    ]);
    setText('');

    wsRef.current?.send(JSON.stringify(newMessage));
  }

  function handleKeyDown(e: React.KeyboardEvent, type?: string) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type == "login") {
        login();
      } else {
        sendMessage();
      }
    }
  }

  function login(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    const userId = crypto.randomUUID();

    setUser({
      ...user,
      id: `${userId}`
    })
  }

  return (
    <main className={user.id ? "h-screen flex flex-col bg-black text-white" : "h-screen w-screen flex items-center justify-center"}>
      {
        user.id ?
          <>
            <section className="flex-1 overflow-auto p-4">
              <div className="max-w-2xl mx-auto space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.userId}
                    className={`flex ${m.userId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg inline-block max-w-[80%] whitespace-pre-wrap break-words ${m.userId === user.id
                        ? 'bg-gray-200 text-black'
                        : 'bg-gray-800 text-white'
                        }`}
                    >
                      {m.userId !== user.id && (
                        <div className="text-xs font-semibold mb-1 text-green-400">{m.from}</div>
                      )}
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </section>
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
          </>
          :
          <form className="flex flex-col  justify-center items-center bg-neutral-700 p-[20px] rounded-md" onSubmit={login}>
            <h1 className='font-bold text-3xl'>Login</h1>
            <input
              className="bg-neutral-900 rounded-md mt-[20px] h-[45px] p-[5px] min-w-[280px]"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              onKeyDown={e => handleKeyDown(e, "login")}
              placeholder="Nome do Usuário"
              required
            />
            <button
              className="bg-stone-200 hover:bg-stone-300 text-black rounded-md cursor-pointer mt-[20px] h-[45px] w-[100%] min-w-[280px]"
              type="submit"
            >Entrar</button>
          </form>
      }
    </main>
  );
}