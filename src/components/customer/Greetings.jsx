import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) return "Good Morning..!";
  if (currentHour >= 12 && currentHour < 17) return "Good Afternoon..!";
  if (currentHour >= 17 && currentHour < 21) return "Good Evening..!";
  return "Hello..!!!!!";
};

const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export default function Greetings() {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div {...slideUp} className="px-4 mt-2">
      <h1 className="text-[29px] font-spartan-bold">{greeting}</h1>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '12rem' }}
        transition={{ duration: 0.8 }}
        className="h-1 bg-orange-500 mt-1"
      />
    </motion.div>
  );
}