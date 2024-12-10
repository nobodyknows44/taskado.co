import { useState, useEffect } from 'react';

interface Quote {
  quote: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    quote: "Done is better than perfect.",
    author: "Sheryl Sandberg"
  },
  {
    quote: "Time is the most valuable thing you can spend.",
    author: "Theophrastus"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali"
  },
  {
    quote: "Success is not final, failure is not fatal.",
    author: "Winston Churchill"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  }
];

export function useQuotes() {
  const [quote, setQuote] = useState<Quote>(QUOTES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNewQuote = () => {
    setIsLoading(true);
    try {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setQuote(QUOTES[randomIndex]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get quote'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuote();
  }, []);

  return { 
    quote, 
    isLoading, 
    error, 
    fetchNewQuote 
  };
} 