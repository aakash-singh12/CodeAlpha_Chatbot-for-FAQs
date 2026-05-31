// ==========================================================================
// Aetheris Voyage - Space FAQ AI Assistant React Component
// ==========================================================================

const { useState, useEffect, useRef } = React;

// 15 Immersive FAQ pairs about the premium space-tourism service "Aetheris Voyage"
const FAQ_DATABASE = [
  {
    id: "faq-1",
    question: "What is Aetheris Voyage?",
    category: "General",
    answer: "Aetheris Voyage is the world's leading premium orbital and deep-space tourism agency, offering bespoke suborbital flights, lunar cruises, and stays at the luxurious Aetheris Aurora orbital habitat."
  },
  {
    id: "faq-2",
    question: "How much does a suborbital flight cost?",
    category: "Pricing",
    answer: "Our introductory suborbital flight, the \"Apex Ascent,\" starts at $250,000 USD per seat. This includes comprehensive 3-day pre-flight training, five-star accommodations at our Atacama launch site, and a high-definition personal video log of your spaceflight."
  },
  {
    id: "faq-3",
    question: "What is the duration of the Lunar Cruise?",
    category: "Itinerary",
    answer: "The \"Artemis Loop\" Lunar Cruise is an 11-day itinerary, consisting of 3 days of Earth-departure transit, 5 days of low-lunar orbit sightseeing (at an altitude of approximately 100km), and 3 days of return transit back to Earth."
  },
  {
    id: "faq-4",
    question: "Is space travel safe? What are your safety protocols?",
    category: "Safety",
    answer: "Safety is our absolute priority. Our fleet uses state-of-the-art redundant flight control systems, advanced radiation-shielded carbon-composite hulls, and multi-stage autonomous launch abort systems. All passengers undergo comprehensive medical screenings and a rigorous 3-day preparation course."
  },
  {
    id: "faq-5",
    question: "What are the physical requirements for passengers?",
    category: "Safety",
    answer: "Passengers must be at least 18 years old, possess stable cardiovascular and respiratory health, and be capable of tolerating up to 4G forces during launch and atmospheric re-entry. A pre-flight medical clearance from our flight surgeons is mandatory."
  },
  {
    id: "faq-6",
    question: "Can I bring personal items on the flight?",
    category: "Preparation",
    answer: "Yes, each passenger is allocated a custom-molded personal locker with a weight limit of 2.5 kg (5.5 lbs) for personal effects, lightweight cameras, and small memorabilia. Heavy or loosely metallic items are prohibited for microgravity safety."
  },
  {
    id: "faq-7",
    question: "Where do launches take place?",
    category: "Operations",
    answer: "Our primary terrestrial launches depart from the Aetheris Spaceport located in the high-altitude Atacama Desert, Chile. For specific orbital alignments, we also utilize our equatorial marine launch platform, \"Poseidon Prime,\" positioned in the Pacific Ocean."
  },
  {
    id: "faq-8",
    question: "What is the Aetheris Aurora Orbital Habitat?",
    category: "Destinations",
    answer: "The Aetheris Aurora is our private luxury space station orbiting at 400km. It features a spacious zero-gravity lounge, gourmet dining modules, private viewing suites with dome-shaped glass bays, and multi-spectral scientific observation equipment."
  },
  {
    id: "faq-9",
    question: "How do I book a voyage?",
    category: "Booking",
    answer: "Voyage bookings are initiated by submitting a digital application form. Following submission, a dedicated Aetheris Flight Concierge will contact you within 24 hours to schedule your preliminary medical screening, review flight windows, and customize your itinerary."
  },
  {
    id: "faq-10",
    question: "What is your cancellation and refund policy?",
    category: "Booking",
    answer: "Reservations are fully refundable up to 180 days prior to your scheduled launch window, minus a standard $10,000 administrative fee. For cancellations within 180 days, booking fees are non-refundable but can be deferred once to a future flight window within 24 months."
  },
  {
    id: "faq-11",
    question: "Do I need to wear a spacesuit the entire time?",
    category: "Preparation",
    answer: "No. Custom-tailored pressurized flight suits are worn exclusively during high-dynamic operations: launch, orbital docking, and atmospheric re-entry. While inside the Aetheris Aurora habitat, passengers wear premium lightweight, comfortable flight-cabin wear."
  },
  {
    id: "faq-12",
    question: "Is internet access available in space?",
    category: "Preparation",
    answer: "Yes, Aetheris Voyage provides continuous high-speed orbital satellite internet via secure laser-link connections. This enables high-definition streaming, real-time video calls with family, and instantaneous social media sharing from orbit."
  },
  {
    id: "faq-13",
    question: "What kind of food is served during the voyage?",
    category: "Preparation",
    answer: "Our zero-g menu is designed by Michelin-starred culinary artists, featuring premium freeze-dried molecular gastronomy and specially structured gourmet meals optimized for consumption in microgravity. Liquid beverages are served in pressurized, leak-proof cosmic flasks."
  },
  {
    id: "faq-14",
    question: "What training is required before launch?",
    category: "Preparation",
    answer: "All passengers undergo a mandatory 3-day training program at our spaceport. This curriculum includes microgravity movement simulations, atmospheric pressure acclimatization, emergency egress exercises, and spacecraft control familiarization."
  },
  {
    id: "faq-15",
    question: "Can children travel on Aetheris flights?",
    category: "Booking",
    answer: "Currently, spaceflight is strictly limited to individuals aged 18 and older. This restriction is due to the physical stresses of high G-forces during ascent and re-entry, which are optimized for mature adult physiological profiles."
  }
];

