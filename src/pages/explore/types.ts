export type Pair = { left?: string; right?: string };
export type Phase = 'select' | 'loading' | 'results';

export type Place = {
  id: string | number;
  name: string;
  imageUrl?: string;
  sido?: string;
  sigungu?: string;
  tags?: string[];
  address?: string;
};

export function toPair(v: any): Pair {
  if (!v) return {};
  if (typeof v === 'string') return { left: v };
  if (Array.isArray(v)) return { left: v[0], right: v[1] };
  if ('left' in v || 'right' in v) return { left: v.left, right: v.right };
  const left =
    v?.sido ?? v?.group ?? v?.category ?? v?.parent ?? v?.main ?? v?.value ?? v?.key ?? v?.[0];
  const right = v?.sigungu ?? v?.theme ?? v?.sub ?? v?.child ?? v?.detail ?? v?.label ?? v?.[1];
  return { left, right };
}
