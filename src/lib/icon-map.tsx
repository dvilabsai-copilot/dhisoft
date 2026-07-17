import { Bot, Building2, CarFront, CloudCog, Hotel, Network, Route, Sparkles, Zap, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Bot, Building2, CarFront, CloudCog, Hotel, Network, Route, Sparkles, Zap };

export function getCmsIcon(key: string): LucideIcon {
  return ICONS[key] ?? Sparkles;
}
