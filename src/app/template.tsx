'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }} // ลดระยะขยับจาก 10 เหลือ 5 เพื่อความเร็ว
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.25, // เร็วขึ้น (Standard iOS feel)
        ease: [0.4, 0, 0.2, 1], // Fast Out, Slow In (Smooth & Snappy)
      }}
      style={{ 
        width: '100%',
        willChange: 'opacity, transform' // บอกเบราว์เซอร์เตรียมการ์ดจอรอไว้เลย
      }}
    >
      {children}
    </motion.div>
  );
}
