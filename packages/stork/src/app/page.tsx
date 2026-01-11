'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const EDUCATIONAL_CONTENT = {
  greeting: `Hey there! 👋 I'm here to help you understand Stork Oracle and how oracles work in blockchain.

Think of me as your friendly guide. Ask me anything about oracles, Stork, or how data gets onto blockchains. I'll explain it in plain English, no jargon required.

What would you like to learn about?`,

  topics: {
    'what is stork': `Great question! Let's start simple.

Stork is an oracle network. But what does that mean?

Think of blockchain as a secure vault. It's amazing at keeping information safe and unchangeable. But there's a catch: it can't see outside itself. It doesn't know the price of Bitcoin, the weather in Tokyo, or who won last night's game.

That's where Stork comes in. We're like a trusted messenger service. We bring real-world data onto the blockchain in a way that's fast, accurate, and secure.

Need the current price of ETH for your smart contract? Stork delivers it. Want sports scores? Weather data? Stock prices? We've got you covered.

What else would you like to know?`,

    'what is oracle': `Perfect place to start!

An oracle is a bridge between the real world and blockchain.

Here's why we need them:

Blockchains are isolated by design. They're like secure islands that can't access the internet, APIs, or any external data. This keeps them safe, but also limits what they can do.

Smart contracts (programs on blockchain) often need real-world information. A betting app needs game scores. A DeFi protocol needs asset prices. An insurance contract needs weather data.

Oracles solve this. They fetch data from the outside world, verify it's accurate, and deliver it to the blockchain in a format smart contracts can use.

Think of it like this: if blockchain is a calculator, oracles are the person typing in the numbers.

Want to know how Stork does this differently?`,

    'how does stork work': `Let me break down how Stork works, step by step.

**Step 1: Data Collection**
We gather data from multiple high-quality sources. For prices, that means exchanges, market makers, and trading venues. We never rely on just one source.

**Step 2: Aggregation**
Our system combines all these data points using smart algorithms. This filters out errors and manipulation attempts. Think of it like asking 10 experts and taking the consensus answer.

**Step 3: Signing**
Multiple independent validators cryptographically sign the data. This creates a tamper-proof seal that proves the data is legitimate.

**Step 4: Delivery**
The signed data gets delivered to blockchains. Smart contracts can verify the signatures to ensure the data hasn't been tampered with.

**Step 5: Speed**
This all happens in milliseconds. Stork is built for high-frequency applications that need fresh data constantly.

The key difference? Stork is optimized for speed and low latency, making it perfect for trading, DeFi, and other time-sensitive applications.

Curious about anything specific?`,

    'why trust stork': `Trust is everything in this space. Here's why Stork is reliable:

**Multiple Data Sources**
We never rely on a single source. If one source has bad data or goes offline, the others keep things running smoothly.

**Decentralized Validation**
Multiple independent validators must agree on the data. No single entity controls what gets published.

**Cryptographic Proof**
Every data point is cryptographically signed. You can verify it hasn't been tampered with. It's like a tamper-evident seal, but mathematically unbreakable.

**Transparency**
Our data and methodology are auditable. You can see exactly how we operate.

**Track Record**
Stork has been battle-tested in production environments handling real value. Our uptime and accuracy speak for themselves.

Think of it like this: would you trust a single person telling you the price of gold, or would you rather have 20 independent experts all agreeing on the price? That's the Stork approach.

What else can I clarify?`,

    'use cases': `Stork powers all kinds of applications. Here are some examples:

**DeFi Protocols**
Lending platforms need accurate prices to know when to liquidate positions. DEXs need prices for trading pairs. Stork delivers this data in real-time.

**Prediction Markets**
Betting on sports, elections, or events? You need reliable outcome data. Stork can provide that.

**Derivatives Trading**
Options, futures, and perpetuals all need precise, low-latency price feeds. Stork is built for this.

**Insurance Products**
Parametric insurance (like crop insurance based on rainfall) needs reliable external data. Oracles make this possible.

**Gaming & NFTs**
Dynamic NFTs that change based on real-world events, or games that incorporate real data, all need oracles.

**Cross-Chain Applications**
Apps that work across multiple blockchains need data synchronized everywhere. Stork operates on many chains.

The common thread? Any time a blockchain application needs to know something about the real world, an oracle like Stork makes it possible.

Interested in a specific use case?`,

    'oracle problem': `The "oracle problem" is one of the biggest challenges in blockchain. Let me explain.

**The Problem:**
Blockchains are deterministic and isolated. Every node must be able to verify every transaction independently. But real-world data is messy, changes constantly, and comes from centralized sources.

If a smart contract asks "What's the price of ETH?", different nodes might get different answers depending on when they ask or which source they use. This breaks consensus.

**The Dilemma:**
You need external data, but bringing it in creates a point of centralization and potential failure. If your oracle is compromised, your entire smart contract is compromised—no matter how secure the blockchain is.

**How Stork Addresses This:**
- Multiple independent data sources
- Decentralized validation network
- Cryptographic signatures for verification
- Transparent methodology
- Economic incentives for honest behavior

We can't eliminate trust entirely (you have to trust something outside the blockchain), but we can distribute it across many parties and make manipulation extremely difficult and expensive.

It's about minimizing risk, not eliminating it. That's the honest truth.

Want to dive deeper into any aspect?`,

    'latency': `Latency—how fast data gets from the real world to the blockchain—is crucial for many applications.

**Why Speed Matters:**
In DeFi, prices change by the second. A trader might exploit stale data to profit at others' expense. Liquidations need to happen at the right time. Slow data = risk.

**Stork's Approach:**
We're built for low latency. Our architecture prioritizes speed:

- Direct connections to data sources
- Optimized aggregation algorithms
- Efficient delivery mechanisms
- Strategic validator placement

We're talking milliseconds, not seconds.

**The Trade-off:**
There's always a balance between speed and security. Faster data means less time for validation. Stork finds the sweet spot: fast enough for high-frequency applications, secure enough to trust with real value.

Think of it like this: a news article takes time to fact-check, but a stock ticker needs to be instant. Stork is optimized for the ticker use case.

Anything else about performance?`,

    'getting started': `Want to use Stork in your project? Here's the path forward:

**For Developers:**
1. Check out our documentation (I can't link here, but search for Stork Oracle docs)
2. Look at our SDKs and integration guides
3. Start with testnet to experiment risk-free
4. Join our developer community for support

**For Users:**
You're probably already using Stork without knowing it! Many DeFi apps and protocols integrate Stork behind the scenes.

**What You'll Need:**
- Basic understanding of smart contracts
- Knowledge of your blockchain platform (Ethereum, Solana, etc.)
- An idea of what data you need

**Common First Steps:**
- Integrate a price feed for your DeFi app
- Add real-world data to your smart contract
- Build a prediction market or betting app

The Stork team is friendly and helpful. Don't hesitate to reach out to the community.

Ready to build something?`,
  },
};

