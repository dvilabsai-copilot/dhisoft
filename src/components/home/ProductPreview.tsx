import { Check, ChevronDown, CircleDot, FileText, Gauge, MapPin, MoreHorizontal, Package, Search, Users } from 'lucide-react';
import type { CmsProject } from '@/types/cms';

function MiniBar({ width, tone = 'blue' }: { width: string; tone?: 'blue' | 'teal' | 'orange' }) {
  const colors = { blue: 'bg-blue-500', teal: 'bg-teal-400', orange: 'bg-orange-400' };
  return <span className={`block h-1.5 rounded-full ${colors[tone]}`} style={{ width }} />;
}

function AppChrome({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <div className={`product-window overflow-hidden rounded-[1.35rem] border shadow-2xl ${dark ? 'border-white/10 bg-slate-950' : 'border-slate-200 bg-white'}`}>
    <div className={`flex items-center gap-2 border-b px-4 py-3 ${dark ? 'border-white/10' : 'border-slate-100'}`}>
      <span className="h-2 w-2 rounded-full bg-rose-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" />
      <div className={`ml-3 flex h-5 flex-1 items-center rounded-md px-3 text-[9px] ${dark ? 'bg-white/5 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>app.dhisoft / workspace</div>
      <MoreHorizontal className={`h-4 w-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
    </div>{children}
  </div>;
}

function RuralPreview() {
  return <AppChrome><div className="grid min-h-[260px] grid-cols-[76px_1fr] bg-slate-50"><aside className="border-r border-slate-200 bg-white p-3"><div className="mb-7 grid h-7 w-7 place-items-center rounded-lg bg-slate-950 text-[10px] font-bold text-white">R</div><div className="space-y-4 text-slate-400"><Gauge className="h-4 w-4 text-blue-500" /><Users className="h-4 w-4" /><FileText className="h-4 w-4" /><Package className="h-4 w-4" /></div></aside><div className="p-5"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-600">Programme overview</p><h4 className="mt-1 text-base font-bold text-slate-900">Livelihood pipeline</h4></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600">All regions live</span></div><div className="mt-5 grid grid-cols-4 gap-2">{[['Candidates','1,284'],['In training','438'],['Placed','186'],['Retention','92%']].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-2.5"><p className="text-[8px] text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-900">{value}</p></div>)}</div><div className="mt-4 rounded-xl border border-slate-200 bg-white p-3"><div className="flex items-center justify-between text-[9px] font-semibold text-slate-600"><span>Candidate journey</span><span className="text-blue-600">View workflow</span></div><div className="mt-5 flex items-center justify-between">{['Counselling', 'Training', 'Assessment', 'Employment'].map((item, index) => <div key={item} className="flex flex-1 flex-col items-center gap-2 text-center"><span className={`grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold ${index < 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{index < 3 ? <Check className="h-3.5 w-3.5" /> : '4'}</span><span className="text-[8px] text-slate-500">{item}</span></div>)}</div></div></div></div></AppChrome>;
}

function RainwoodPreview() {
  return <AppChrome dark><div className="min-h-[260px] bg-slate-950 p-5 text-white"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[0.18em] text-teal-300">Direct booking engine</p><h4 className="mt-1 text-base font-bold">Stay availability</h4></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] text-emerald-300">Inventory synced</span></div><div className="mt-5 grid gap-3 sm:grid-cols-[1.05fr_.95fr]"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><div className="flex items-center justify-between text-[9px] text-slate-400"><span>12 rooms available</span><span>18–21 Sep</span></div><div className="mt-4 grid grid-cols-7 gap-1">{Array.from({ length: 21 }, (_, index) => <span key={index} className={`h-4 rounded-sm ${[5, 6, 12, 13].includes(index) ? 'bg-teal-400' : index % 4 === 0 ? 'bg-orange-300' : 'bg-white/10'}`} />)}</div><div className="mt-5 flex items-center gap-3 text-[9px] text-slate-400"><span className="flex items-center gap-1"><CircleDot className="h-3 w-3 text-teal-300" /> Available</span><span className="flex items-center gap-1"><CircleDot className="h-3 w-3 text-orange-300" /> Hold</span></div></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[9px] text-slate-400">Selected room</p><div className="mt-3 flex items-start justify-between"><div><p className="text-sm font-semibold">Garden suite</p><p className="mt-1 text-[9px] text-slate-400">2 guests · breakfast included</p></div><p className="text-sm font-bold text-teal-300">₹18,400</p></div><div className="mt-5 space-y-2 text-[9px] text-slate-300"><p className="flex justify-between"><span>Inventory hold</span><span className="text-emerald-300">Active</span></p><p className="flex justify-between"><span>Payment webhook</span><span className="text-emerald-300">Idempotent</span></p></div><button className="mt-5 w-full rounded-lg bg-teal-300 py-2 text-[9px] font-bold text-slate-950">Continue reservation</button></div></div></div></AppChrome>;
}

function CommunityPreview() {
  return <AppChrome><div className="min-h-[260px] bg-[#f8fafc] p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-orange-500">Community operations</p><h4 className="mt-1 text-base font-bold text-slate-900">This week in the neighbourhood</h4></div><span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-semibold text-orange-600">24 events</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-600">Tonight · 7:00 PM</span><span className="text-[9px] text-emerald-600">8 spots left</span></div><h5 className="mt-4 text-sm font-bold text-slate-900">Terrace movie night</h5><p className="mt-1 text-[9px] text-slate-500">Clubhouse · Members only</p><div className="mt-5 flex items-center justify-between"><div className="flex -space-x-1"><span className="grid h-5 w-5 place-items-center rounded-full bg-orange-200 text-[8px]">A</span><span className="grid h-5 w-5 place-items-center rounded-full bg-teal-200 text-[8px]">M</span><span className="grid h-5 w-5 place-items-center rounded-full bg-blue-200 text-[8px]">S</span></div><button className="rounded-lg bg-slate-950 px-3 py-2 text-[9px] font-semibold text-white">Reserve slot</button></div></div><div className="rounded-xl bg-slate-950 p-3 text-white"><p className="text-[9px] text-slate-400">Contribution status</p><p className="mt-3 text-2xl font-bold">₹84,200</p><p className="mt-1 text-[9px] text-emerald-300">62% verified this month</p><div className="mt-6"><MiniBar width="62%" tone="orange" /></div><div className="mt-3 flex justify-between text-[9px] text-slate-400"><span>Collected</span><span>Pending review</span></div></div></div></div></AppChrome>;
}

function TravelPreview() {
  return <AppChrome><div className="min-h-[260px] bg-slate-50 p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-600">Travel operations</p><h4 className="mt-1 text-base font-bold text-slate-900">Pipeline this week</h4></div><Search className="h-4 w-4 text-slate-400" /></div><div className="mt-5 grid grid-cols-4 gap-2">{[['Enquiry','18'],['Itinerary','12'],['Quoted','7'],['Booked','4']].map(([label, count], index) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-2.5"><div className={`mb-3 h-1.5 rounded-full ${index === 3 ? 'bg-emerald-400' : 'bg-blue-400'}`} /><p className="text-[8px] text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-slate-900">{count}</p></div>)}</div><div className="mt-4 rounded-xl border border-slate-200 bg-white p-3"><div className="flex items-center justify-between text-[9px] font-semibold text-slate-600"><span>Recent itineraries</span><span className="text-blue-600">Open operations</span></div><div className="mt-3 space-y-2">{[['Kerala · 6 nights','Quotation ready','blue'],['Rajasthan · 8 nights','Payment pending','orange'],['Goa · 3 nights','Confirmed','teal']].map(([name, status, tone]) => <div key={name} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2"><MapPin className={`h-3.5 w-3.5 ${tone === 'teal' ? 'text-teal-500' : tone === 'orange' ? 'text-orange-500' : 'text-blue-500'}`} /><span className="text-[9px] font-semibold text-slate-700">{name}</span><span className="ml-auto text-[8px] text-slate-400">{status}</span></div>)}</div></div></div></AppChrome>;
}

function MortgagePreview() {
  return <AppChrome dark><div className="min-h-[260px] bg-slate-950 p-5 text-white"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[0.18em] text-violet-300">Underwriting demo</p><h4 className="mt-1 text-base font-bold">Application review</h4></div><span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-[9px] text-violet-200">Synthetic data</span></div><div className="mt-5 grid gap-3 sm:grid-cols-[.9fr_1.1fr]"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[9px] text-slate-400">Application progress</p><div className="mt-4 space-y-3">{[['Documents','Complete'],['OCR processing','Complete'],['Credit provider','Queued'],['Conditions','3 open']].map(([label, status], index) => <div key={label} className="flex items-center gap-2 text-[9px]"><span className={`grid h-5 w-5 place-items-center rounded-full ${index < 2 ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-slate-400'}`}>{index < 2 ? <Check className="h-3 w-3" /> : index + 1}</span><span className="text-slate-300">{label}</span><span className="ml-auto text-slate-500">{status}</span></div>)}</div></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[9px] text-slate-400">Open conditions</p><div className="mt-3 space-y-2">{['Income document', 'Address verification', 'Employment history'].map((item) => <div key={item} className="flex items-center gap-2 rounded-lg bg-white/[0.04] p-2 text-[9px] text-slate-300"><FileText className="h-3.5 w-3.5 text-violet-300" />{item}<ChevronDown className="ml-auto h-3 w-3 text-slate-500" /></div>)}</div></div></div></div></AppChrome>;
}

function CommercePreview() {
  return <AppChrome><div className="min-h-[260px] bg-slate-50 p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-teal-600">Commerce API</p><h4 className="mt-1 text-base font-bold text-slate-900">Catalogue health</h4></div><span className="rounded-full bg-teal-50 px-2 py-1 text-[9px] font-semibold text-teal-600">REST / v1</span></div><div className="mt-5 grid gap-3 sm:grid-cols-[1.1fr_.9fr]"><div className="rounded-xl border border-slate-200 bg-white p-3"><div className="flex items-center justify-between text-[9px] text-slate-500"><span>Products by category</span><span className="text-teal-600">This month</span></div><div className="mt-5 flex h-20 items-end gap-2">{['42%','68%','54%','86%','73%','92%','81%'].map((height, index) => <div key={height} className="flex flex-1 flex-col items-center gap-1"><span className="w-full rounded-t-md bg-gradient-to-t from-teal-500 to-cyan-300" style={{ height }} /><span className="text-[7px] text-slate-400">{index + 1}</span></div>)}</div></div><div className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-[9px] text-slate-500">Order lifecycle</p><div className="mt-3 space-y-2">{['Catalogue', 'Cart', 'Payment', 'Delivery'].map((item, index) => <div key={item} className="flex items-center gap-2 text-[9px] text-slate-600"><span className={`h-2 w-2 rounded-full ${index < 3 ? 'bg-teal-500' : 'bg-slate-200'}`} />{item}<span className="ml-auto text-[8px] text-slate-400">{index < 3 ? 'ok' : 'next'}</span></div>)}</div></div></div></div></AppChrome>;
}

function VoyaVendorPreview() {
  const workflows = [
    { label: "Vendor onboarding", stage: "Verification" },
    { label: "Experience catalogue", stage: "Listings" },
    { label: "Booking operations", stage: "Fulfilment" },
  ];

  return (
    <AppChrome>
      <div
        className="min-h-[260px] bg-slate-50 p-4 sm:p-5"
        aria-label="Illustrative Voya vendor workspace preview"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-700 text-[10px] font-bold tracking-wider text-white">
              V
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                Voya vendor platform
              </p>
              <h4 className="text-sm font-bold text-slate-900">Vendor workspace</h4>
            </div>
          </div>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-semibold text-indigo-700">
            B2B travel
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
              <Users className="h-3.5 w-3.5 text-indigo-600" />
              Vendor operations
            </div>
            <div className="mt-3 space-y-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow.label}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-2"
                >
                  <span className="text-[9px] font-medium text-slate-700">
                    {workflow.label}
                  </span>
                  <span className="text-[8px] text-slate-500">
                    {workflow.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
              <Package className="h-3.5 w-3.5 text-indigo-600" />
              Marketplace tools
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Inventory", "Availability", "Payments", "Settlements"].map(
                (tool) => (
                  <div
                    key={tool}
                    className="grid min-h-12 place-items-center rounded-lg border border-indigo-100 bg-indigo-50/60 p-1.5 text-center text-[9px] font-medium text-indigo-800"
                  >
                    {tool}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}

const previews: Record<string, () => React.ReactNode> = {
  rural: RuralPreview,
  rainwood: RainwoodPreview,
  community: CommunityPreview,
  travel: TravelPreview,
  mortgage: MortgagePreview,
  commerce: CommercePreview,
  voya: VoyaVendorPreview,
};

export default function ProductPreview({ project }: { project: CmsProject }) {
  if (project.posterImage) return <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-2xl"><img src={project.posterImage} alt={`${project.title} application preview`} className="aspect-[16/9] w-full object-cover" loading="lazy" /></div>;
  const Preview = previews[project.visual] ?? RuralPreview;
  return <Preview />;
}
