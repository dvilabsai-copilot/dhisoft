'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot, Building2, CarFront, CheckCircle2, CloudCog, Hotel, Network, Route, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import FloatingObjects from '@/components/FloatingObjects';
import DashboardMock from '@/components/DashboardMock';

const services = [
  { icon: CarFront, title: 'Fleet & Vendor SaaS', text: 'Vehicle availability, vendor dashboards, driver assignment, trip tracking, billing and commissions in one clean system.' },
  { icon: Hotel, title: 'Hotel Channel APIs', text: 'Connect hotels, rate plans, room availability, occupancy keys, booking push APIs and supplier inventory workflows.' },
  { icon: Bot, title: 'AI Booking Assistants', text: 'WhatsApp and web chatbots for agents, itinerary requests, quotation support and customer follow-ups.' },
  { icon: Route, title: 'Itinerary Automation', text: 'Smart route planning, hotspot sequencing, travel-time buffers and optimized day-wise itinerary generation.' }
];

const logos = ['Travel Agents', 'Fleet Vendors', 'Hotels', 'Tour Operators', 'Corporate Travel', 'Channel Managers', 'AI Assistants', 'Booking APIs'];

const features = [
  'Multi-role dashboards', 'NestJS-ready APIs', 'Real-time status flows', 'Redis cache friendly', 'GraphQL dashboard layer', 'Vendor commission logic', 'Invoice generation', 'Audit-safe operations'
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fbff] via-[#eef6ff] to-white px-5 pb-20 pt-6 md:pb-28">
        <FloatingObjects />
        <nav className="glass relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
          <div className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-white">D</span>
            DhiSoft
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#products">Products</a>
            <a href="#platform">Platform</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <a href="#contact" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">Book Demo</a>
        </nav>

        <div className="relative z-10 mx-auto mt-20 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
          >
            <Sparkles className="h-4 w-4" /> SaaS infrastructure for travel, hotels and fleet businesses
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-5xl text-5xl font-bold tracking-tight text-slate-950 md:text-7xl"
          >
            Build smarter booking, fleet and hotel systems with <span className="gradient-text">DhiSoft</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600"
          >
            We design and build custom SaaS platforms for travel agencies, vehicle vendors, hotel integrations and AI-powered booking operations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-9 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-500/20">
              Start your SaaS project <ArrowRight className="h-5 w-5" />
            </a>
            <a href="#products" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-800 shadow-sm">
              View solutions
            </a>
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto mt-16 max-w-7xl">
          <DashboardMock />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/60 py-5">
        <div className="animate-marquee flex w-[200%] gap-8 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          {[...logos, ...logos, ...logos].map((item, index) => <span key={index}>{item}</span>)}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 font-semibold text-blue-600">Products & Solutions</p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">Everything your travel operation needs to move faster.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <service.icon className="mb-8 h-9 w-9 text-blue-600" />
              <h3 className="text-2xl font-bold text-slate-950">{service.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{service.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="platform" className="bg-slate-950 px-5 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 font-semibold text-cyan-300">Platform Engineering</p>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Built like a serious SaaS product, not a temporary website.</h2>
            <p className="mt-6 leading-8 text-slate-300">From API architecture to dashboards, automation and AI layers, DhiSoft helps you convert manual travel operations into scalable software systems.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [CloudCog, 'Custom SaaS Builds', 'Frontend, backend, dashboards, database design, deployment and integrations.'],
            [Network, 'API Integrations', 'Hotel APIs, booking push APIs, payment gateways, maps, CRM and WhatsApp flows.'],
            [Zap, 'Automation Layer', 'Reduce manual follow-up, repeated quoting, itinerary edits and operational reporting.']
          ].map(([Icon, title, text]: any) => (
            <div key={title} className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <Icon className="mb-8 h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 pb-24">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-slate-950 p-8 text-white md:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <Building2 className="mb-8 h-10 w-10 text-cyan-200" />
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Start with one module. Scale into a complete SaaS platform.</h2>
              <p className="mt-6 max-w-2xl leading-8 text-blue-100">Ideal for travel companies that want to launch quickly, validate with real users and then expand into a full product suite.</p>
            </div>
            <div className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-2xl">
              <p className="text-sm font-semibold text-blue-600">Engagement starts from</p>
              <p className="mt-2 text-5xl font-bold">Custom</p>
              <p className="mt-4 leading-7 text-slate-600">Discovery, design, MVP build, API integration, deployment and support packages available.</p>
              <a href="#contact" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-semibold text-white">
                Discuss project <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-200 bg-white px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold">DhiSoft</h3>
            <p className="mt-2 text-slate-600">SaaS systems for travel, fleet, hotel and AI booking operations.</p>
          </div>
          <a href="mailto:hello@dhisoft.com" className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white">hello@dhisoft.com</a>
        </div>
      </footer>
    </main>
  );
}
