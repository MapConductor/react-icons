import { AbstractMarkerIcon, MarkerIconSize, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, escapeXml, hashObject, normalizeColor, svgBitmapIcon, type IconSize } from './utils';

export interface RoundInfoBubbleIconOptions {
  fillColor?: string;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface RoundInfoBubbleIconProperties {
  iconUrl: string;
  label: string;
  fillColor: string;
  scale: number;
  iconSize: number;
  debug: boolean;
}

export class RoundInfoBubbleIcon extends AbstractMarkerIcon {
  readonly anchor: Offset = { x: 0.5, y: 1 };
  readonly infoAnchor: Offset = { x: 0.5, y: 1 };
  private readonly properties: RoundInfoBubbleIconProperties;

  constructor(iconUrl: string, label: string, options: RoundInfoBubbleIconOptions = {}) {
    super();
    this.properties = {
      iconUrl,
      label,
      fillColor: normalizeColor(options.fillColor ?? '#ffffff'),
      scale: options.scale ?? 1,
      iconSize: options.iconSize ?? MarkerIconSize.Small,
      debug: options.debug ?? false,
    };
  }

  get iconUrl(): string { return this.properties.iconUrl; }
  get label(): string { return this.properties.label; }
  get fillColor(): string { return this.properties.fillColor; }
  get scale(): number { return this.properties.scale; }
  get iconSize(): number { return this.properties.iconSize; }
  get debug(): boolean { return this.properties.debug; }

  copy(iconUrl: string = this.iconUrl, label: string = this.label, options: RoundInfoBubbleIconOptions = {}): RoundInfoBubbleIcon {
    return new RoundInfoBubbleIcon(iconUrl, label, {
      fillColor: this.fillColor,
      scale: this.scale,
      iconSize: this.iconSize,
      debug: this.debug,
      ...options,
    });
  }

  toBitmapIcon(): BitmapIcon {
    const drawableSize = Math.max(1, this.iconSize * this.scale);
    const innerPadding = drawableSize * 0.1;
    const textSize = drawableSize * 0.5;
    const textWidth = estimateTextWidth(this.label, textSize);
    const textHeight = textSize * 1.2;
    const canvasWidth = Math.ceil(drawableSize + innerPadding + textWidth + innerPadding * 3);
    const canvasHeight = Math.ceil(Math.max(drawableSize, textHeight) + innerPadding * 2);
    const pointerHeight = canvasHeight / 8;
    const totalHeight = Math.ceil(canvasHeight + pointerHeight);
    const radius = canvasHeight / 2;
    const pointerHalfWidth = pointerHeight;
    const textX = innerPadding + drawableSize + innerPadding;
    const textY = innerPadding + drawableSize / 2;
    const parts = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${totalHeight}" viewBox="0 0 ${canvasWidth} ${totalHeight}">`,
      `<path d="${roundedBubblePath(canvasWidth, canvasHeight, radius, pointerHalfWidth, pointerHeight)}" fill="${this.fillColor}"/>`,
      `<image href="${escapeXml(this.iconUrl)}" x="${innerPadding}" y="${innerPadding}" width="${drawableSize}" height="${drawableSize}" preserveAspectRatio="xMidYMid meet"/>`,
      `<text x="${textX}" y="${textY}" dominant-baseline="middle" font-family="sans-serif" font-size="${textSize}" fill="#000000">${escapeXml(this.label)}</text>`,
      this.debug ? debugRect(canvasWidth, totalHeight) : '',
      '</svg>',
    ];
    return svgBitmapIcon({
      svg: parts.join(''),
      anchor: this.anchor,
      size: this.size(canvasWidth, totalHeight),
    });
  }

  hashCode(): number {
    return hashObject({ type: 'RoundInfoBubbleIcon', properties: this.properties });
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}

function roundedBubblePath(width: number, height: number, radius: number, pointerHalfWidth: number, pointerHeight: number): string {
  const pointerX = width / 2;
  return [
    `M ${radius} 0`,
    `H ${width - radius}`,
    `A ${radius} ${radius} 0 0 1 ${width} ${radius}`,
    `V ${height - radius}`,
    `A ${radius} ${radius} 0 0 1 ${width - radius} ${height}`,
    `H ${pointerX + pointerHalfWidth}`,
    `L ${pointerX} ${height + pointerHeight}`,
    `L ${pointerX - pointerHalfWidth} ${height}`,
    `H ${radius}`,
    `A ${radius} ${radius} 0 0 1 0 ${height - radius}`,
    `V ${radius}`,
    `A ${radius} ${radius} 0 0 1 ${radius} 0`,
    'Z',
  ].join(' ');
}

function estimateTextWidth(text: string, fontSize: number): number {
  return Array.from(text).reduce((sum, char) => {
    const code = char.codePointAt(0) ?? 0;
    return sum + fontSize * (code > 0xff ? 0.95 : 0.58);
  }, 0);
}
