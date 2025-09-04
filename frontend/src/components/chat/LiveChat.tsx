'use client';
import { useEffect } from 'react';

export const LiveChat = () => {
  useEffect(() => {
    // Tidio chat widget integration
    // Note: Replace 'YOUR_TIDIO_KEY' with actual Tidio public key when ready
    const script = document.createElement('script');
    script.src = '//code.tidio.co/YOUR_TIDIO_KEY.js';
    script.async = true;
    
    // Only add if not already present
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount (optional, Tidio handles this)
      const scriptToRemove = document.querySelector(`script[src="${script.src}"]`);
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }
    };
  }, []);

  return null; // Widget handles its own UI
};

// Alternative: Simple custom chat bubble (placeholder until Tidio is configured)
export const ChatBubble = () => {
  const handleChatClick = () => {
    // For now, redirect to WhatsApp
    const message = "Hi! I need help with your real estate services.";
    const phoneNumber = "+2349076614145";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleChatClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Start chat"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
};