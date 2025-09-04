'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  User,
  Bot,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type: 'text' | 'system';
}

interface LiveChatProps {
  /** Whether to show the chat widget */
  enabled?: boolean;
  /** Position of the chat button */
  position?: 'bottom-right' | 'bottom-left';
  /** Custom branding colors */
  primaryColor?: string;
  /** Tidio public key (if using Tidio) */
  tidioKey?: string;
  /** Custom greeting message */
  greetingMessage?: string;
}

const LiveChat: React.FC<LiveChatProps> = ({
  enabled = true,
  position = 'bottom-right',
  primaryColor = '#10b981', // emerald-500
  tidioKey,
  greetingMessage = "Hi! 👋 How can we help you with your real estate needs today?"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isInfoCollected, setIsInfoCollected] = useState(false);

  // Initialize Tidio if key is provided
  useEffect(() => {
    if (tidioKey && typeof window !== 'undefined') {
      // Load Tidio script
      const script = document.createElement('script');
      script.src = `//code.tidio.co/${tidioKey}.js`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup if needed
        const existingScript = document.querySelector(`script[src="//code.tidio.co/${tidioKey}.js"]`);
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [tidioKey]);

  // Initialize with greeting message
  useEffect(() => {
    if (enabled && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: greetingMessage,
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, [enabled, greetingMessage, messages.length]);

  // Quick response options
  const quickResponses = [
    "I'm looking to buy a property",
    "I want to sell my property", 
    "I need a property valuation",
    "Schedule a viewing",
    "Investment opportunities",
    "Speak to an agent"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate agent response (replace with real chat service integration)
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(inputMessage),
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
      
      if (!isOpen) {
        setHasNewMessage(true);
      }
    }, 1500);
  };

  const getAgentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('buy') || message.includes('purchase')) {
      return "Great! I'd be happy to help you find your perfect property. What type of property are you looking for and what's your budget range?";
    } else if (message.includes('sell')) {
      return "Excellent! We can help you sell your property quickly and at the best price. Can you tell me about your property - location, type, and when you're looking to sell?";
    } else if (message.includes('valuation') || message.includes('value')) {
      return "We offer free property valuations! I can connect you with one of our expert agents. What's the property address you'd like valued?";
    } else if (message.includes('viewing') || message.includes('view')) {
      return "I can help you schedule a property viewing. Which property are you interested in, or would you like me to suggest some based on your preferences?";
    } else if (message.includes('investment')) {
      return "We have excellent investment opportunities! Are you looking for rental properties, commercial real estate, or development projects?";
    } else if (message.includes('agent') || message.includes('speak') || message.includes('call')) {
      return "I'll connect you with one of our expert agents right away! They can provide detailed assistance. Would you prefer a phone call or WhatsApp message?";
    } else {
      return "Thank you for your message! Our expert team will get back to you shortly. In the meantime, feel free to browse our properties or ask me any questions about our services.";
    }
  };

  const handleQuickResponse = (response: string) => {
    setInputMessage(response);
    setTimeout(() => handleSendMessage(), 100);
  };

  const collectUserInfo = () => {
    if (!userInfo.name || !userInfo.email) {
      return;
    }
    
    setIsInfoCollected(true);
    const infoMessage: Message = {
      id: 'info-collected',
      text: `Thanks ${userInfo.name}! I have your contact details. How can I assist you today?`,
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, infoMessage]);
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  if (!enabled) return null;

  // If using Tidio, don't show custom chat
  if (tidioKey) {
    return null;
  }

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <AnimatePresence>
        {/* Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 ${
              isMinimized ? 'w-80 h-16' : 'w-80 h-96'
            } flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 text-white rounded-t-2xl"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">XlideLand Support</h3>
                  <p className="text-xs opacity-90">Online now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {!isInfoCollected && (
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-3">To better assist you, please share your details:</p>
                      <div className="space-y-2">
                        <Input
                          placeholder="Your name"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Email address"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="text-sm"
                        />
                        <Input
                          placeholder="Phone number (optional)"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="text-sm"
                        />
                        <Button 
                          onClick={collectUserInfo}
                          disabled={!userInfo.name || !userInfo.email}
                          className="w-full text-xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  )}

                  {isInfoCollected && (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                              message.sender === 'user'
                                ? 'text-white rounded-br-sm'
                                : 'bg-white text-gray-800 rounded-bl-sm border'
                            }`}
                            style={{
                              backgroundColor: message.sender === 'user' ? primaryColor : undefined
                            }}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white p-3 rounded-2xl rounded-bl-sm border">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Responses */}
                      {messages.length <= 1 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 text-center">Quick responses:</p>
                          <div className="grid grid-cols-1 gap-1">
                            {quickResponses.slice(0, 3).map((response) => (
                              <button
                                key={response}
                                onClick={() => handleQuickResponse(response)}
                                className="text-xs p-2 bg-white border rounded-lg hover:bg-gray-50 text-left"
                              >
                                {response}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Input */}
                {isInfoCollected && (
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 text-sm"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        size="sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex justify-center space-x-4 mt-2">
                      <button
                        onClick={() => window.open('tel:+2349012345678')}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={() => window.open('mailto:hello@xlideland.com.ng')}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <Mail className="h-3 w-3" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewMessage(false);
        }}
        className="relative w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <MessageCircle className="h-6 w-6 mx-auto" />
        
        {/* New message indicator */}
        {hasNewMessage && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        )}
        
        {/* Pulse animation */}
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: primaryColor }}
        ></div>
      </motion.button>
    </div>
  );
};

export default LiveChat;