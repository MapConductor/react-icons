import { AbstractMarkerIcon, MarkerIconSize, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, escapeXml, hashObject, normalizeColor, svgBitmapIcon, type IconSize } from './utils';

export interface RightTailInfoBubbleIconOptions {
  fillColor?: string;
  labelTextColor?: string;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface RightTailInfoBubbleIconProperties {
  iconUrl: string;
  label: string;
  snippet: string;
  fillColor: string;
  labelTextColor: string;
  scale: number;
  iconSize: number;
  debug: boolean;
}

export class RightTailInfoBubbleIcon extends AbstractMarkerIcon {
  readonly anchor: Offset = { x: 0.5, y: 1 };
  readonly infoAnchor: Offset = { x: 0.5, y: 1 };
  private readonly properties: RightTailInfoBubbleIconProperties;

  constructor(iconUrl: string, label: string, snippet: string, options: RightTailInfoBubbleIconOptions = {}) {
    super();
    this.properties = {
      iconUrl,
      label,
      snippet,
      fillColor: normalizeColor(options.fillColor ?? '#d3d3d3'),
      labelTextColor: normalizeColor(options.labelTextColor ?? '#ffff00'),
      scale: options.scale ?? 1,
      iconSize: options.iconSize ?? MarkerIconSize.Small,
      debug: options.debug ?? false,
    };
  }

  get iconUrl(): string { return this.properties.iconUrl; }
  get label(): string { return this.properties.label; }
  get snippet(): string { return this.properties.snippet; }
  get fillColor(): string { return this.properties.fillColor; }
  get labelTextColor(): string { return this.properties.labelTextColor; }
  get scale(): number { return this.properties.scale; }
  get iconSize(): number { return this.properties.iconSize; }
  get debug(): boolean { return this.properties.debug; }

  copy(iconUrl: string = this.iconUrl, label: string = this.label, snippet: string = this.snippet, options: RightTailInfoBubbleIconOptions = {}): RightTailInfoBubbleIcon {
    return new RightTailInfoBubbleIcon(iconUrl, label, snippet, {
      fillColor: this.fillColor,
      labelTextColor: this.labelTextColor,
      scale: this.scale,
      iconSize: this.iconSize,
      debug: this.debug,
      ...options,
    });
  }

  toBitmapIcon(): BitmapIcon {
    const drawableSize = Math.max(1, this.iconSize * this.scale);
    const drawableInnerPadding = drawableSize * 0.1;
    const contentMargin = drawableSize * 0.2;
    const labelTextSize = drawableSize * 0.7;
    const snippetTextSize = drawableSize * 0.4;
    const labelWidth = estimateTextWidth(this.label, labelTextSize);
    const labelHeight = labelTextSize * 1.2;
    const snippetHeight = snippetTextSize * 1.2;
    const canvasWidth = Math.ceil(drawableSize + drawableInnerPadding + labelWidth + contentMargin * 2);
    const canvasHeight = Math.ceil(Math.max(drawableSize, labelHeight) + drawableInnerPadding + snippetHeight + drawableInnerPadding * 2);
    const pointerWidth = canvasWidth / 9;
    const pointerHeight = canvasHeight / 8;
    const totalHeight = Math.ceil(canvasHeight + pointerHeight);
    const labelX = contentMargin + drawableSize + drawableInnerPadding;
    const labelY = contentMargin + drawableSize / 2;
    const snippetY = canvasHeight - contentMargin;
    const parts = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${totalHeight}" viewBox="0 0 ${canvasWidth} ${totalHeight}">`,
      `<path d="${rightTailBubblePath(canvasWidth, canvasHeight, pointerWidth, pointerHeight)}" fill="${this.fillColor}"/>`,
      `<image href="${escapeXml(this.iconUrl)}" x="${contentMargin}" y="${contentMargin}" width="${drawableSize - drawableInnerPadding}" height="${drawableSize - drawableInnerPadding}" preserveAspectRatio="xMidYMid meet"/>`,
      `<text x="${labelX}" y="${labelY}" dominant-baseline="middle" font-family="sans-serif" font-size="${labelTextSize}" fill="${this.labelTextColor}">${escapeXml(this.label)}</text>`,
      `<text x="${contentMargin}" y="${snippetY}" dominant-baseline="alphabetic" font-family="sans-serif" font-size="${snippetTextSize}" fill="#808080">${escapeXml(this.snippet)}</text>`,
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
    return hashObject({ type: 'RightTailInfoBubbleIcon', properties: this.properties });
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}

function rightTailBubblePath(width: number, height: number, pointerWidth: number, pointerHeight: number): string {
  return [
    `M 0 0`,
    `H ${width}`,
    `V ${height}`,
    `H ${width - pointerWidth}`,
    `L ${width - pointerWidth * 1.5} ${height + pointerHeight}`,
    `L ${width - pointerWidth * 2} ${height}`,
    `H 0`,
    'Z',
  ].join(' ');
}

function estimateTextWidth(text: string, fontSize: number): number {
  return Array.from(text).reduce((sum, char) => {
    const code = char.codePointAt(0) ?? 0;
    return sum + fontSize * (code > 0xff ? 0.95 : 0.58);
  }, 0);
}
