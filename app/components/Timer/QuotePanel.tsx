'use client'

import { useQuotes } from '../../../hooks/useQuotes';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export const QuotePanel = () => {
  const { quote, isLoading, error, fetchNewQuote } = useQuotes();

  return (
    <div className="bg-gradient-to-br from-[#2D2A6E] to-[#2D2A6E]/90 rounded-2xl p-6 shadow-xl border border-white/10">
      <div className="text-center space-y-4 relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white/60"
            >
              Loading inspiration...
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-400"
            >
              Failed to load quote
            </motion.div>
          ) : quote && (
            <motion.div
              key={quote.quote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl">{quote.quote}</p>
              <p className="text-white/60 mt-4">- {quote.author} -</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={fetchNewQuote}
          className="absolute top-0 right-0 p-2 text-white/40 hover:text-white/80 
            transition-colors rounded-lg hover:bg-white/5"
          disabled={isLoading}
        >
          <RefreshCw 
            size={16} 
            className={`${isLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
    </div>
  );
};