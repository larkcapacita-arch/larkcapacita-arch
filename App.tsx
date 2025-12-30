
import React, { useState, useEffect, useRef } from 'react';
import { Step, UserData, PersonalityChoice, Theme, ArtStyle, GeneratedAvatar } from './types';
import { PERSONALITY_CHOICES, THEMES, ART_STYLES, MOTIVATIONS, AFFIRMATIONS } from './constants';
import { generateAvatar } from './geminiService';

const Layout: React.FC<{ children: React.ReactNode, currentStep: Step, onShareApp: () => void }> = ({ children, currentStep, onShareApp }) => (
  <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 max-w-4xl mx-auto overflow-x-hidden">
    <header className="w-full flex justify-between items-center mb-12">
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-slate-200">
              <span className="text-white text-xs font-bold">LC</span>
          </div>
          <span className="font-bold tracking-widest text-sm uppercase">Lark Capacita</span>
      </div>
      <div className="flex items-center gap-4">
        {currentStep !== Step.Hero && currentStep !== Step.Results && (
             <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 font-bold hidden md:block border border-slate-100 px-3 py-1 rounded-full">
                Secure Session
             </div>
        )}
        <button 
          onClick={onShareApp}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
          title="Spread the Vision"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </button>
      </div>
    </header>
    <main className="w-full flex-grow flex flex-col fade-in">
      {children}
    </main>
    <footer className="w-full mt-12 py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
      <p>© 2024 LARK CAPACITA. All Rights Reserved.</p>
      <div className="flex gap-6">
          <a href="https://instagram.com/larkcapacita" target="_blank" className="hover:text-pink-600 transition-colors flex items-center gap-1 font-bold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
            Instagram
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
      </div>
    </footer>
  </div>
);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Hero);
  const [userData, setUserData] = useState<UserData>({ fullName: '', role: '', email: '' });
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityChoice | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<Record<string, ArtStyle>>({});
  const [generatedAvatars, setGeneratedAvatars] = useState<GeneratedAvatar[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [interestSelection, setInterestSelection] = useState<string>('');
  const [unlockEmail, setUnlockEmail] = useState('');
  const [submittedInterest, setSubmittedInterest] = useState(false);
  
  // Sharing State
  const [sharingAvatarIndex, setSharingAvatarIndex] = useState<number | null>(null);
  const [sharingApp, setSharingApp] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const next = (step: Step) => setCurrentStep(step);

  const downloadAvatarWithOverlay = async (avatar: GeneratedAvatar) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = avatar.url;
    });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 1024;
    canvas.height = 1024;
    ctx.drawImage(img, 0, 0, 1024, 1024);
    
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.fillRect(0, 800, 1024, 224);

    const traitWord = avatar.theme.split(' ').map(w => w.toLowerCase()).join('_');
    const affirmation = AFFIRMATIONS[traitWord] || "I am infinite potential.";

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText(affirmation.toUpperCase(), 512, 840);

    ctx.fillStyle = "white";
    ctx.font = "italic 28px serif";
    ctx.fillText(`"${avatar.motivation}"`, 512, 900);

    ctx.font = "bold 12px Inter, sans-serif";
    ctx.letterSpacing = "5px";
    ctx.globalAlpha = 0.4;
    ctx.fillText("THANK YOU, LARK CAPACITA, FOR THE MOTIVATION.", 512, 970);
    
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `LarkCapacita_Identity_${avatar.theme.replace(/\s+/g, '_')}.png`;
    link.click();
    return canvas.toDataURL('image/png');
  };

  const handleDownloadAll = async () => {
    for (const avatar of generatedAvatars) {
      await downloadAvatarWithOverlay(avatar);
      await new Promise(r => setTimeout(r, 600));
    }
  };

  const handleShareAvatar = (index: number) => {
    setSharingAvatarIndex(index);
    setSharingApp(false);
    setCopyStatus(null);
  };

  const handleShareAppGlobal = () => {
    setSharingApp(true);
    setSharingAvatarIndex(null);
    setCopyStatus(null);
  };

  const executeShare = async (platform: 'twitter' | 'linkedin' | 'instagram' | 'whatsapp', avatar?: GeneratedAvatar) => {
    const appLink = window.location.href;
    const shareText = avatar 
      ? `Behold my future self as a ${avatar.theme}! 🚀\n\n"${avatar.motivation}"\n\nExperience the larkcapacita-persona-ai-avatar journey: ${appLink}\n\n#LarkCapacita #AI #Identity #FutureSelf #larkcapacita-persona-ai-avatar`
      : `I just mapped my future self with the Lark Capacita - Persona AI Avatar experience. 🚀\n\nSee who you are becoming: ${appLink}\n\n#LarkCapacita #AI #Persona #FutureSelf #larkcapacita-persona-ai-avatar`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appLink)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'instagram':
        if (avatar) {
          await downloadAvatarWithOverlay(avatar);
          navigator.clipboard.writeText(shareText);
          setCopyStatus('Identity Saved & Caption Copied! Open Instagram to Post.');
        } else {
          navigator.clipboard.writeText(shareText);
          setCopyStatus('Link & Hashtags Copied! Paste in your Bio/Story.');
        }
        setTimeout(() => setCopyStatus(null), 4000);
        break;
    }
  };

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    next(Step.Personality);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access required for facial capture.");
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvasRef.current.toDataURL('image/jpeg'));
      }
    }
  };

  const toggleTheme = (theme: Theme) => {
    if (selectedThemes.find(t => t.id === theme.id)) {
      setSelectedThemes(selectedThemes.filter(t => t.id !== theme.id));
    } else if (selectedThemes.length < 3) {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  const startGeneration = async () => {
    if (!capturedImage || !selectedPersonality || selectedThemes.length !== 3) return;
    next(Step.Generating);
    const results: GeneratedAvatar[] = [];
    for (let i = 0; i < selectedThemes.length; i++) {
      const theme = selectedThemes[i];
      const style = selectedStyles[theme.id] || ART_STYLES[i % ART_STYLES.length];
      setLoadingProgress((i / selectedThemes.length) * 100);
      const url = await generateAvatar(capturedImage, theme, style, selectedPersonality);
      results.push({
        url,
        theme: theme.label,
        style: style.label,
        motivation: MOTIVATIONS[theme.id.toLowerCase().replace(/\s+/g, '_')]?.[Math.floor(Math.random() * 2)] || "My potential is limitless.",
        category: theme.category
      });
    }
    setGeneratedAvatars(results);
    setLoadingProgress(100);
    setTimeout(() => next(Step.Results), 800);
  };

  const isAnyModalOpen = sharingAvatarIndex !== null || sharingApp;

  return (
    <Layout currentStep={currentStep} onShareApp={handleShareAppGlobal}>
      {currentStep === Step.Hero && (
        <div className="text-center py-12 md:py-24 animate-fade-in">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight">
            See Yourself as the Person <br/>
            <span className="italic font-normal text-slate-500">You Are Becoming</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Upload your photo, discover your personality tone, and generate goal-driven avatars that reflect your future self in action.
          </p>
          <div className="flex flex-col items-center gap-6">
            <button 
                onClick={() => next(Step.LeadCapture)}
                className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
            >
                Create My Avatar
            </button>
            <button 
                onClick={handleShareAppGlobal}
                className="text-[10px] uppercase tracking-widest text-slate-400 font-black hover:text-slate-900 transition-colors border-b border-transparent hover:border-slate-900 pb-1"
            >
                Spread the Vision
            </button>
          </div>
        </div>
      )}

      {/* Social Sharing Modal */}
      {isAnyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => { setSharingAvatarIndex(null); setSharingApp(false); }}>
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl scale-in border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
                {sharingApp ? 'Spread the Vision' : 'Broadcast Identity'}
              </h3>
              <button onClick={() => { setSharingAvatarIndex(null); setSharingApp(false); }} className="text-slate-300 hover:text-slate-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* WhatsApp */}
              <button 
                onClick={() => executeShare('whatsapp', sharingAvatarIndex !== null ? generatedAvatars[sharingAvatarIndex] : undefined)}
                className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all hover:scale-[1.05] active:scale-95 group"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
                </div>
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-500">WhatsApp</span>
              </button>

              {/* Instagram */}
              <button 
                onClick={() => executeShare('instagram', sharingAvatarIndex !== null ? generatedAvatars[sharingAvatarIndex] : undefined)}
                className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-[#E1306C]/10 hover:bg-[#E1306C]/20 transition-all hover:scale-[1.05] active:scale-95 group relative border border-pink-200"
              >
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white px-2 py-0.5 rounded-full text-[7px] font-black uppercase animate-bounce">Active</div>
                <div className="w-12 h-12 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </div>
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-500">Instagram</span>
              </button>

              {/* X / Twitter */}
              <button 
                onClick={() => executeShare('twitter', sharingAvatarIndex !== null ? generatedAvatars[sharingAvatarIndex] : undefined)}
                className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-black/5 hover:bg-black/10 transition-all hover:scale-[1.05] active:scale-95 group"
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </div>
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-500">X / Twitter</span>
              </button>

              {/* LinkedIn */}
              <button 
                onClick={() => executeShare('linkedin', sharingAvatarIndex !== null ? generatedAvatars[sharingAvatarIndex] : undefined)}
                className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 transition-all hover:scale-[1.05] active:scale-95 group"
              >
                <div className="w-12 h-12 bg-[#0077b5] rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </div>
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-500">LinkedIn</span>
              </button>
            </div>

            {copyStatus && (
               <div className="mt-8 p-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl text-center animate-fade-in shadow-xl">
                  {copyStatus}
               </div>
            )}

            <p className="mt-8 text-[9px] text-slate-300 text-center leading-relaxed italic">
               Follow us <a href="https://instagram.com/larkcapacita" target="_blank" className="underline font-bold text-slate-400 hover:text-slate-900 transition-colors">@larkcapacita</a> for more future vision.
            </p>
          </div>
        </div>
      )}

      {currentStep === Step.LeadCapture && (
        <div className="max-w-md mx-auto w-full animate-fade-in">
          <h2 className="text-3xl font-bold mb-2 text-center italic">Begin Your Journey</h2>
          <p className="text-slate-500 mb-8 text-center font-light">Tell us a bit about who you are today.</p>
          <form onSubmit={handleLeadCapture} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                placeholder="Your name"
                value={userData.fullName}
                onChange={(e) => setUserData({...userData, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Title / Role</label>
              <select 
                required
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white transition-all text-sm"
                value={userData.role}
                onChange={(e) => setUserData({...userData, role: e.target.value})}
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Creator">Creator</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                placeholder="your@email.com"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center italic leading-relaxed">
              “Privacy-first. Your data remains yours.”
            </p>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">
              Continue
            </button>
          </form>
        </div>
      )}

      {currentStep === Step.Personality && (
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center italic">Which statement feels most like you right now?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERSONALITY_CHOICES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonality(p)}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedPersonality?.id === p.id 
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.02]' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <p className="text-sm italic mb-2 opacity-80 leading-relaxed font-light">"{p.statement}"</p>
                {selectedPersonality?.id === p.id && (
                    <div className="mt-4 border-t border-white/20 pt-4 animate-fade-in">
                         <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Archetype:</span>
                         <p className="font-bold text-lg">{p.label}</p>
                    </div>
                )}
              </button>
            ))}
          </div>
          {selectedPersonality && (
            <div className="mt-12 text-center p-8 bg-slate-50 rounded-3xl animate-fade-in">
              <p className="text-slate-600 italic leading-relaxed font-light">
                {selectedPersonality.description}
              </p>
              <button 
                onClick={() => next(Step.FaceCapture)}
                className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Visualize This Personality
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === Step.FaceCapture && (
        <div className="max-w-xl mx-auto w-full text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-2 italic">Secure Facial Capture</h2>
          <p className="text-slate-500 mb-8 text-sm font-light">Encrypted processing for your avatar generation.</p>
          
          <div className="relative aspect-video bg-slate-100 rounded-3xl overflow-hidden mb-6 border-8 border-white shadow-2xl group">
             {!capturedImage ? (
                <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale-[0.2]" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-48 h-48 border-2 border-dashed border-white/40 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 px-4">
                        <button onClick={startCamera} className="flex-1 bg-white/95 backdrop-blur text-slate-900 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white transition-all shadow-xl">
                            Camera Mode
                        </button>
                        <button onClick={handleCapture} className="bg-slate-900 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </button>
                        <label className="flex-1 bg-white/95 backdrop-blur text-slate-900 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer hover:bg-white transition-all shadow-xl text-center">
                            Upload Photo
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setCapturedImage(ev.target?.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }} />
                        </label>
                    </div>
                </>
             ) : (
                <div className="relative w-full h-full animate-fade-in">
                    <img src={capturedImage} className="w-full h-full object-cover" />
                    <button onClick={() => setCapturedImage(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
             )}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left space-y-5 mb-10">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 border-b border-slate-50 pb-2">Privacy Protocols</h4>
            <div className="flex items-start gap-4 cursor-pointer group" onClick={() => setConsent1(!consent1)}>
                <div className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${consent1 ? 'bg-slate-900 border-slate-900 scale-105' : 'border-slate-300 group-hover:border-slate-400'}`}>
                    {consent1 && <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                </div>
                <label className="text-sm text-slate-600 font-light select-none cursor-pointer leading-snug">I consent to facial image use exclusively for avatar generation.</label>
            </div>
            <div className="flex items-start gap-4 cursor-pointer group" onClick={() => setConsent2(!consent2)}>
                <div className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${consent2 ? 'bg-slate-900 border-slate-900 scale-105' : 'border-slate-300 group-hover:border-slate-400'}`}>
                    {consent2 && <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                </div>
                <label className="text-sm text-slate-600 font-light select-none cursor-pointer leading-snug">I understand no persistent biometrics are stored or shared.</label>
            </div>
          </div>

          <button 
            disabled={!capturedImage || !consent1 || !consent2}
            onClick={() => next(Step.ThemeSelection)}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em] text-xs"
          >
            Confirm & Continue
          </button>
        </div>
      )}

      {currentStep === Step.ThemeSelection && (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 italic">Architect Your Future Self</h2>
            <p className="text-slate-500 italic font-light">Choose exactly 3 avatar themes from the groups below.</p>
          </div>
          
          <div className="space-y-12">
            {/* REGULAR GROUP */}
            <div>
              <div className="flex items-center gap-3 mb-6 border-l-4 border-blue-400 pl-4">
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Regular: Digital Blueprints</h3>
                <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Holographic Focus</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {THEMES.filter(t => t.category === 'regular').map((theme) => (
                    <button key={theme.id} onClick={() => toggleTheme(theme)} className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center gap-3 relative group ${selectedThemes.find(t => t.id === theme.id) ? 'border-slate-900 bg-white shadow-xl -translate-y-1' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}>
                        {selectedThemes.find(t => t.id === theme.id) && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] animate-scale-in">
                                {selectedThemes.findIndex(t => t.id === theme.id) + 1}
                            </div>
                        )}
                        <span className="text-4xl group-hover:scale-110 transition-transform">{theme.emoji}</span>
                        <p className="font-bold text-sm tracking-wide">{theme.label}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-medium">{theme.description}</p>
                    </button>
                ))}
              </div>
            </div>

            {/* MODERN GROUP */}
            <div>
              <div className="flex items-center gap-3 mb-6 border-l-4 border-emerald-400 pl-4">
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Modern: Physical Manifestations</h3>
                <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">New & Diverse</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {THEMES.filter(t => t.category === 'modern').map((theme) => (
                    <button key={theme.id} onClick={() => toggleTheme(theme)} className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center gap-3 relative group ${selectedThemes.find(t => t.id === theme.id) ? 'border-slate-900 bg-white shadow-xl -translate-y-1' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}>
                        {selectedThemes.find(t => t.id === theme.id) && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] animate-scale-in">
                                {selectedThemes.findIndex(t => t.id === theme.id) + 1}
                            </div>
                        )}
                        <span className="text-4xl group-hover:scale-110 transition-transform">{theme.emoji}</span>
                        <p className="font-bold text-sm tracking-wide">{theme.label}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-medium">{theme.description}</p>
                    </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <button disabled={selectedThemes.length !== 3} onClick={() => next(Step.ArtStyleSelection)} className="px-16 py-5 bg-slate-900 text-white rounded-full font-bold shadow-2xl disabled:opacity-30 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs">
                Next: Choose Aesthetics ({selectedThemes.length}/3)
            </button>
          </div>
        </div>
      )}

      {currentStep === Step.ArtStyleSelection && (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold mb-12 text-center italic">Define Visual Aesthetics</h2>
          <div className="space-y-12">
            {selectedThemes.map((theme, idx) => (
                <div key={theme.id} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-3xl">{theme.emoji}</span>
                        <div>
                            <h3 className="font-bold text-xl">{theme.label}</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium italic">Apply Art Style</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {ART_STYLES.map(style => (
                            <button key={style.id} onClick={() => setSelectedStyles(prev => ({ ...prev, [theme.id]: style }))} className={`p-4 rounded-xl border text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${selectedStyles[theme.id]?.id === style.id ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                                {style.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <button onClick={startGeneration} className="px-16 py-5 bg-slate-900 text-white rounded-full font-bold shadow-2xl hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-xs">
                Generate My Future Identities
            </button>
          </div>
        </div>
      )}

      {currentStep === Step.Generating && (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto">
            <div className="w-32 h-32 relative mb-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-slate-900 animate-spin"></div>
                <div className="absolute inset-4 rounded-full border-4 border-slate-100 border-b-slate-900 animate-spin-slow"></div>
            </div>
            <h2 className="text-3xl font-bold mb-4 italic text-slate-900">Manifesting Your Identity...</h2>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-8">
                <div className="bg-slate-900 h-full transition-all duration-700 ease-out" style={{ width: `${loadingProgress}%` }} />
            </div>
            <div className="space-y-4 text-slate-500 italic text-sm font-light">
                <p className={loadingProgress > 20 ? 'opacity-100 transition-opacity' : 'opacity-20'}>Applying privacy encryption to facial features...</p>
                <p className={loadingProgress > 50 ? 'opacity-100 transition-opacity' : 'opacity-20'}>Weaving metaphors into action sequences...</p>
                <p className={loadingProgress > 80 ? 'opacity-100 transition-opacity' : 'opacity-20'}>Manifesting high-fidelity LARK CAPACITA quality...</p>
            </div>
        </div>
      )}

      {currentStep === Step.Results && (
        <div className="w-full max-w-5xl mx-auto fade-in">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 italic text-slate-900 leading-tight">Your Future Self has Taken Shape</h2>
            <p className="text-slate-500 max-w-2xl mx-auto mb-8 text-sm italic font-light leading-relaxed">Identity manifests as action. These avatars reflect the metaphorical power of your ambition.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <button onClick={handleDownloadAll} className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download All Identities
                </button>
                <button onClick={handleShareAppGlobal} className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 shadow-xl">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    Spread the Vision
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 justify-center items-stretch">
            {generatedAvatars.map((avatar, idx) => {
                const traitWord = avatar.theme.toLowerCase().replace(/\s+/g, '_');
                const affirmation = AFFIRMATIONS[traitWord] || "I am my own limit.";
                
                return (
                    <div key={idx} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col items-center hover:shadow-2xl transition-all duration-500 group relative">
                        <div className={`absolute -top-4 px-6 py-1 rounded-full font-black text-[9px] uppercase tracking-widest z-10 shadow-lg ${avatar.category === 'regular' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                            {avatar.theme}
                        </div>
                        
                        <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden mb-10 bg-slate-50 shadow-inner group-hover:shadow-2xl transition-all border border-slate-50">
                            <img src={avatar.url} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                        </div>
                        
                        <div className="flex-grow space-y-6 text-center w-full px-2">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none">Affirmation</p>
                                <p className="text-slate-900 font-black text-base uppercase tracking-wide leading-tight px-4">
                                    {affirmation}
                                </p>
                            </div>
                            
                            <div className="space-y-2 pt-2 border-t border-slate-50">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none">Action Metaphor</p>
                                <p className="text-slate-600 font-serif text-lg leading-relaxed italic font-light px-2">
                                    "{avatar.motivation}"
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 w-full space-y-4">
                            <button onClick={() => downloadAvatarWithOverlay(avatar)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                                Download Persona
                            </button>
                            
                            <button onClick={() => handleShareAvatar(idx)} className="w-full border-2 border-slate-900 text-slate-900 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                Broadcast Identity
                            </button>
                            
                            <div className="pt-2 space-y-1 text-center opacity-40 group-hover:opacity-100 transition-opacity">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                    {affirmation}
                                </p>
                                <p className="text-[8px] text-slate-300 tracking-[0.1em] font-medium leading-relaxed max-w-[200px] mx-auto uppercase">
                                    Thank you, LARK CAPACITA.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
          </div>

          <div className="bg-slate-900 text-white rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-bold mb-8 italic text-white/90">The journey begins within.</h3>
                <p className="text-white/60 mb-12 max-w-xl mx-auto italic text-sm md:text-base leading-relaxed font-light">
                    Ready for your complementary DISC assessment? Submit your details to unlock advanced identity mapping. Once finished, email your results to <strong>larkcapacita@gmail.com</strong> for a high-fidelity coaching session.
                </p>
                
                <div className="max-w-md mx-auto mb-12 space-y-4">
                    <select className="w-full p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm appearance-none cursor-pointer text-center font-medium shadow-inner" value={interestSelection} onChange={(e) => { setInterestSelection(e.target.value); setSubmittedInterest(false); }}>
                        <option value="" className="text-slate-900">Choose Interest</option>
                        <option value="interested" className="text-slate-900">Interested to unlock persona identity</option>
                        <option value="later" className="text-slate-900">I will try another time</option>
                    </select>

                    {interestSelection === 'interested' && !submittedInterest && (
                        <div className="flex flex-col gap-4 animate-fade-in">
                            <input type="email" placeholder="Verify your email address" className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm text-center" value={unlockEmail} onChange={(e) => setUnlockEmail(e.target.value)} />
                            <button onClick={() => setSubmittedInterest(true)} className="w-full bg-white text-slate-900 px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all active:scale-95 shadow-xl">
                                Request Assessment
                            </button>
                        </div>
                    )}

                    {submittedInterest && interestSelection === 'interested' && (
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl animate-fade-in backdrop-blur-xl">
                            <p className="text-xs uppercase tracking-[0.3em] font-black text-white mb-2">Request Logged</p>
                            <p className="text-[10px] text-white/40 font-light italic leading-relaxed">Your identity mapping session request has been queued. Join our community for further updates and access links.</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <a href="https://whatsapp.com/channel/0029Vb7T7FsGpLHZ3Bb9AH1e" target="_blank" className="bg-white text-slate-900 px-14 py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl">
                        Join Community
                    </a>
                </div>

                <div className="mt-20 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex gap-6">
                        <a href="https://instagram.com/larkcapacita" target="_blank" className="text-[10px] opacity-40 hover:opacity-100 transition-all uppercase tracking-[0.4em] font-black flex items-center gap-2">
                          <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                          Instagram @larkcapacita
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl" onClick={handleShareAppGlobal} style={{cursor: 'pointer'}}>
                            <span className="text-slate-900 text-xs font-bold">LC</span>
                        </div>
                        <span className="font-black tracking-[0.5em] text-[10px] uppercase">Lark Capacita</span>
                    </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[200px] opacity-10 -mr-64 -mt-64"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-500 rounded-full blur-[200px] opacity-10 -ml-64 -mb-64"></div>
          </div>
          
          <div className="mt-12 text-center text-[8px] text-slate-300 uppercase tracking-[0.4em] font-black pb-12 opacity-40">
               larkcapacita-persona-ai-avatar • Built for visionaries
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
