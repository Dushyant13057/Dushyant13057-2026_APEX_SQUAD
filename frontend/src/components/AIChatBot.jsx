import { useState, useRef, useEffect } from 'react';
import './AIChatBot.css';

// ── Canonical options that match the existing design state ──────────────────
const OUTFIT_OPTIONS = ['T-Shirt', 'Shirt', 'Hoodie', 'Jacket', 'Kurta', 'Pants'];
const OUTFIT_CATEGORY_MAP = {
  'T-Shirt': 'T-Shirt',
  'Shirt': 'Shirt',
  'Hoodie': 'Outerwear',
  'Jacket': 'Outerwear',
  'Kurta': 'Ethnic',
  'Pants': 'Bottom',
};
const COLOR_OPTIONS = [
  { name: 'Black',     hex: '#000000', aliases: ['black'] },
  { name: 'White',     hex: '#FFFFFF', aliases: ['white'] },
  { name: 'Navy Blue', hex: '#162447', aliases: ['navy', 'navy blue', 'dark blue', 'navy blue'] },
  { name: 'Red',       hex: '#C41E3A', aliases: ['red'] },
  { name: 'Green',     hex: '#2E8B57', aliases: ['green'] },
  { name: 'Beige',     hex: '#F5F5DC', aliases: ['beige', 'cream', 'ivory'] },
  { name: 'Maroon',    hex: '#800000', aliases: ['maroon', 'dark red', 'burgundy'] },
  { name: 'Blue',      hex: '#1E3A5F', aliases: ['blue'] },
  { name: 'Gold',      hex: '#d4a574', aliases: ['gold', 'golden', 'tan', 'camel'] },
];
const EMBROIDERY_OPTIONS = [
  { name: 'None',        cost: 0,   aliases: ['none', 'no embroidery', 'plain', 'clean'] },
  { name: 'Minimal',     cost: 200, aliases: ['minimal', 'simple', 'light embroidery', 'chain stitch', 'chain'] },
  { name: 'Floral',      cost: 300, aliases: ['floral', 'flower', 'cross stitch', 'botanical'] },
  { name: 'Traditional', cost: 400, aliases: ['traditional', 'ethnic', 'satin stitch', 'classic', 'desi'] },
  { name: 'Royal',       cost: 500, aliases: ['royal', 'heavy', 'zardozi', 'french knot', 'ornate', 'luxurious'] },
];
const FABRIC_OPTIONS = ['Cotton', 'Silk', 'Linen', 'Denim', 'Polyester', 'Wool', 'Velvet', 'Satin'];
const FIT_OPTIONS = ['tight', 'regular', 'loose', 'oversized'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
const PATTERN_OPTIONS = ['Solid', 'Stripes', 'Checks', 'Polka Dots', 'Herringbone'];

// ── Step-aware quick suggestions ────────────────────────────────────────────
const SUGGESTIONS = {
  1: ['Set height to 175cm', 'Switch to female model', 'Set chest to 42 inches', 'Make body type slim'],
  2: ['Use silk fabric', 'I want denim fabric', 'Switch to cotton', 'Use linen fabric'],
  3: ['Auto-cut my pattern', 'Add extra seam allowance'],
  4: ['Place all pieces', 'Reset placement'],
  5: ['Use gold thread', 'Make stitching thicker', 'Show cost breakdown'],
  6: ['Navy blue jacket', 'Red kurta with floral embroidery', 'Black oversized hoodie', 'White formal shirt'],
  7: ['Add traditional embroidery', 'No embroidery', 'Royal embroidery', 'Floral embroidery'],
  8: ['Make it navy blue', 'Apply stripes pattern', 'Use checks pattern', 'Change to black color'],
  9: ['Check feasibility', 'Show final summary', 'Save my design'],
};

// ── Global design suggestion buttons (shown always) ─────────────────────────
const DESIGN_SUGGESTIONS = [
  'Create a navy blue jacket',
  'Red kurti with embroidery',
  'Black oversized hoodie',
  'White formal shirt',
];

// ── Core NLP parser: extract design attributes from a natural language prompt ─
function parseDesignIntent(text) {
  const t = text.toLowerCase();
  const updates = {};
  const recognized = [];
  const unrecognized = [];

  // ── Outfit type ────────────────────────────────────────────────────────────
  let outfitMatched = null;
  if (t.includes('jacket')) outfitMatched = 'Jacket';
  else if (t.includes('hoodie') || t.includes('sweatshirt')) outfitMatched = 'Hoodie';
  else if (t.includes('kurta') || t.includes('kurti') || t.includes('tunic')) outfitMatched = 'Kurta';
  else if (t.includes('pant') || t.includes('trouser')) outfitMatched = 'Pants';
  else if (t.includes('shirt')) outfitMatched = 'Shirt';
  else if (t.includes('tshirt') || t.includes('t-shirt') || t.includes('tee')) outfitMatched = 'T-Shirt';

  if (outfitMatched) {
    updates.outfitType = outfitMatched;
    updates.outfit = outfitMatched;
    updates.outfitCategory = OUTFIT_CATEGORY_MAP[outfitMatched] || 'Custom';
    recognized.push(`✓ Outfit: **${outfitMatched}**`);
  }

  // ── Color ──────────────────────────────────────────────────────────────────
  let colorMatched = null;
  for (const col of COLOR_OPTIONS) {
    if (col.aliases.some(alias => t.includes(alias))) {
      colorMatched = col;
      break;
    }
  }
  if (colorMatched) {
    updates.clothColor = colorMatched.hex;
    updates.color = colorMatched.name;
    recognized.push(`✓ Color: **${colorMatched.name}**`);
  }

  // ── Embroidery ─────────────────────────────────────────────────────────────
  let embMatched = null;
  for (const emb of EMBROIDERY_OPTIONS) {
    if (emb.aliases.some(alias => t.includes(alias))) {
      embMatched = emb;
      break;
    }
  }
  if (embMatched) {
    updates.embroidery = embMatched.name;
    updates.embroideryType = embMatched.name;
    recognized.push(`✓ Embroidery: **${embMatched.name}**`);
  }

  // ── Fabric ─────────────────────────────────────────────────────────────────
  let fabricMatched = null;
  for (const fab of FABRIC_OPTIONS) {
    if (t.includes(fab.toLowerCase())) { fabricMatched = fab; break; }
  }
  if (fabricMatched) {
    updates.fabric = fabricMatched;
    recognized.push(`✓ Fabric: **${fabricMatched}**`);
  }

  // ── Fit type ───────────────────────────────────────────────────────────────
  let fitMatched = null;
  if (t.includes('oversized') || t.includes('baggy')) fitMatched = 'oversized';
  else if (t.includes('loose') || t.includes('relaxed')) fitMatched = 'loose';
  else if (t.includes('tight') || t.includes('slim fit') || t.includes('fitted')) fitMatched = 'tight';
  else if (t.includes('regular') || t.includes('normal fit') || t.includes('standard')) fitMatched = 'regular';
  else if (t.includes('formal')) fitMatched = 'regular';

  if (fitMatched) {
    updates.fitType = fitMatched;
    recognized.push(`✓ Fit: **${fitMatched.charAt(0).toUpperCase() + fitMatched.slice(1)}**`);
  }

  // ── Pattern ────────────────────────────────────────────────────────────────
  let patternMatched = null;
  if (t.includes('stripe')) patternMatched = 'Stripes';
  else if (t.includes('check')) patternMatched = 'Checks';
  else if (t.includes('polka') || t.includes('dot')) patternMatched = 'Polka Dots';
  else if (t.includes('herringbone')) patternMatched = 'Herringbone';
  else if (t.includes('solid') || t.includes('plain')) patternMatched = 'Solid';

  if (patternMatched) {
    updates.pattern = patternMatched;
    recognized.push(`✓ Pattern: **${patternMatched}**`);
  }

  // ── Size ───────────────────────────────────────────────────────────────────
  const sizeMatch = t.match(/\bsize\s*(s|m|l|xl|xxl)\b|\b(s|m|l|xl|xxl)\s*size\b|\b(xxl|xl)\b/i);
  if (sizeMatch) {
    const sizeRaw = (sizeMatch[1] || sizeMatch[2] || sizeMatch[3]).toUpperCase();
    if (SIZE_OPTIONS.includes(sizeRaw)) {
      updates.size = sizeRaw;
      recognized.push(`✓ Size: **${sizeRaw}**`);
    }
  }

  // ── Gender / body type ─────────────────────────────────────────────────────
  if (t.includes('female') || t.includes('woman') || t.includes('women')) {
    updates.gender = 'female';
    recognized.push(`✓ Gender: **Female**`);
  } else if (t.includes('male') || t.includes('man') || t.includes('men')) {
    updates.gender = 'male';
    recognized.push(`✓ Gender: **Male**`);
  }

  if (t.includes('muscular') || t.includes('athletic')) {
    updates.bodyType = 'muscular';
    recognized.push(`✓ Body Type: **Muscular**`);
  } else if (t.includes('slim') || t.includes('thin') || t.includes('lean')) {
    updates.bodyType = 'slim';
    recognized.push(`✓ Body Type: **Slim**`);
  } else if (t.includes('plus size') || t.includes('heavy')) {
    updates.bodyType = 'oversized';
    recognized.push(`✓ Body Type: **Plus Size**`);
  }

  // ── Measurements ───────────────────────────────────────────────────────────
  const heightM = t.match(/height\s*[:\-]?\s*(\d+)\s*cm/);
  if (heightM) { updates.height = parseInt(heightM[1]); recognized.push(`✓ Height: **${updates.height} cm**`); }
  const chestM = t.match(/chest\s*[:\-]?\s*(\d+)\s*(in|inch)?/);
  if (chestM) { updates.chest = parseInt(chestM[1]); recognized.push(`✓ Chest: **${updates.chest} in**`); }
  const waistM = t.match(/waist\s*[:\-]?\s*(\d+)\s*(in|inch)?/);
  if (waistM) { updates.waist = parseInt(waistM[1]); recognized.push(`✓ Waist: **${updates.waist} in**`); }

  // ── Detect truly unknown specific requests ─────────────────────────────────
  const hasNonDesignWords = t.match(/\b(lace|emboss|leather|dye|vintage|neon|camouflage|velcro|zipper|hood|turtleneck)\b/);
  if (hasNonDesignWords && recognized.length === 0) {
    const unknownWord = hasNonDesignWords[0];
    unrecognized.push(unknownWord);
  }

  return { updates, recognized, unrecognized };
}

export default function AIChatBot({ currentStep, design, setDesign, onAction }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: '👋 Hi! I\'m your **Design AI Assistant**.\n\nTell me what you want to create — I\'ll update your design instantly!\n\n**Try:** *"Create a navy blue jacket with traditional embroidery"* or tap a suggestion below.',
    },
  ]);
  const [input, setInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(null); // for "Apply Design" confirmation
  const chatEnd = useRef(null);
  const fileRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Image handlers ──────────────────────────────────────────────────────────
  const handleImageData = (dataUrl, source = 'uploaded') => {
    setMessages(prev => [...prev,
      { role: 'user', text: `📎 ${source === 'pasted' ? 'Pasted' : source === 'dropped' ? 'Dropped' : 'Uploaded'} reference image`, image: dataUrl },
      { role: 'ai', text: '🖼️ I received your reference image!\n\nTell me what specific elements you want to apply from this image:\n• *"use the color from this"*\n• *"make the collar like this"*\n• *"I want this exact design"*' },
    ]);
  };

  const readFileAsDataUrl = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleImageData(ev.target.result, 'uploaded');
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      if (!open) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (ev) => handleImageData(ev.target.result, 'pasted');
            reader.readAsDataURL(blob);
          }
          return;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [open]);

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    const files = e.dataTransfer?.files;
    if (files?.length > 0 && files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => handleImageData(ev.target.result, 'dropped');
      reader.readAsDataURL(files[0]);
      return;
    }
    const html = e.dataTransfer?.getData('text/html');
    if (html) {
      const match = html.match(/src="(https?:\/\/[^"]+)"/);
      if (match) {
        setMessages(prev => [...prev,
          { role: 'user', text: '🔗 Dropped reference image URL', image: match[1] },
          { role: 'ai', text: '🖼️ Got your reference! Tell me what you want me to do with this design.' },
        ]);
      }
    }
  };

  // ── Core command processor ──────────────────────────────────────────────────
  const processCommand = (text) => {
    const t = text.toLowerCase().trim();

    // ── Help query ─────────────────────────────────────────────────────────────
    if (t === 'help' || t.includes('what can you do') || t.includes('how do i')) {
      return {
        response: '🤖 **I can help you with:**\n\n• **Outfit** — jacket, hoodie, shirt, kurta, t-shirt, pants\n• **Color** — black, white, navy blue, red, green, maroon, beige\n• **Embroidery** — none, minimal, floral, traditional, royal\n• **Fit** — tight, regular, loose, oversized\n• **Pattern** — solid, stripes, checks, polka dots\n• **Fabric** — cotton, silk, denim, linen, wool\n• **Size** — S, M, L, XL, XXL\n• **Gender / body type** — male, female, slim, muscular\n• **Measurements** — height, chest, waist\n\n**Try:** *"Create a navy blue jacket with traditional embroidery"*',
        updates: {},
      };
    }

    // ── Fabric-only info ───────────────────────────────────────────────────────
    if (!t.match(/\b(jacket|hoodie|shirt|kurta|pants|tshirt|t-shirt|tee|create|make|give|want|set|change|apply|use)\b/i)) {
      if (t.includes('silk')) return { response: '🧵 **Silk** is a premium fabric at ₹800/m. Go to **Step 2** to select it!', updates: {} };
      if (t.includes('cotton')) return { response: '🧵 **Cotton** is comfortable at ₹250/m. Go to **Step 2** to select it!', updates: {} };
      if (t.includes('denim')) return { response: '🧵 **Denim** is durable at ₹350/m. Go to **Step 2** to select it!', updates: {} };
    }

    // ── Parse multi-attribute design intent ────────────────────────────────────
    const { updates, recognized, unrecognized } = parseDesignIntent(text);

    if (recognized.length > 0) {
      let response = `🎨 **Design Updated:**\n\n${recognized.join('\n')}`;
      if (unrecognized.length > 0) {
        response += `\n\n⚠️ *"${unrecognized.join(', ')}"* is not available in current options.`;
      }
      response += '\n\n✅ Applied to your design!';
      return { response, updates };
    }

    // ── Nothing matched — give helpful suggestion ──────────────────────────────
    if (unrecognized.length > 0) {
      return {
        response: `❌ Sorry, **"${unrecognized.join(', ')}"** is not a supported option.\n\nAvailable options:\n• **Outfits**: Jacket, Hoodie, Shirt, Kurta, T-Shirt, Pants\n• **Colors**: Black, White, Navy Blue, Red, Green, Maroon, Beige\n• **Embroidery**: None, Minimal, Floral, Traditional, Royal\n• **Fit**: Tight, Regular, Loose, Oversized`,
        updates: {},
      };
    }

    return {
      response: `🤖 I understood: *"${text}"*\n\nTry asking me:\n• *"Create a navy blue jacket"*\n• *"Red kurta with traditional embroidery"*\n• *"Black oversized hoodie"*\n• *"White formal shirt size L"*`,
      updates: {},
    };
  };

  // ── Apply a command ─────────────────────────────────────────────────────────
  const applyCommand = (text) => {
    const { response, updates } = processCommand(text);
    if (Object.keys(updates).length > 0) {
      setDesign(d => ({ ...d, ...updates }));
    }
    return response;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setTimeout(() => {
      const response = applyCommand(userText);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 350);
  };

  const handleSuggestionClick = (s) => {
    setMessages(prev => [...prev, { role: 'user', text: s }]);
    setTimeout(() => {
      const response = applyCommand(s);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 350);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) readFileAsDataUrl(file);
    e.target.value = '';
  };

  // ── Current design state summary ────────────────────────────────────────────
  const getDesignSummary = () => {
    const outfit = design.outfitType || design.outfit || '—';
    const color = design.color || '—';
    const emb = (typeof design.embroideryType === 'object' ? design.embroideryType?.name : design.embroideryType) || '—';
    const fit = design.fitType || '—';
    return `${outfit} · ${color} · ${emb} · ${fit}`;
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setOpen(!open)} title="AI Design Assistant">
        {open ? '✕' : '🤖'}
      </button>
      {open && (
        <div className={`chat-panel ${dragOver ? 'drag-over' : ''}`} ref={panelRef}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-ai-dot"></span>
              <span>Design AI Assistant</span>
            </div>
            <span className="chat-step-badge">Step {currentStep}</span>
          </div>

          {/* Design state bar */}
          <div style={{
            fontSize: '0.72rem',
            color: '#d4a574',
            padding: '6px 12px',
            background: 'rgba(212,165,116,0.08)',
            borderBottom: '1px solid rgba(212,165,116,0.1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            🎨 {getDesignSummary()}
          </div>

          {/* Global design quick suggestions */}
          <div className="chat-suggestions" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
            {DESIGN_SUGGESTIONS.map((s, i) => (
              <button key={`ds_${i}`} className="chat-suggestion" onClick={() => handleSuggestionClick(s)}>
                {s}
              </button>
            ))}
          </div>

          {/* Step-aware suggestions */}
          {(SUGGESTIONS[currentStep] || []).length > 0 && (
            <div className="chat-suggestions">
              {(SUGGESTIONS[currentStep] || []).map((s, i) => (
                <button key={i} className="chat-suggestion" onClick={() => handleSuggestionClick(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.image && <img src={m.image} alt="ref" className="chat-img" />}
                <div
                  className="chat-text"
                  dangerouslySetInnerHTML={{
                    __html: m.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />
              </div>
            ))}
            {dragOver && <div className="chat-drop-zone"><span>📎 Drop image here</span></div>}
            <div ref={chatEnd} />
          </div>

          {/* Input area */}
          <div className="chat-input-area">
            <button className="chat-upload-btn" onClick={() => fileRef.current?.click()} title="Upload image">📎</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Try: "navy blue jacket with traditional embroidery"'
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send" onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
