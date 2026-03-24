export interface Listing {
  id: string;
  name: string;
  source: "bizbuysell" | "transworld" | "sunbelt" | "loopnet" | "direct";
  askingPrice: number;
  revenue: number;
  cashFlow: number; // SDE or EBITDA
  ebitdaMargin: number;
  multiple: number; // EBITDA multiple (askingPrice / cashFlow)
  revenueMultiple: number; // Revenue multiple (askingPrice / revenue)
  location: string;
  state: string;
  employees: number;
  yearEstablished: number;
  recurringRevenuePct: number;
  ownerInvolved: boolean;
  description: string;
  url: string;
  dateFound: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  status: "new" | "reviewing" | "contacted" | "passed" | "loi";
  tags: string[];
}

export interface ScoreBreakdown {
  revenueScore: number;
  marginScore: number;
  multipleScore: number;
  locationScore: number;
  recurringScore: number;
  ageScore: number; // business maturity
  total: number;
}

export interface OffMarketLead {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  yearsInBusiness: number;
  estimatedRevenue: string;
  ownerAge: string; // "60+" etc
  source: "google_maps" | "license_db" | "association" | "referral";
  outreachStatus: "not_contacted" | "contacted" | "responded" | "meeting_set" | "not_interested";
  notes: string;
  lastUpdated: string;
  priorityScore: number;
}

export interface MarketDataPoint {
  label: string;
  value: number;
}

export interface DealMetrics {
  askingPrice: number;
  revenue: number;
  ebitda: number;
  ebitdaMargin: number;
  multiple: number;
  sbaLoan: number;
  sellerNote: number;
  equityRequired: number;
  debtService: number;
  freeCashFlowAfterDebt: number;
  dscr: number;
  irr5yr: number;
  equityMultiple5yr: number;
}
