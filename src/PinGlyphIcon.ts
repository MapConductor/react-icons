import { AbstractMarkerIcon, Settings, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import type { MapIconGlyph } from './MapIconGlyph';
import {
  debugRect,
  escapeXml,
  getOrCreateBitmapIcon,
  hashObject,
  normalizeColor,
  svgBitmapIcon,
} from './utils';

export interface PinGlyphIconOptions {
  fillColor?: string;
  glyphColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  scale?: number;
  infoAnchor?: Offset;
  iconSize?: number;
  debug?: boolean;
}

/** Displays a MapIconGlyph in MapConductor's default pin container. */
export class PinGlyphIcon extends AbstractMarkerIcon {
  readonly anchor: Offset = { x: 0.5, y: 1 };
  readonly glyph: MapIconGlyph;
  readonly fillColor: string;
  readonly glyphColor: string;
  readonly strokeColor: string;
  readonly strokeWidth: number;
  readonly scale: number;
  readonly infoAnchor: Offset;
  readonly iconSize: number;
  readonly debug: boolean;

  constructor(glyph: MapIconGlyph, options: PinGlyphIconOptions = {}) {
    super();
    if (!glyph.id || !glyph.pathData || glyph.viewBoxSize <= 0) {
      throw new Error('MapIconGlyph requires an id, pathData, and positive viewBoxSize');
    }
    this.glyph = glyph;
    this.fillColor = normalizeColor(options.fillColor ?? '#ff0000');
    this.glyphColor = normalizeColor(options.glyphColor ?? '#ffffff');
    this.strokeColor = normalizeColor(options.strokeColor ?? '#ffffff');
    this.strokeWidth = options.strokeWidth ?? Settings.Default.iconStroke;
    this.scale = options.scale ?? 1;
    this.infoAnchor = options.infoAnchor ?? { x: 0.5, y: 0 };
    this.iconSize = options.iconSize ?? Settings.Default.iconSize;
    this.debug = options.debug ?? false;
  }

  copy(glyph: MapIconGlyph = this.glyph, options: PinGlyphIconOptions = {}): PinGlyphIcon {
    return new PinGlyphIcon(glyph, {
      fillColor: this.fillColor,
      glyphColor: this.glyphColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      scale: this.scale,
      infoAnchor: this.infoAnchor,
      iconSize: this.iconSize,
      debug: this.debug,
      ...options,
    });
  }

  toBitmapIcon(): BitmapIcon {
    return getOrCreateBitmapIcon(this.hashCode(), () => {
      const size = Math.max(1, Math.round(this.iconSize * this.scale));
      const markerPath = createMarkerPathData(size, this.scale, this.strokeWidth);
      const glyphSize = size * 0.42;
      const glyphScale = glyphSize / this.glyph.viewBoxSize;
      const glyphX = (size - glyphSize) / 2;
      const glyphY = size * 0.35 - glyphSize / 2;
      const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
        `<path d="${markerPath}" fill="${escapeXml(this.fillColor)}"/>`,
        `<path d="${markerPath}" fill="none" stroke="${escapeXml(this.strokeColor)}" stroke-width="${this.strokeWidth * this.scale}" stroke-linejoin="round" stroke-linecap="round"/>`,
        `<path d="${escapeXml(this.glyph.pathData)}" fill="${escapeXml(this.glyphColor)}" transform="translate(${format(glyphX)} ${format(glyphY)}) scale(${format(glyphScale)})"/>`,
        this.debug ? debugRect(size, size) : '',
        '</svg>',
      ].join('');
      return svgBitmapIcon({ svg, anchor: this.anchor, size: { width: size, height: size } });
    });
  }

  hashCode(): number {
    return hashObject({
      type: 'PinGlyphIcon',
      glyph: this.glyph,
      fillColor: this.fillColor,
      glyphColor: this.glyphColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      scale: this.scale,
      infoAnchor: this.infoAnchor,
      iconSize: this.iconSize,
      debug: this.debug,
    });
  }
}

const format = (value: number): string => String(Number(value.toFixed(4)));

/** Same pin geometry as the default icon in js-sdk-core. */
const createMarkerPathData = (canvasSize: number, iconScale: number, strokeWidth: number): string => {
  const padding = Math.max(0, strokeWidth * iconScale / 2 - 0.75);
  const markerScale = Math.min(
    (canvasSize - padding * 2) / 23.5,
    (canvasSize - padding) / 25.6,
  );
  let x = 12 * markerScale + (canvasSize - 23.5 * markerScale) / 2;
  let y = (canvasSize - 25.6 * markerScale + strokeWidth * markerScale) / 2;
  const parts = [`M ${format(x)} ${format(y)}`];
  const cubic = (x1: number, y1: number, x2: number, y2: number, dx: number, dy: number): void => {
    parts.push(`C ${format(x + x1 * markerScale)} ${format(y + y1 * markerScale)} ${format(x + x2 * markerScale)} ${format(y + y2 * markerScale)} ${format(x + dx * markerScale)} ${format(y + dy * markerScale)}`);
    x += dx * markerScale;
    y += dy * markerScale;
  };
  const line = (dx: number, dy: number): void => {
    x += dx * markerScale;
    y += dy * markerScale;
    parts.push(`L ${format(x)} ${format(y)}`);
  };
  cubic(-4.4183, 0, -8, 3.5817, -8, 8);
  cubic(0, 1.421, 0.3816, 2.75, 1.0312, 3.906);
  cubic(0.1079, 0.192, 0.221, 0.381, 0.3438, 0.563);
  line(6.625, 11.531);
  line(6.625, -11.531);
  cubic(0.102, -0.151, 0.19, -0.311, 0.281, -0.469);
  line(0.063, -0.094);
  cubic(0.649, -1.156, 1.031, -2.485, 1.031, -3.906);
  cubic(0, -4.4183, -3.582, -8, -8, -8);
  parts.push('Z');
  return parts.join(' ');
};
