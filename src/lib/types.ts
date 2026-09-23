export type Category =
  | 'stretchy-wraps'
  | 'woven-wraps'
  | 'ring-slings'
  | 'meh-dai'
  | 'half-buckles'
  | 'buckle-carriers'
  | 'onbuhimo'
  // legacy value, kept so existing carriers keep working
  | 'wraps';

export interface Carrier {
  id: string;
  brand_name: string;
  model_name: string;
  category: Category;
  age_range: string;
  weight_range: string;
  weekly_rent: number;
  monthly_rent: number;
  refundable_deposit: number;
  buyout_price: number;
  purchase_cost: number;
  purchased_from: string | null;
  condition: string;
  carry_positions: string[];
  description: string | null;
  laundry_instructions: string | null;
  images: string[];
  availability_status: 'available' | 'rented' | 'hidden' | 'sold-out';
  next_available_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingRequest {
  id: string;
  carrier_id: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string | null;
  start_date: string | null;
  duration: 'weekly' | 'biweekly' | 'monthly';
  rental_start_date: string | null;
  rental_end_date: string | null;
  rental_duration: string | null;
  status: 'pending' | 'approved' | 'on_rent' | 'completed' | 'cancelled' | 'sold';
  agreed_to_terms: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryInfo {
  slug: Category;
  name: string;
  description: string;
  image: string;
  /** Legacy values are hidden from public filters unless a carrier still uses them */
  legacy?: boolean;
  /** Label used in admin forms (falls back to name) */
  adminName?: string;
  /** Public browsing group; stored category slugs remain unchanged */
  publicGroup?: Category;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'stretchy-wraps',
    name: 'Stretchy Wraps',
    description: 'Soft and forgiving, the gentlest start for newborn front carries',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop'
  },
  {
    slug: 'woven-wraps',
    name: 'Woven Wraps',
    description: 'Supportive from newborn to toddler, endlessly versatile to tie',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop'
  },
  {
    slug: 'ring-slings',
    name: 'Ring Slings',
    description: 'Perfect for quick ups and nursing, ideal for newborns to toddlers',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
  },
  {
    slug: 'meh-dai',
    name: 'Meh Dai & Half Buckles',
    adminName: 'Meh Dai',
    description: 'Tie-on comfort and a custom fit, with or without a buckle waistband',
    image: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600&h=400&fit=crop'
  },
  {
    slug: 'half-buckles',
    name: 'Half Buckles',
    publicGroup: 'meh-dai',
    description: 'Buckle waistband with wrap straps, a comfy middle ground',
    image: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=600&h=400&fit=crop'
  },
  {
    slug: 'buckle-carriers',
    name: 'Soft Structured Carriers',
    description: 'Easy to use with adjustable buckles, great for beginners',
    image: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=600&h=400&fit=crop'
  },
  {
    slug: 'onbuhimo',
    name: 'Onbuhimo',
    description: 'Traditional Japanese style, perfect for back carries',
    image: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600&h=400&fit=crop'
  },
  {
    slug: 'wraps',
    name: 'Wraps',
    description: 'Versatile and cozy, offering multiple carrying positions',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop',
    legacy: true,
    adminName: 'Wraps (legacy, please re-tag)'
  }
];

export const PUBLIC_CATEGORIES: CategoryInfo[] = CATEGORIES.filter(c => !c.legacy && !c.publicGroup);

export const getPublicCategory = (category: Category): Category =>
  CATEGORIES.find(c => c.slug === category)?.publicGroup ?? category;

export const isCategory = (value: string | null | undefined): value is Category =>
  !!value && CATEGORIES.some(c => c.slug === value);

export const getCategoryName = (slug: Category): string => {
  return CATEGORIES.find(c => c.slug === getPublicCategory(slug))?.name || slug;
};

export const getAdminCategoryName = (slug: Category): string => {
  const category = CATEGORIES.find(c => c.slug === slug);
  return category?.adminName ?? category?.name ?? slug;
};
