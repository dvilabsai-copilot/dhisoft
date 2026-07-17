'use client';

import { motion } from 'framer-motion';

const objects = [
  { className: 'left-[7%] top-[18%] h-28 w-28 bg-blue-500/20', x: [0, 34, 0], y: [0, -30, 0], d: 9 },
  { className: 'right-[8%] top-[12%] h-36 w-36 bg-teal-400/20', x: [0, -28, 0], y: [0, 26, 0], d: 10 },
  { className: 'left-[20%] bottom-[18%] h-20 w-20 bg-indigo-500/16', x: [0, 26, 0], y: [0, 24, 0], d: 8 },
  { className: 'right-[22%] bottom-[16%] h-24 w-24 bg-cyan-400/18', x: [0, -24, 0], y: [0, -22, 0], d: 11 }
];

export default function FloatingObjects() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="noise absolute inset-0 opacity-[0.08]" />
      {objects.map((item, index) => (
        <motion.div
          key={index}
          animate={{ x: item.x, y: item.y, rotate: [0, 10, -8, 0] }}
          transition={{ duration: item.d, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute rounded-full blur-3xl ${item.className}`}
        />
      ))}

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute right-[18%] top-[28%] h-56 w-56 rounded-full border border-slate-300/50"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute right-[20%] top-[31%] h-40 w-40 rounded-full border border-dashed border-blue-300/60"
      />
    </div>
  );
}
