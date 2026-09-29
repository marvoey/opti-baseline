import {
  Calendar,
  Check,
  Compass,
  Layers,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
  type LucideIcon,
} from 'lucide-react';

/** CMS `Icon` enum value → lucide icon. Keep in sync with FdFeatureGrid's enum. */
export const ICONS: Record<string, LucideIcon> = {
  Store,
  Calendar,
  Truck,
  ShieldCheck,
  Sparkles,
  Layers,
  Phone,
  Compass,
  MapPin,
  Star,
  Check,
};

export const ICON_OPTIONS = Object.keys(ICONS).map((value) => ({ value, displayName: value }));