// Fallback message for unmatched queries
const FALLBACK_MESSAGE = "I'm not sure about that. Please contact support at support@aetherisvoyage.com or explore our other FAQs in the sidebar.";

// Default Custom System Prompt for Anthropic Claude
const DEFAULT_SYSTEM_PROMPT = `You are "Aetheris Bot", an elegant, helpful AI Customer Assistant for "Aetheris Voyage", a premium orbital and deep-space tourism agency.

Your goal is to match the user's question to the most relevant FAQ from the list below and return its answer. 

RULES:
1. Use semantic understanding to match intent. If the user asks something that refers to an FAQ, match it even if they use different wording (e.g. "how much" -> suborbital flight cost, "kid" -> children travel policy, "wifi" -> internet in space).
2. Respond in a highly professional, welcoming, and elite tone. Feel free to explain the matched answer naturally, adding luxurious space-agency flair, but stay 100% faithful to the facts in the FAQ list.
3. STRICT FALLBACK: If the user's question is completely unrelated to ANY of the FAQs below (e.g. "how to bake bread", "tell me a joke", or general gibberish), you MUST respond EXACTLY with:
"I'm not sure about that. Please contact support." 
No other text, preamble, or conversational fluff if there is no match.

Here is the exact FAQ data to match against:
${FAQ_DATABASE.map((f, i) => `[FAQ ${i+1}] Q: ${f.question} | A: ${f.answer}`).join('\n')}`;

