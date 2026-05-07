'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Bot, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

function CardRevenue() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Revenue</p>
        <Activity className="h-3.5 w-3.5 text-green-400" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">$4,900</p>
        <p className="text-[10px] text-slate-400">/ $10,000 target</p>
      </div>
      <div className="space-y-1">
        {[['Starter', '$580'], ['Standard', '$860'], ['Premium', '$320']].map(([plan, val]) => (
          <div key={plan} className="flex items-center justify-between text-[10px] text-slate-600">
            <span>{plan}</span><span className="font-semibold">{val}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5 text-[10px]">
        <span className="text-slate-500">Income</span>
        <span className="font-bold text-green-600">$2,670</span>
        <span className="text-slate-500">Expense</span>
        <span className="font-bold text-red-500">$1,200</span>
      </div>
    </div>
  );
}

function CardAI() {
  return (
    <div className="flex h-full flex-col justify-between bg-slate-950 text-white">
      <div className="flex items-center gap-1">
        <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
        <p className="text-[10px] font-semibold text-slate-300">Expertise</p>
      </div>
      <p className="text-xs font-semibold leading-snug">
        Combines Strategy, <span className="text-blue-300">Data,</span> and Artificial Intelligence
      </p>
      <div className="h-16 overflow-hidden rounded-xl bg-white/5">
        <svg viewBox="0 0 120 48" className="w-full" preserveAspectRatio="none">
          <polyline points="0,40 20,30 40,34 60,18 80,22 100,10 120,14" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <polyline points="0,40 20,30 40,34 60,18 80,22 100,10 120,14 120,48 0,48" fill="rgba(56,189,248,0.12)" />
        </svg>
      </div>
    </div>
  );
}

function CardDataTraining() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-blue-50 text-center">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white">
        <span className="text-lg font-bold leading-none">+</span>
      </div>
      <p className="text-xs font-semibold text-slate-800">Data training</p>
      <p className="text-[10px] text-slate-500">Upload your content</p>
    </div>
  );
}

function CardPerformance() {
  return (
    <div className="flex h-full flex-col justify-between bg-slate-950 text-white">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-slate-400">Performance</p>
        <Activity className="h-3.5 w-3.5 text-green-400" />
      </div>
      <div>
        <p className="text-3xl font-bold">49%</p>
        <p className="text-[10px] text-green-400">Business growth</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {['Strategic', 'AI-Focused', 'Smarter', 'Grow Faster', 'Build Smart'].map((t) => (
          <span key={t} className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-300">{t}</span>
        ))}
      </div>
    </div>
  );
}

function CardCalendar() {
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="text-[10px] font-semibold text-slate-500">Integrations</p>
      <div className="space-y-1.5">
        {[
          { icon: CheckCircle, label: 'Calendar', color: 'text-blue-500' },
          { icon: Bot, label: 'Messages', color: 'text-teal-500' }
        ].map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-1.5">
            <Icon className={`h-3.5 w-3.5 ${color}`} />
            <span className="text-[10px] font-medium text-slate-700">{label}</span>
            <span className="ml-auto text-[9px] font-semibold text-green-500">live</span>
          </div>
        ))}
      </div>
      <div className="flex h-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-100 to-teal-100">
        <span className="text-[10px] font-medium text-teal-600">Scenic Route</span>
      </div>
    </div>
  );
}

function CardIntelligence() {
  return (
    <div className="flex h-full flex-col justify-between">
      <p className="text-[10px] font-semibold text-slate-500">Platform</p>
      <p className="text-xs font-bold leading-tight text-slate-900">Intelligence in<br />Every Decision</p>
      <div>
        <p className="text-2xl font-bold text-slate-900">520k+</p>
        <p className="text-[10px] text-slate-400">Data Points</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {['Strategic', 'Smarter', 'Grow Faster', 'AI+'].map((t) => (
          <span key={t} className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600">{t}</span>
        ))}
      </div>
    </div>
  );
}

function CardAgent() {
  return (
    <div className="flex h-full flex-col justify-between bg-slate-950 text-white">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
        <p className="text-[10px] text-slate-300">API Uptime 99.9%</p>
      </div>
      <div className="my-2 flex flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-white">A</div>
        <p className="text-[10px] text-slate-300">AI Agent</p>
      </div>
      <div className="text-[10px] font-semibold text-green-400">Online</div>
    </div>
  );
}

const CARD_RAIL = [
  { id: 'revenue', Component: CardRevenue, bg: 'bg-white' },
  { id: 'uptime', Component: CardAgent, bg: 'bg-slate-950' },
  { id: 'platform', Component: CardIntelligence, bg: 'bg-white' },
  { id: 'expertise', Component: CardAI, bg: 'bg-slate-950' },
  { id: 'training', Component: CardDataTraining, bg: 'bg-blue-50' },
  { id: 'performance', Component: CardPerformance, bg: 'bg-slate-950' },
  { id: 'integrations', Component: CardCalendar, bg: 'bg-white' }
];

export default function DashboardMock() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const arcOffsets = [36, 18, 2, -18, 2, 18, 36];
  const scales = [0.86, 0.94, 1.02, 1.1, 1.02, 0.94, 0.86];
  const opacity = [0.55, 0.75, 0.95, 1, 0.95, 0.75, 0.55];
  const tilts = [-12, -7, -3, 2, 6, 10, 14];
  const duplicatedCards = [...CARD_RAIL, ...CARD_RAIL];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="relative mx-auto flex h-[520px] w-full max-w-[1600px] items-center overflow-hidden rounded-[48px]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/cloud-bg.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-white/5" />
      <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-white/40 to-transparent" />

      <motion.div
        className="relative z-10 flex w-max items-center gap-12 px-10 md:gap-14 md:px-16 will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: isMobile ? 58 : 42, repeat: Infinity, ease: 'linear' }}
      >
        {duplicatedCards.map((item, index) => {
          const arcY = arcOffsets[index % arcOffsets.length];
          const scale = scales[index % scales.length];
          const cardOpacity = opacity[index % opacity.length];
          const tilt = tilts[index % tilts.length];

          return (
            <motion.div
              key={`${item.id}-${index}`}
              className={`relative h-[245px] w-[180px] shrink-0 overflow-hidden rounded-[28px] p-4 shadow-[0_38px_90px_rgba(15,23,42,0.14),0_14px_32px_rgba(148,163,184,0.22)] ${item.bg}`}
              style={{
                rotateZ: `${tilt}deg`,
                scale,
                opacity: cardOpacity,
                transformOrigin: 'center center',
              }}
              animate={{ y: [arcY, arcY - 10, arcY, arcY + 6, arcY] }}
              transition={{
                duration: 5 + (index % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.12,
              }}
              whileHover={{ scale: 1.04, y: -12 }}
            >
              <div className="pointer-events-none absolute inset-x-6 -top-7 h-12 rounded-full bg-white/55 blur-2xl" />
              <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 via-transparent to-cyan-200/10" />
              <item.Component />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/30 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/30 to-transparent" />
    </motion.div>
  );
}
