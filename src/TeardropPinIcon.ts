import { AbstractMarkerIcon, Settings, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, escapeXml, hashObject, normalizeColor, svgBitmapIcon, getOrCreateBitmapIcon, type IconSize } from './utils';

export interface TeardropPinIconOptions {
  holeColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface TeardropPinIconProperties {
  fillColor: string;
  holeColor: string;
  strokeColor: string;
  strokeWidth: number;
  scale: number;
  iconSize: number;
  debug: boolean;
}

/** Head radius as a fraction of the drawable height. Measured off the A-01 sheet. */
const HEAD_RADIUS_RATIO = 0.4;

/** Hole radius as a fraction of the head radius. Measured off the A-01 sheet. */
const HOLE_RADIUS_RATIO = 0.39;

/** A round head tapering to a point, anchored at the tip. */
export class TeardropPinIcon extends AbstractMarkerIcon {
  readonly anchor: Offset = { x: 0.5, y: 1 };
  readonly infoAnchor: Offset = { x: 0.5, y: 0 };
  private readonly properties: TeardropPinIconProperties;

  constructor(fillColor: string = '#ff0000', options: TeardropPinIconOptions = {}) {
    super();
    this.properties = {
      fillColor: normalizeColor(fillColor),
      holeColor: normalizeColor(options.holeColor ?? '#ffffff'),
      strokeColor: normalizeColor(options.strokeColor ?? '#ffffff'),
      strokeWidth: options.strokeWidth ?? Settings.Default.iconStroke,
      scale: options.scale ?? 1,
      iconSize: options.iconSize ?? Settings.Default.iconSize,
      debug: options.debug ?? false,
    };
  }

  get fillColor(): string { return this.properties.fillColor; }
  get holeColor(): string { return this.properties.holeColor; }
  get strokeColor(): string { return this.properties.strokeColor; }
  get strokeWidth(): number { return this.properties.strokeWidth; }
  get scale(): number { return this.properties.scale; }
  get iconSize(): number { return this.properties.iconSize; }
  get debug(): boolean { return this.properties.debug; }

  copy(fillColor: string = this.fillColor, options: TeardropPinIconOptions = {}): TeardropPinIcon {
    return new TeardropPinIcon(fillColor, {
      holeColor: this.holeColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      scale: this.scale,
      iconSize: this.iconSize,
      debug: this.debug,
      ...options,
    });
  }

  toBitmapIcon(): BitmapIcon {
    return getOrCreateBitmapIcon(this.hashCode(), () => {
      const size = Math.max(1, Math.round(this.iconSize * this.scale));
      const strokeWidth = Math.max(0, this.strokeWidth);
      // The stroke straddles the path, so keep half of it inside the canvas.
      const inset = strokeWidth / 2;
      const drawable = Math.max(0, size - strokeWidth);
      const radius = drawable * HEAD_RADIUS_RATIO;
      const centerX = size / 2;
      const centerY = inset + radius;
      const tipY = inset + drawable;

      // Each side is a tangent from the tip to the head circle, so it meets the
      // head where the radius is perpendicular to it: the contact point sits at
      // acos(radius / tipDistance) from the downward vertical.
      const tipDistance = tipY - centerY;
      const cos = tipDistance > 0 ? Math.min(1, radius / tipDistance) : 0;
      const sin = Math.sqrt(Math.max(0, 1 - cos * cos));
      const contactY = centerY + radius * cos;
      const contactDx = radius * sin;

      const pinPath = [
        `M ${format(centerX)} ${format(tipY)}`,
        `L ${format(centerX - contactDx)} ${format(contactY)}`,
        `A ${format(radius)} ${format(radius)} 0 1 1 ${format(centerX + contactDx)} ${format(contactY)}`,
        'Z',
      ].join(' ');

      const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
        `<path d="${pinPath}" fill="${escapeXml(this.fillColor)}" stroke="${escapeXml(this.strokeColor)}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`,
        `<circle cx="${format(centerX)}" cy="${format(centerY)}" r="${format(radius * HOLE_RADIUS_RATIO)}" fill="${escapeXml(this.holeColor)}"/>`,
        this.debug ? debugRect(size, size) : '',
        '</svg>',
      ];
      return svgBitmapIcon({ svg: parts.join(''), anchor: this.anchor, size: this.size(size, size) });
    });
  }

  hashCode(): number {
    return hashObject({ type: 'TeardropPinIcon', properties: this.properties });
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}

const format = (value: number): string => String(Number(value.toFixed(4)));