// Inline SVG Icon Components
const Icons = {
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
    </svg>
  ),
  Settings: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  ),
  Key: () => (
    <svg className="w-5 h-5 text-stellar-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m-5 8a5 5 0 1110 0 5 5 0 01-10 0zM17 14l-4-4m0-2.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
    </svg>
  ),
  Bot: ({ className = "w-6 h-6 text-stellar-cyan" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 8h.01M15 8h.01"></path>
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  ),
  Book: () => (
    <svg className="w-5 h-5 text-stellar-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
    </svg>
  ),
  Info: () => (
    <svg className="w-4 h-4 text-slate-300 inline-block mr-1.5 align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  ),
  Cpu: () => (
    <svg className="w-5 h-5 text-stellar-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
    </svg>
  )
};

// Main App Component
function App() {
  // --- STATE ---
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Welcome to Aetheris Voyage customer relations. I am your orbital support assistant. Ask me anything about our orbital flights, suborbital packages, safety records, or space station facilities.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // API Config State loaded from localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("aetheris_api_key") || "");
  const [corsProxy, setCorsProxy] = useState(() => localStorage.getItem("aetheris_cors_proxy") || "");
  const [isMock, setIsMock] = useState(() => {
    const savedMock = localStorage.getItem("aetheris_is_mock");
    if (savedMock !== null) return savedMock === "true";
    return true; // default to Mock Mode for zero-config startup
  });
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem("aetheris_model") || "claude-3-5-sonnet-20241022");
  const [systemPrompt, setSystemPrompt] = useState(() => localStorage.getItem("aetheris_system_prompt") || DEFAULT_SYSTEM_PROMPT);
  
  // Custom API configuration warning messages
  const [apiError, setApiError] = useState(null);

  const messagesEndRef = useRef(null);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem("aetheris_api_key", apiKey);
    localStorage.setItem("aetheris_cors_proxy", corsProxy);
    localStorage.setItem("aetheris_is_mock", isMock);
    localStorage.setItem("aetheris_model", selectedModel);
    localStorage.setItem("aetheris_system_prompt", systemPrompt);
  }, [apiKey, corsProxy, isMock, selectedModel, systemPrompt]);

  // Auto Scroll Effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // --- INTELLIGENT LOCAL INTENT MATCHING (MOCK MODE) ---
  const findBestLocalMatch = (question) => {
    // 1. Sanitize query
    const query = question.toLowerCase().replace(/[^\w\s]/g, ' ');
    const queryWords = query.split(/\s+/).filter(w => w.length > 2); // only analyze keywords of size > 2
    
    if (queryWords.length === 0) return null;
    
    let bestMatch = null;
    let highestScore = 0;
    
    // 2. High-value terms dictionary mapped to weight multipliers
    const keywordWeights = {
      // Pricing / Money
      cost: 5, price: 5, expensive: 4.5, fee: 3, dollar: 4, pay: 3, booking: 2.5, cash: 3, book: 2.5,
      // Refunding
      refund: 5, cancel: 5, cancellation: 5, policy: 3, return: 2, back: 1.5,
      // Safety / Rules
      safe: 5, safety: 5, protocol: 4, crash: 4.5, danger: 4.5, protection: 3.5, shield: 3.5, abort: 4,
      // Medical / Ages
      medical: 5, health: 5, physical: 4.5, heart: 4, blood: 4.5, fit: 3.5, body: 3.5, cardiovascular: 5.5,
      age: 5, kid: 5, child: 5, children: 5, adult: 4, years: 3.5, old: 3.5, under: 3,
      // Flight characteristics
      duration: 5, days: 4.5, long: 3.5, length: 4, loop: 3.5, lunar: 4.5, cruise: 4.5, orbit: 4, moon: 5, suborbital: 5, apex: 4,
      // Food / Space conditions
      food: 5, eat: 5, drink: 4.5, dining: 5, chef: 4, michelin: 5, flask: 3.5, zero: 3, microgravity: 4, gravity: 3, weightless: 4,
      suit: 5, spacesuit: 5.5, helmet: 4.5, pressurized: 4, cabin: 3.5, clothing: 3.5, wear: 3,
      // Connection
      internet: 5.5, wifi: 5.5, satellite: 4, laser: 4, net: 3, connect: 3,
      // Location / Facility
      where: 3.5, launch: 4.5, location: 4.5, spaceport: 5, atacama: 5, chile: 5, poseidon: 5, ocean: 4.5, platform: 4,
      aurora: 5.5, habitat: 5, station: 4.5, private: 3.5, luxury: 3.5
    };
    
    // 3. Scan through database and calculate overlap scores
    FAQ_DATABASE.forEach(faq => {
      const faqQ = faq.question.toLowerCase().replace(/[^\w\s]/g, ' ');
      const faqWords = faqQ.split(/\s+/);
      
      let score = 0;
      let matchedKeyCount = 0;
      
      queryWords.forEach(word => {
        // Exact keyword match
        if (faqWords.includes(word)) {
          score += keywordWeights[word] || 2.0;
          matchedKeyCount++;
        } else {
          // Partial match (handles plurals / stems e.g. "suits" vs "suit", "flights" vs "flight")
          for (const faqWord of faqWords) {
            if (faqWord.includes(word) || word.includes(faqWord)) {
              const baseWeight = keywordWeights[faqWord] || keywordWeights[word] || 1.5;
              score += baseWeight * 0.65;
              matchedKeyCount++;
              break;
            }
          }
        }
      });
      
      // Normalize by a logarithmic function of query length to counteract long inputs inflating scores artificially
      const queryLengthFactor = Math.log(queryWords.length + 1) + 1.2;
      const normalizedScore = score / queryLengthFactor;
      
      if (normalizedScore > highestScore) {
        highestScore = normalizedScore;
        bestMatch = faq;
      }
    });
    
    // 4. Validate match against a strict threshold (1.35 points) to verify semantic relevance
    const threshold = 1.35;
    if (highestScore >= threshold && bestMatch) {
      return bestMatch.answer;
    }
    return null;
  };

  // --- SUBMIT MESSAGE FLOW ---
  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;
    
    setApiError(null);
    setInput("");
    
    // Create new User Message
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: timestampStr
    };
    
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // --- SIMULATED MOCK API FLOW ---
    if (isMock || !apiKey) {
      setTimeout(() => {
        const localAnswer = findBestLocalMatch(text);
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: localAnswer || FALLBACK_MESSAGE,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isQuickFAQ: !!localAnswer
        };
        setMessages(prev => [...prev, botMsg]);
        setTyping(false);
      }, 1000 + Math.random() * 800); // realistic typing wait
      
      // Proactively prompt user if they typed query but have no API key
      if (!apiKey && !isMock) {
        setApiError("No API Key configured. Defaulted to high-fidelity Offline Demo Mode.");
      }
      return;
    }

    // --- LIVE ANTHROPIC CLAUDE API FLOW ---
    try {
      let url = "https://api.anthropic.com/v1/messages";
      
      // Support custom CORS proxies (e.g. https://cors-anywhere.herokuapp.com/)
      if (corsProxy.trim()) {
        const sanitizedProxy = corsProxy.endsWith('/') ? corsProxy : corsProxy + '/';
        url = sanitizedProxy + "https://api.anthropic.com/v1/messages";
      }

      // Gather simple single turn message format to prevent API context bloat
      const apiBody = {
        model: selectedModel,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: text
          }
        ]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify(apiBody)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Status ${response.status}: ${errText || response.statusText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || "";
      
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: content.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isQuickFAQ: !content.includes(FALLBACK_MESSAGE.substring(0, 15))
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Claude API call failed: ", err);
      
      let errMsg = err.message;
      if (err.message.includes("Failed to fetch") && !corsProxy) {
        // Detailed CORS warning helpful for browser testing
        errMsg = "CORS Block: Direct client-side calls to Anthropic's production server are blocked by modern browsers. Please use a local CORS proxy or switch to 'Demo Mode' in the Settings Panel.";
      }
      
      setApiError(errMsg);
      
      // Append fallback and toggle Demo suggestion
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `Error connecting to Claude API. \n\nDetails: "${errMsg}"\n\nReturning Local System Match:\n\n${findBestLocalMatch(text) || FALLBACK_MESSAGE}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // --- FILTERS ---
  const filteredFAQs = FAQ_DATABASE.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* 1. LEFT SIDEBAR: FAQ EXPLORER */}
      <aside className="w-80 border-r border-slate-800/60 bg-cosmic-950/70 backdrop-blur-md flex flex-col hidden lg:flex relative z-20">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800/60 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-stellar-purple/10 border border-stellar-purple/20">
            <Icons.Book />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-200 uppercase font-display">FAQ Catalog</h2>
            <p className="text-xs text-slate-400">15 Interactive Topics</p>
          </div>
        </div>

        {/* FAQ Search Bar */}
        <div className="p-3 border-b border-slate-800/40">
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Search space flights, costs, meals..."
              className="w-full text-xs text-slate-200 pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-lg placeholder-slate-500 focus:outline-none focus:border-stellar-purple/50 focus:ring-1 focus:ring-stellar-purple/20 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                <Icons.Close />
              </button>
            )}
          </div>
        </div>

        {/* FAQs List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <button
                key={faq.id}
                onClick={() => handleSend(faq.question)}
                className="w-full text-left p-3 rounded-xl border border-slate-800/40 bg-slate-900/30 hover:bg-stellar-purple/5 hover:border-stellar-purple/30 group transition-all duration-200 ease-out focus:outline-none"
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold font-display tracking-wider bg-slate-800/50 text-stellar-cyan border border-slate-700/30">
                    {faq.category}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-stellar-purple transition-colors duration-200 flex items-center">
                    Send <Icons.ArrowRight />
                  </span>
                </div>
                <h4 className="text-xs font-medium text-slate-300 group-hover:text-slate-100 transition-colors duration-200">
                  {faq.question}
                </h4>
              </button>
            ))
          ) : (
            <div className="text-center py-8 px-4 text-xs text-slate-500">
              No matching space guides found.
            </div>
          )}
        </div>
        
        {/* Footer Brand */}
        <div className="p-3 border-t border-slate-800/40 text-center">
          <span className="text-[10px] tracking-widest text-slate-500 uppercase font-display">&copy; Aetheris Space Corps</span>
        </div>
      </aside>

      {/* 2. CENTRAL CHAT SCREEN */}
      <main className="flex-1 flex flex-col bg-cosmic-950/20 backdrop-blur-[2px] relative z-10 overflow-hidden">
        
        {/* Main Header */}
        <header className="h-16 border-b border-slate-800/60 bg-cosmic-950/60 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Pulsating Logo Avatar */}
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center relative border border-stellar-cyan/30 shadow-glow-cyan">
              <Icons.Bot />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-stellar-cyan border-2 border-cosmic-950 status-pulse-cyan"></span>
            </div>
            
            {/* Title Details */}
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-wider font-display flex items-center gap-2">
                AETHERIS VOYAGE <span className="text-[9px] px-2 py-0.5 font-sans rounded-md tracking-normal font-medium bg-stellar-purple/10 text-stellar-violet border border-stellar-purple/20">AI FAQ</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-stellar-cyan mr-1.5 inline-block status-pulse-cyan"></span>
                {isMock || !apiKey ? "High-Fidelity Demo Server Online" : `Connected — Claude Model (${selectedModel})`}
              </p>
            </div>
          </div>

          {/* Quick Config Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 hover:text-stellar-violet hover:border-stellar-violet/40 hover:shadow-glow-violet group transition-all duration-300 focus:outline-none"
            title="Configure API and Prompt Settings"
          >
            <Icons.Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
          </button>
        </header>

        {/* Global Warnings Panel */}
        {apiError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-start justify-between gap-3 text-xs text-amber-200 relative z-30">
            <div>
              <Icons.Info />
              <span>{apiError}</span>
            </div>
            <button onClick={() => setApiError(null)} className="text-amber-400 hover:text-amber-200">
              <Icons.Close />
            </button>
          </div>
        )}

        {/* Chat Conversational Logs */}
        <section className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <div className="max-w-3xl mx-auto space-y-4">
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3.5 items-start message-animate ${msg.sender === 'user' ? 'justify-end' : ''}`}
              >
                {/* Bot Avatar Left */}
                {msg.sender === 'bot' && (
                  <div className="w-8.5 h-8.5 rounded-full glass-panel flex items-center justify-center border border-stellar-cyan/20">
                    <Icons.Bot className="w-4.5 h-4.5 text-stellar-cyan" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`max-w-[75%] rounded-2xl p-4 relative border transition-all ${
                  msg.sender === 'user' 
                    ? 'msg-user text-slate-100 rounded-tr-sm' 
                    : msg.isError 
                      ? 'bg-rose-950/15 border-rose-500/20 text-rose-200 rounded-tl-sm'
                      : 'glass-panel text-slate-200 border-slate-800/80 rounded-tl-sm shadow-glass'
                }`}>
                  
                  {/* Category Pill for Bot Matches */}
                  {msg.sender === 'bot' && msg.isQuickFAQ && (
                    <div className="text-[9px] font-semibold text-stellar-cyan uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-stellar-cyan inline-block"></span>
                      Verified Travel Guide
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  
                  <span className="block text-[9px] text-slate-500/85 mt-2.5 text-right font-medium tracking-wide">
                    {msg.timestamp}
                  </span>
                </div>

                {/* User Avatar Right */}
                {msg.sender === 'user' && (
                  <div className="w-8.5 h-8.5 rounded-full bg-stellar-purple/20 border border-stellar-purple/40 flex items-center justify-center">
                    <Icons.User />
                  </div>
                )}
              </div>
            ))}

            {/* Bouncing Typing Indicator bubble */}
            {typing && (
              <div className="flex gap-3.5 items-start">
                <div className="w-8.5 h-8.5 rounded-full glass-panel flex items-center justify-center border border-stellar-cyan/20">
                  <Icons.Bot className="w-4.5 h-4.5 text-stellar-cyan" />
                </div>
                <div className="glass-panel text-slate-200 border-slate-800/80 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* Suggested Quick Question Pills */}
        <section className="px-6 py-2 border-t border-slate-800/20 bg-cosmic-950/10">
          <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider self-center mr-1 whitespace-nowrap font-display">Suggestions:</span>
            <button 
              onClick={() => handleSend("What is Aetheris Voyage?")} 
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-stellar-cyan hover:border-stellar-cyan/30 hover:bg-stellar-cyan/5 transition-all duration-200 whitespace-nowrap focus:outline-none"
            >
              🚀 What is it?
            </button>
            <button 
              onClick={() => handleSend("How much does a suborbital flight cost?")} 
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-stellar-cyan hover:border-stellar-cyan/30 hover:bg-stellar-cyan/5 transition-all duration-200 whitespace-nowrap focus:outline-none"
            >
              💎 Ticket Cost
            </button>
            <button 
              onClick={() => handleSend("Is space travel safe?")} 
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-stellar-cyan hover:border-stellar-cyan/30 hover:bg-stellar-cyan/5 transition-all duration-200 whitespace-nowrap focus:outline-none"
            >
              🛡️ Safety Records
            </button>
            <button 
              onClick={() => handleSend("Is internet access available in space?")} 
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-stellar-cyan hover:border-stellar-cyan/30 hover:bg-stellar-cyan/5 transition-all duration-200 whitespace-nowrap focus:outline-none"
            >
              📡 Internet & Wi-Fi
            </button>
          </div>
        </section>

        {/* Input Textbar area */}
        <footer className="p-4 md:p-6 border-t border-slate-800/60 bg-cosmic-950/60 backdrop-blur-md relative z-10">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              placeholder={typing ? "Aetheris Bot is calculating..." : "Ask about prices, flight training, lunar cruises, cabins..."}
              className="flex-1 text-sm text-slate-100 px-4 py-3.5 rounded-xl border border-slate-800/60 bg-slate-950/80 placeholder-slate-500 focus:outline-none focus:border-stellar-cyan/60 focus:ring-1 focus:ring-stellar-cyan/20 transition-all duration-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={typing}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || typing}
              className="px-5 py-3.5 rounded-xl text-slate-100 flex items-center justify-center font-bold tracking-wider uppercase font-display shadow-glow-violet disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none btn-neon-violet focus:outline-none"
            >
              <span className="hidden sm:inline mr-2 text-xs font-semibold">TRANSMIT</span> <Icons.Send />
            </button>
          </div>
        </footer>
      </main>

      {/* 3. RIGHT SIDE DRAWER: API & PROMPT CONFIGURATION */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Drawer backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
          ></div>

          {/* Drawer Panel */}
          <section className="relative w-full max-w-md bg-cosmic-950 border-l border-slate-800 flex flex-col h-full z-10 shadow-glass-lg animate-[slide-fade-in_0.3s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icons.Cpu />
                <h3 className="text-sm font-bold tracking-wider font-display uppercase text-slate-200">Orbital Control Panel</h3>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
              >
                <Icons.Close />
              </button>
            </div>

            {/* Config Fields Form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Server Modes Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 font-display">System Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsMock(true)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold font-display tracking-wider transition-all duration-300 focus:outline-none ${
                      isMock 
                        ? 'bg-stellar-cyan/10 border-stellar-cyan/50 text-stellar-cyan shadow-glow-cyan' 
                        : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                    }`}
                  >
                    DEMO MODE
                  </button>
                  <button
                    onClick={() => {
                      setIsMock(false);
                      if (!apiKey) {
                        setApiError("Enter an Anthropic Claude API Key below to make live queries.");
                      }
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold font-display tracking-wider transition-all duration-300 focus:outline-none ${
                      !isMock 
                        ? 'bg-stellar-violet/10 border-stellar-violet/50 text-stellar-violet shadow-glow-violet' 
                        : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                    }`}
                  >
                    LIVE API MODE
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                  <Icons.Info /> 
                  {isMock 
                    ? "Demo mode matches search queries using local token-weight keyword scoring. Zero cost, works offline." 
                    : "Queries are sent to Anthropic's Claude API. Requires a valid API Key."}
                </p>
              </div>

              {/* Anthropic API Key input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">Anthropic API Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Icons.Key />
                  </div>
                  <input
                    type="password"
                    placeholder="sk-ant-api03-..."
                    className="w-full text-xs text-slate-200 pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-lg placeholder-slate-600 focus:outline-none focus:border-stellar-violet/50 focus:ring-1 focus:ring-stellar-violet/20 transition-all duration-300"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      if (e.target.value) setIsMock(false);
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Saved securely inside local storage. Never leaves your browser.
                </p>
              </div>

              {/* Optional CORS Proxy */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">CORS Proxy URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. http://localhost:8080/ or https://cors-anywhere..."
                  className="w-full text-xs text-slate-200 px-3 py-3 bg-slate-900/60 border border-slate-800 rounded-lg placeholder-slate-600 focus:outline-none focus:border-stellar-violet/50 focus:ring-1 focus:ring-stellar-violet/20 transition-all duration-300"
                  value={corsProxy}
                  onChange={(e) => setCorsProxy(e.target.value)}
                />
                <p className="text-[10px] text-slate-500 leading-normal">
                  Required if browser CORS rules block direct client-side requests to Anthropic.
                </p>
              </div>

              {/* Model selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-display">Claude Engine</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full text-xs text-slate-200 px-3 py-3 bg-slate-900/60 border border-slate-800 rounded-lg focus:outline-none focus:border-stellar-violet/50 transition-all duration-300"
                >
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                  <option value="claude-3-haiku-20240307">Claude 3 Haiku (Faster / Lighter)</option>
                </select>
              </div>

              {/* Custom system prompt */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-display">Agent Directives (System Prompt)</label>
                <textarea
                  rows="7"
                  className="w-full text-[11px] font-mono text-slate-300 p-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-stellar-violet/50 transition-all duration-300 leading-normal"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
                <p className="text-[10px] text-slate-500 leading-normal">
                  Dictates the bot's tone, knowledge scope, and specific intent matching constraints.
                </p>
              </div>
            </div>

            {/* Reset configurations */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
              <button
                onClick={() => {
                  if (confirm("Reset directives to standard flight guidelines?")) {
                    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
                    setSelectedModel("claude-3-5-sonnet-20241022");
                  }
                }}
                className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 font-display tracking-wider uppercase focus:outline-none"
              >
                Reset System Directives
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// Render root component
const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<App />);
