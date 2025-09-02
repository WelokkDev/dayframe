import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const AIChatBubble = ({ 
  type = 'task-preview', // 'task-preview', 'clarification', 'info'
  title,
  content,
  onAccept,
  onDecline,
  onResponse,
  isVisible = true,
  showChat = false,
  placeholder = "Type your response...",
  autoFocus = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-expand for clarifications
  useEffect(() => {
    if (type === 'clarification') {
      setIsExpanded(true);
    }
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() && onResponse) {
      setIsTyping(true);
      onResponse(userInput.trim());
      setUserInput('');
      setIsTyping(false);
    }
  };

  const getBubbleStyle = () => {
    switch (type) {
      case 'task-preview':
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200';
      case 'clarification':
        return 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200';
      case 'info':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200';
      default:
        return 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'task-preview':
        return '📋';
      case 'clarification':
        return '❓';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'task-preview':
        return 'text-blue-800';
      case 'clarification':
        return 'text-amber-800';
      case 'info':
        return 'text-emerald-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0.8, 
            y: 20,
            rotateX: -15
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: -20,
            rotateX: 15
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.4
          }}
          className="w-full max-w-md mx-auto mb-4"
        >
          {/* Main Bubble */}
          <motion.div
            className={`relative rounded-2xl border-2 shadow-lg overflow-hidden ${getBubbleStyle()}`}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getIcon()}</span>
                <h3 className={`font-semibold text-lg ${getTitleColor()}`}>
                  {title}
                </h3>
              </div>
              
              {type === 'task-preview' && (
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1 rounded-full hover:bg-white/50 transition-colors"
                >
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>
              )}
            </div>

            {/* Content */}
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? 'auto' : '0px' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                {typeof content === 'string' ? (
                  <p className="text-gray-700 leading-relaxed">{content}</p>
                ) : (
                  <div className="space-y-3">
                    {content}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons for Task Preview */}
            {type === 'task-preview' && (
              <motion.div 
                className="flex space-x-2 p-4 pt-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  onClick={onAccept}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Accept
                </motion.button>
                <motion.button
                  onClick={onDecline}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Decline
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Chat Interface */}
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-3"
            >
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition-colors"
                    disabled={isTyping}
                  />
                  {isTyping && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <motion.button
                  type="submit"
                  disabled={!userInput.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatBubble;
