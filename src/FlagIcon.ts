import { AbstractMarkerIcon, Settings, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, hashObject, normalizeColor, svgBitmapIcon, type IconSize } from './utils';

export interface FlagIconOptions {
  strokeColor?: string;
  strokeWidth?: number;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface FlagIconProperties {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  scale: number;
  iconSize: number;
  debug: boolean;
}

export class FlagIcon extends AbstractMarkerIcon {
  readonly anchor: Offset = { x: 0.176, y: 0.91 };
  readonly infoAnchor: Offset = { x: 0.5, y: 0 };
  private readonly properties: FlagIconProperties;

  constructor(fillColor: string = '#ff0000', options: FlagIconOptions = {}) {
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

  copy(fillColor: string = this.fillColor, options: FlagIconOptions = {}): FlagIcon {
    return new FlagIcon(fillColor, {
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      scale: this.scale,
      iconSize: this.iconSize,
      debug: this.debug,
      ...options,
    });
  }

  toBitmapIcon(): BitmapIcon {
    const size = Math.max(1, Math.round(this.iconSize * this.scale));
    const strokeWidth = Math.max(0, this.strokeWidth);
    const svgWidth = 45.931 - 5.161;
    const svgHeight = 51.48 - 5.161;
    const iconScale = Math.min(size / svgWidth, size / svgHeight);
    const scaledWidth = svgWidth * iconScale;
    const scaledHeight = svgHeight * iconScale;
    const offsetX = (size - scaledWidth) / 2;
    const offsetY = (size - scaledHeight) / 2;

    const mainFlagPath = [
      'M 14.16 7.037',
      'L 41.892 7.037',
      'L 42.815 9.797',
      'C 43.339 10.554 43.34 11.517 42.815 12.297',
      'L 41.5 12.199',
      'C 39.579 16.477 39.558 22.846 41.453 26.646',
      'L 42.845 29.2',
      'C 43.295 29.865 43.386 30.384 43.28 30.584',
      'L 41.891 30.999',
      'L 14.16 30.999',
      'Z',
    ].join(' ');
    const transform = `translate(${offsetX} ${offsetY}) scale(${iconScale}) translate(-5.161 -5.161)`;
    const parts = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
      `<g transform="${transform}" fill="${this.fillColor}" stroke="${this.strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round">`,
      `<path d="${mainFlagPath}"/>`,
      '<rect x="7.161" y="5.5" width="4.999" height="40.48"/>',
      '<circle cx="9.66" cy="5.5" r="2"/>',
      '</g>',
      this.debug ? debugRect(size, size) : '',
      '</svg>',
    ];
    return svgBitmapIcon({ svg: parts.join(''), anchor: this.anchor, size: this.size(size, size) });
  }

  hashCode(): number {
    return hashObject({ type: 'FlagIcon', properties: this.properties });
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}
