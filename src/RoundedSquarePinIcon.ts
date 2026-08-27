import { AbstractMarkerIcon, Settings, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, escapeXml, hashObject, normalizeColor, svgBitmapIcon, getOrCreateBitmapIcon, type IconSize } from './utils';

export interface RoundedSquarePinIconOptions {
  holeColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface RoundedSquarePinIconProperties {
  fillColor: string;
  holeColor: string;
  strokeColor: string;
  strokeWidth: number;
  scale: number;
  iconSize: number;
  debug: boolean;
}

/** Canvas aspect from the A-02 sheet: 30 wide by 39 tall. */
const WIDTH_TO_HEIGHT_RATIO = 30 / 39;

/** Body height as a fraction of the drawable height; the tail takes the rest. */
const BODY_HEIGHT_RATIO = 5 / 6;

/** Body corner radius as a fraction of the drawable width. */
const CORNER_RADIUS_RATIO = 0.325;

/** Hole radius as a fraction of the drawable width. */
const HOLE_RADIUS_RATIO = 0.1833;

/** A rounded square whose bottom corners run into a tail, anchored at the tip. */
export class RoundedSquarePinIcon extends AbstractMarkerIcon {
  readonly anchor: Offset = { x: 0.5, y: 1 };
  readonly infoAnchor: Offset = { x: 0.5, y: 0 };
  private readonly properties: RoundedSquarePinIconProperties;

  constructor(fillColor: string = '#ff0000', options: RoundedSquarePinIconOptions = {}) {
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

  copy(fillColor: string = this.fillColor, options: RoundedSquarePinIconOptions = {}): RoundedSquarePinIcon {
    return new RoundedSquarePinIcon(fillColor, {
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
      // iconSize drives the height; the width follows the sheet's aspect so the
      // shape keeps its proportions at every size.
      const height = Math.max(1, Math.round(this.iconSize * this.scale));
      const strokeWidth = Math.max(0, this.strokeWidth);
      // The stroke straddles the path, so keep half of it inside the canvas.
      const inset = strokeWidth / 2;
      const drawableHeight = Math.max(0, height - strokeWidth);
      const drawableWidth = drawableHeight * WIDTH_TO_HEIGHT_RATIO;
      const width = Math.max(1, Math.round(drawableWidth + strokeWidth));

      const left = (width - drawableWidth) / 2;
      const right = left + drawableWidth;
      const centerX = left + drawableWidth / 2;
      const top = inset;
      const bodyBottom = top + drawableHeight * BODY_HEIGHT_RATIO;
      const tipY = top + drawableHeight;
      const radius = Math.min(
        drawableWidth * CORNER_RADIUS_RATIO,
        drawableWidth / 2,
        (bodyBottom - top) / 2,
      );

      // One closed path: the bottom corner arcs feed straight into the tail, so
      // there is no seam for the stroke to trace.
      const pinPath = [
        `M ${format(left + radius)} ${format(top)}`,
        `H ${format(right - radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(right)} ${format(top + radius)}`,
        `V ${format(bodyBottom - radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(right - radius)} ${format(bodyBottom)}`,
        `L ${format(centerX)} ${format(tipY)}`,
        `L ${format(left + radius)} ${format(bodyBottom)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(left)} ${format(bodyBottom - radius)}`,
        `V ${format(top + radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(left + radius)} ${format(top)}`,
        'Z',
      ].join(' ');

      const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
        `<path d="${pinPath}" fill="${escapeXml(this.fillColor)}" stroke="${escapeXml(this.strokeColor)}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`,
        `<circle cx="${format(centerX)}" cy="${format((top + bodyBottom) / 2)}" r="${format(drawableWidth * HOLE_RADIUS_RATIO)}" fill="${escapeXml(this.holeColor)}"/>`,
        this.debug ? debugRect(width, height) : '',
        '</svg>',
      ];
      return svgBitmapIcon({ svg: parts.join(''), anchor: this.anchor, size: this.size(width, height) });
    });
  }

  hashCode(): number {
    return hashObject({ type: 'RoundedSquarePinIcon', properties: this.properties });
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}

const format = (value: number): string => String(Number(value.toFixed(4)));
