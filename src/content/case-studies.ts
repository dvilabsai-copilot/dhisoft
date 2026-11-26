export type CaseStudy = {
  slug: string;
  title: string;
  searchTitle: string;
  summary: string;
  challenge: string;
  workflow: { title: string; description: string }[];
  result: string;
  screenshot: { src: string; alt: string; caption: string };
  demoUrl: string;
  recording?: string;
  sourceUrl?: string;
  serviceSlug: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "rainwood",
    title: "RainWood Direct Booking Engine",
    searchTitle: "RainWood Direct Booking Engine Case Study",
    summary: "How DHISOFT built a direct hotel booking engine that connects room availability, occupancy-based pricing, reservations, and payments.",
    challenge: "Guests need to trust that the room they choose is still available when they check out. The booking system also needs to handle delayed payment callbacks, expired holds, and cancellations without leaving rooms incorrectly reserved.",
    workflow: [
      { title: "Search rooms and prices", description: "Guests choose a property, dates, and occupancy to search for suitable rooms and rates." },
      { title: "Hold inventory during checkout", description: "A temporary hold reserves capacity while guests complete payment. The reservation workflow accounts for concurrent attempts to book the same inventory." },
      { title: "Confirm, issue, or release", description: "Payment webhooks use idempotency so a repeated callback does not confirm a booking twice. The workflow covers vouchers, cancellations, and returning inventory when a hold expires or a reservation is cancelled." },
    ],
    result: "The open-source system brings the guest booking flow and the reservation lifecycle together. The public demo shows the room search entry point, and the source is available for reviewing how the booking application is built.",
    screenshot: {
      src: "/images/projects/rainwood-direct-booking.jpg",
      alt: "RainWood Hotels booking form with hotel, travel dates, rooms, and guest counts",
      caption: "The RainWood public demo starts with a room search by property, dates, and occupancy.",
    },
    demoUrl: "https://demo.dhisoft.in/rainwood",
    sourceUrl: "https://github.com/kkversile/rainwood",
    serviceSlug: "api-integrations",
  },
  {
    slug: "voya-vendor-platform",
    title: "Voya Vendor Platform",
    searchTitle: "Voya Travel Vendor Platform Case Study",
    summary: "How DHISOFT built a B2B travel platform that connects vendor onboarding, tour and attraction catalogues, and agent bookings.",
    challenge: "A tours marketplace needs a clear path from a new vendor signing up to an agent booking an experience. Product details, availability, fulfilment, and settlements need to stay connected as different teams handle each step.",
    workflow: [
      { title: "Onboard and verify vendors", description: "The partner hub gives vendors an entry point to register and start verification before listing experiences." },
      { title: "Publish bookable experiences", description: "Vendors manage tours, tickets, and attractions as catalogue items with inventory and availability that agents can use to find bookable options." },
      { title: "Manage bookings and fulfilment", description: "The platform brings agent bookings, fulfilment, payment and settlement workflows into the same system so marketplace operators can work from shared booking records." },
    ],
    result: "The portfolio demo shows how the partner, agent, and operations workflows fit together. The recording walks through the platform, and the live demo opens the partner hub.",
    screenshot: {
      src: "/images/projects/voya-vendor-console.jpg",
      alt: "Voya Partner Hub with the registration entry point for tours and attractions vendors",
      caption: "The public Voya Partner Hub introduces the vendor registration process.",
    },
    demoUrl: "https://demo.dhisoft.in/voya/",
    recording: "/media/projects/voya-vendor-platform-updated-i.mp4",
    serviceSlug: "saas-product-engineering",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

export function caseStudyHref(slug: string) {
  return `/case-studies/${slug}`;
}