function findBestMatch(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Greeting patterns
  if (msg.match(/^(hi|hello|hey|greetings|sup|yo)\b/)) {
    return EDUCATIONAL_CONTENT.greeting;
  }
  
  // Topic matching
  if (msg.includes('what is stork') || msg.includes('what\'s stork') || (msg.includes('stork') && msg.includes('explain'))) {
    return EDUCATIONAL_CONTENT.topics['what is stork'];
  }
  
  if (msg.includes('what is oracle') || msg.includes('what\'s oracle') || msg.includes('what are oracle') || (msg.includes('oracle') && msg.includes('explain') && !msg.includes('stork'))) {
    return EDUCATIONAL_CONTENT.topics['what is oracle'];
  }
  
  if (msg.includes('how') && (msg.includes('stork work') || msg.includes('stork operate'))) {
    return EDUCATIONAL_CONTENT.topics['how does stork work'];
  }
  
  if (msg.includes('trust') || msg.includes('reliable') || msg.includes('secure') || msg.includes('why stork')) {
    return EDUCATIONAL_CONTENT.topics['why trust stork'];
  }
  
  if (msg.includes('use case') || msg.includes('example') || msg.includes('application') || msg.includes('what can')) {
    return EDUCATIONAL_CONTENT.topics['use cases'];
  }
  
  if (msg.includes('oracle problem') || msg.includes('challenge')) {
    return EDUCATIONAL_CONTENT.topics['oracle problem'];
  }
  
  if (msg.includes('latency') || msg.includes('speed') || msg.includes('fast') || msg.includes('performance')) {
    return EDUCATIONAL_CONTENT.topics['latency'];
  }
  
  if (msg.includes('start') || msg.includes('begin') || msg.includes('integrate') || msg.includes('use stork') || msg.includes('developer')) {
    return EDUCATIONAL_CONTENT.topics['getting started'];
  }
  
  // Default helpful response
  return `I'd love to help you understand that better!

Here are some topics I can explain:

• **What is Stork?** - Learn about Stork Oracle
• **What is an oracle?** - The basics of blockchain oracles
• **How does Stork work?** - Technical overview made simple
• **Why trust Stork?** - Security and reliability
• **Use cases** - Real-world applications
• **Oracle problem** - The challenges oracles solve
• **Speed & latency** - Why performance matters
• **Getting started** - How to use Stork

Just ask about any of these topics, or ask your question in your own words!`;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: EDUCATIONAL_CONTENT.greeting }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    setTimeout(() => {
      const response = findBestMatch(input);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Stork Signal</h1>
            <p className="text-sm text-slate-600">Learn about Stork Oracle in plain English</p>
          </div>
          <div className="text-4xl">🦩</div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content.split('\n').map((line, i) => {
                    // Bold text between **
                    if (line.includes('**')) {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={i} className="mb-3 last:mb-0">
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    }
                    // Bullet points
                    if (line.startsWith('•') || line.startsWith('-')) {
                      return <li key={i} className="ml-4 mb-2">{line.slice(1).trim()}</li>;
                    }
                    // Regular paragraphs
                    if (line.trim()) {
                      return <p key={i} className="mb-3 last:mb-0">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-800 rounded-2xl px-6 py-4 shadow-sm border border-slate-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Stork or oracles..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

