import type { BitmapIcon } from '@mapconductor/js-sdk-core';

export interface IconSize {
  width: number;
  height: number;
}

export interface SvgBitmapIconParams {
  svg: string;
  anchor: { x: number; y: number };
  size: IconSize;
}

export const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const toSvgDataUrl = (svg: string): string =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const normalizeColor = (color: string): string => {
  const trimmed = color.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('rgb') || trimmed.startsWith('hsl')) {
    return trimmed;
  }
  return `#${trimmed}`;
};

export const svgBitmapIcon = ({ svg, anchor, size }: SvgBitmapIconParams): BitmapIcon => ({
  url: toSvgDataUrl(svg),
  anchor,
  size,
});

export const debugRect = (width: number, height: number): string =>
  `<rect x="0.5" y="0.5" width="${Math.max(0, width - 1)}" height="${Math.max(0, height - 1)}" fill="none" stroke="#000000" stroke-width="1"/>`;

export const hashObject = (value: unknown): number => {
  const json = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i += 1) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};
