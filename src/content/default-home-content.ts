import type { HomeContent } from '@/types/cms';

export const defaultHomeContent: HomeContent = {
  navigation: { brandName: 'DhiSoft', logoText: 'D', links: [{ label: 'Products', href: '#products' }, { label: 'Platform', href: '#platform' }, { label: 'Pricing', href: '#pricing' }, { label: 'Contact', href: '#contact' }], cta: { label: 'Book Demo', href: '#contact' } },
  seo: { title: 'DhiSoft | SaaS for Travel, Hotels & Fleet Operations', description: 'Modern SaaS systems for fleet vendors, hotel integrations, itinerary automation, and AI booking workflows.', keywords: ['travel SaaS', 'hotel API', 'fleet software', 'booking automation', 'NestJS development'], ogImage: '/images/cloud-bg.avif' },
  hero: { backgroundImage: '/images/cloud-bg.avif', badge: 'SaaS infrastructure for travel, hotels and fleet businesses', titlePrefix: 'Build smarter booking, fleet and hotel systems with', titleHighlight: 'DhiSoft', description: 'We design and build custom SaaS platforms for travel agencies, vehicle vendors, hotel integrations and AI-powered booking operations.', primaryCta: { label: 'Start your SaaS project', href: '#contact' }, secondaryCta: { label: 'View solutions', href: '#products' } },
  audiences: ['Travel Agents', 'Fleet Vendors', 'Hotels', 'Tour Operators', 'Corporate Travel', 'Channel Managers', 'AI Assistants', 'Booking APIs'],
  products: { eyebrow: 'Products & Solutions', heading: 'Everything your travel operation needs to move faster.', items: [
    { key: 'fleet-vendor-saas', icon: 'CarFront', title: 'Fleet & Vendor SaaS', text: 'Vehicle availability, vendor dashboards, driver assignment, trip tracking, billing and commissions in one clean system.', sortOrder: 10, isActive: true },
    { key: 'hotel-channel-apis', icon: 'Hotel', title: 'Hotel Channel APIs', text: 'Connect hotels, rate plans, room availability, occupancy keys, booking push APIs and supplier inventory workflows.', sortOrder: 20, isActive: true },
    { key: 'ai-booking-assistants', icon: 'Bot', title: 'AI Booking Assistants', text: 'WhatsApp and web chatbots for agents, itinerary requests, quotation support and customer follow-ups.', sortOrder: 30, isActive: true },
    { key: 'itinerary-automation', icon: 'Route', title: 'Itinerary Automation', text: 'Smart route planning, hotspot sequencing, travel-time buffers and optimized day-wise itinerary generation.', sortOrder: 40, isActive: true },
  ] },
  platform: { eyebrow: 'Platform Engineering', heading: 'Built like a serious SaaS product, not a temporary website.', description: 'From API architecture to dashboards, automation and AI layers, DhiSoft helps you convert manual travel operations into scalable software systems.', features: ['Multi-role dashboards', 'NestJS-ready APIs', 'Real-time status flows', 'Redis cache friendly', 'GraphQL dashboard layer', 'Vendor commission logic', 'Invoice generation', 'Audit-safe operations'] },
  capabilities: { items: [
    { key: 'custom-saas-builds', icon: 'CloudCog', title: 'Custom SaaS Builds', text: 'Frontend, backend, dashboards, database design, deployment and integrations.', sortOrder: 10, isActive: true },
    { key: 'api-integrations', icon: 'Network', title: 'API Integrations', text: 'Hotel APIs, booking push APIs, payment gateways, maps, CRM and WhatsApp flows.', sortOrder: 20, isActive: true },
    { key: 'automation-layer', icon: 'Zap', title: 'Automation Layer', text: 'Reduce manual follow-up, repeated quoting, itinerary edits and operational reporting.', sortOrder: 30, isActive: true },
  ] },
  pricing: { heading: 'Start with one module. Scale into a complete SaaS platform.', description: 'Ideal for travel companies that want to launch quickly, validate with real users and then expand into a full product suite.', cardLabel: 'Engagement starts from', priceText: 'Custom', cardDescription: 'Discovery, design, MVP build, API integration, deployment and support packages available.', cta: { label: 'Discuss project', href: '#contact' } },
  footer: { brandName: 'DhiSoft', description: 'SaaS systems for travel, fleet, hotel and AI booking operations.', email: 'hello@dhisoft.com' },
  dashboard: { enabled: true, revenue: '$4,900', revenueTarget: '$10,000 target', uptime: '99.9%', dataPoints: '520k+', growth: '49%' },
};
