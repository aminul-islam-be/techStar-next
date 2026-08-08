import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "techstar_ai_chat_history_v1";

const welcomeMessage = {
  role: "assistant",
  content:
    "Assalamu Alaikum! You can ask for anything.TechStar AI\\our website\\Technology, Electronics, Engineering, Programming, Math, Business, General Knowledge , TechStar- products , product price, How can I help you ?",
};

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.error("Chat history load error:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch (error) {
      console.error("Chat history save error:", error);
    }
  }, [messages, hydrated]);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [messages, open]);

  const sendMessage = async (event) => {
    event?.preventDefault?.();
    const text = input.trim();

    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-20),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "AI response failed");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ||
            "Hello",
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `ржжрзБржГржЦрж┐ржд, ржПржЗ ржорзБрж╣рзВрж░рзНрждрзЗ AI ржЙрждрзНрждрж░ ржжрж┐рждрзЗ ржкрж╛рж░ржЫрзЗ ржирж╛ред\\n\\nрж╕ржорж╕рзНржпрж╛: ${error.message}`,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const newChat = () => {
    setMessages([welcomeMessage]);
    setInput("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Chat history clear error:", error);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <> {open && ( <div className="techstar-ai-panel" role="dialog" aria-label="TechStar AI Chat" > <div className="techstar-ai-header"> <div className="techstar-ai-brand"> <div className="techstar-ai-avatar">тЪб</div> <div> <div className="techstar-ai-title">TechStar AI</div> <div className="techstar-ai-status"> <span className="techstar-ai-dot" /> Nemotron 3 Ultra </div> </div> </div> <div className="techstar-ai-actions"> <button type="button" onClick={newChat} title="New chat" aria-label="New chat" > тЖ╗ </button> <button type="button" onClick={() => setOpen(false)} title="Close" aria-label="Close chat" > ├Ч </button> </div> </div> <div className="techstar-ai-messages"> {messages.map((message, index) => ( <div key={`${message.role}-${index}`} className={`techstar-ai-row ${ message.role === "user" ? "user" : "assistant" }`} > {message.role === "assistant" && ( <div className="techstar-ai-mini-avatar">тЪб</div> )} <div className={`techstar-ai-bubble ${ message.role === "user" ? "user-bubble" : "assistant-bubble" } ${message.error ? "error-bubble" : ""}`} > {message.content} </div> </div> ))} {loading && ( <div className="techstar-ai-row assistant"> <div className="techstar-ai-mini-avatar">тЪб</div> <div className="techstar-ai-bubble assistant-bubble typing"> <span /> <span /> <span /> </div> </div> )} <div ref={endRef} /> </div> <form className="techstar-ai-input-area" onSubmit={sendMessage}> <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(event); } }} placeholder="ржЖржкржирж╛рж░ ржкрзНрж░рж╢рзНржи рж▓рж┐ржЦрзБржи..." rows={1} maxLength={4000} disabled={loading} /> <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" title="Send" > тЮд </button> </form> <div className="techstar-ai-footer"> AI ржнрзБрж▓ ржХрж░рждрзЗ ржкрж╛рж░рзЗред ржЧрзБрж░рзБрждрзНржмржкрзВрж░рзНржг рждржерзНржп ржпрж╛ржЪрж╛ржЗ ржХрж░рзЗ ржирж┐ржиред </div> </div> )} {!open && ( <button type="button" className="techstar-ai-launcher" onClick={() => setOpen(true)} aria-label="Open TechStar AI" title="Ask TechStar AI" > <span className="techstar-ai-launcher-icon">тЪб</span> <span className="techstar-ai-launcher-text">AI</span> </button> )} <style jsx>{` .techstar-ai-panel { position: fixed; right: 20px; bottom: 88px; z-index: 99999; width: min(410px, calc(100vw - 24px)); height: min(650px, calc(100vh - 120px)); min-height: 430px; display: flex; flex-direction: column; overflow: hidden; background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.1); border-radius: 22px; box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22); animation: techstarAiIn 0.2s ease-out; } @keyframes techstarAiIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } } .techstar-ai-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 15px; background: linear-gradient(135deg, #111827, #312e81); color: white; } .techstar-ai-brand { display: flex; align-items: center; gap: 10px; min-width: 0; } .techstar-ai-avatar, .techstar-ai-mini-avatar { display: grid; place-items: center; flex: 0 0 auto; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; font-weight: 800; } .techstar-ai-avatar { width: 42px; height: 42px; font-size: 20px; } .techstar-ai-mini-avatar { width: 28px; height: 28px; font-size: 13px; margin-top: 2px; } .techstar-ai-title { font-size: 15px; font-weight: 800; line-height: 1.2; } .techstar-ai-status { display: flex; align-items: center; gap: 5px; margin-top: 3px; font-size: 11px; opacity: 0.82; } .techstar-ai-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.12); } .techstar-ai-actions { display: flex; gap: 4px; } .techstar-ai-actions button { width: 34px; height: 34px; border: 0; border-radius: 10px; background: rgba(255, 255, 255, 0.1); color: white; font-size: 20px; cursor: pointer; } .techstar-ai-actions button:hover { background: rgba(255, 255, 255, 0.2); } .techstar-ai-messages { flex: 1; overflow-y: auto; padding: 18px 13px; background: #f8fafc; scroll-behavior: smooth; } .techstar-ai-row { display: flex; align-items: flex-start; gap: 7px; margin: 0 0 14px; } .techstar-ai-row.user { justify-content: flex-end; } .techstar-ai-bubble { max-width: 82%; padding: 11px 13px; border-radius: 16px; font-size: 14px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; } .assistant-bubble { color: #1f2937; background: white; border: 1px solid #e5e7eb; border-top-left-radius: 5px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04); } .user-bubble { color: white; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-top-right-radius: 5px; } .error-bubble { color: #991b1b; background: #fef2f2; border-color: #fecaca; } .typing { display: flex; align-items: center; gap: 4px; min-width: 54px; height: 40px; } .typing span { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: techstarTyping 1.2s infinite ease-in-out; } .typing span:nth-child(2) { animation-delay: 0.15s; } .typing span:nth-child(3) { animation-delay: 0.3s; } @keyframes techstarTyping { 0%, 60%, 100% { transform: translateY(0); opacity: 0.45; } 30% { transform: translateY(-4px); opacity: 1; } } .techstar-ai-input-area { display: flex; gap: 8px; align-items: flex-end; padding: 10px; border-top: 1px solid #e5e7eb; background: white; } .techstar-ai-input-area textarea { flex: 1; min-width: 0; max-height: 110px; resize: none; padding: 10px 12px; border: 1px solid #dbe2ea; border-radius: 14px; outline: none; font: inherit; font-size: 14px; line-height: 1.4; background: #f8fafc; } .techstar-ai-input-area textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); } .techstar-ai-input-area button { width: 42px; height: 42px; flex: 0 0 auto; border: 0; border-radius: 13px; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; font-size: 18px; cursor: pointer; } .techstar-ai-input-area button:disabled { opacity: 0.4; cursor: not-allowed; } .techstar-ai-footer { padding: 7px 12px 9px; text-align: center; font-size: 10px; color: #94a3b8; background: white; } .techstar-ai-launcher { position: fixed; right: 20px; bottom: 20px; z-index: 99999; width: 62px; height: 62px; display: flex; align-items: center; justify-content: center; gap: 2px; border: 0; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; box-shadow: 0 12px 30px rgba(79, 70, 229, 0.35); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; } .techstar-ai-launcher:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 16px 34px rgba(79, 70, 229, 0.42); } .techstar-ai-launcher-icon { font-size: 21px; } .techstar-ai-launcher-text { font-size: 12px; font-weight: 900; } @media (max-width: 600px) { .techstar-ai-panel { right: 8px; bottom: 76px; width: calc(100vw - 16px); height: min(78vh, 650px); min-height: 400px; border-radius: 18px; } .techstar-ai-launcher { right: 14px; bottom: 14px; width: 56px; height: 56px; } .techstar-ai-bubble { max-width: 88%; font-size: 13.5px; } } `}</style> </>
  );
    }
