import { AbstractMarkerIcon, Settings, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, hashObject, normalizeColor, svgBitmapIcon, getOrCreateBitmapIcon, type IconSize } from './utils';

export interface CircleIconOptions {
  strokeColor?: string;
  strokeWidth?: number;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface CircleIconProperties {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  scale: number;
  iconSize: number;
  debug: boolean;
}

export class CircleIcon extends AbstractMarkerIcon {
  readonly anchor: Offset = { x: 0, y: 0.5 };
  readonly infoAnchor: Offset = { x: 0.5, y: 0.5 };
  private readonly properties: CircleIconProperties;

  constructor(fillColor: string = '#ff0000', options: CircleIconOptions = {}) {
    super();
    this.properties = {
      fillColor: normalizeColor(fillColor),
      strokeColor: normalizeColor(options.strokeColor ?? '#ffffff'),
      strokeWidth: options.strokeWidth ?? Settings.Default.iconStroke,
      scale: options.scale ?? 1,
      iconSize: options.iconSize ?? Settings.Default.iconSize,
      debug: options.debug ?? false,
    };
  }

  get fillColor(): string { return this.properties.fillColor; }
  get strokeColor(): string { return this.properties.strokeColor; }
  get strokeWidth(): number { return this.properties.strokeWidth; }
  get scale(): number { return this.properties.scale; }
  get iconSize(): number { return this.properties.iconSize; }
  get debug(): boolean { return this.properties.debug; }

  copy(fillColor: string = this.fillColor, options: CircleIconOptions = {}): CircleIcon {
    return new CircleIcon(fillColor, {
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
      const radius = Math.max(0, size / 2 - strokeWidth);
      const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
        `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="${this.fillColor}"/>`,
        `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${this.strokeColor}" stroke-width="${strokeWidth}"/>`,
        this.debug ? debugRect(size, size) : '',
        '</svg>',
      ];
      return svgBitmapIcon({ svg: parts.join(''), anchor: this.anchor, size: this.size(size, size) });
    });
  }

  hashCode(): number {
    return hashObject({ type: 'CircleIcon', properties: this.properties });
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}
