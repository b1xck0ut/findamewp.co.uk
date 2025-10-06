export interface MEWP {
  manufacturer: string;
  model: string;
  mewp_type: string;
  boom_type: string;
  fuel_type: string | null;
  working_height_m: number;
  horizontal_outreach_m: number;
  lifting_capacity_kg: number;
  stowed_height_m: number | null;
  stowed_length_with_basket_m: number | null;
  stowed_length_without_basket_m: number | null;
  stowed_width_m: number | null;
  fully_jacked_width_m: number | null;
  one_side_narrow_jacked_m: number | null;
  narrow_jacked_width_m: number | null;
  weight_kg: number;
  pdf_link: string | null;
  negative_reach: number;
  usps?: string[];
}