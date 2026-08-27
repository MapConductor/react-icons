import { AbstractMarkerIcon, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, escapeXml, hashObject, normalizeColor, svgBitmapIcon, getOrCreateBitmapIcon, type IconSize } from './utils';

export interface PhotoCardPinIconOptions {
  cardColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  placeholderColor?: string;
  shadow?: boolean;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface PhotoCardPinIconProperties {
  imageUrl: string;
  title: string;
  subtitle: string;
  cardColor: string;
  titleColor: string;
  subtitleColor: string;
  placeholderColor: string;
  shadow: boolean;
  scale: number;
  iconSize: number;
  debug: boolean;
}

// Every measurement below is in the A-04 sheet's own 112 x 107 coordinates and
// is scaled by a single factor, so the card keeps its proportions at any size.
const DESIGN_WIDTH = 112;
const DESIGN_HEIGHT = 107;
const CORNER_RADIUS = 10;
/** Photo band across the top; its bottom edge is straight. */
const PHOTO_HEIGHT = 52;
/** Card body, i.e. everything above the tail. */
const BODY_HEIGHT = 99;
const TAIL_HALF_WIDTH = 6;
const TEXT_PADDING_X = 10.5;
const TITLE_BASELINE = 73;
const TITLE_FONT_SIZE = 11.5;
const SUBTITLE_BASELINE = 89;
const SUBTITLE_FONT_SIZE = 10.25;
const SHADOW_BLUR = 5.5;
const SHADOW_OFFSET_Y = 3;
const SHADOW_OPACITY = 0.2;

/** System stack, because SVG drawn as an image cannot pull in a web font. */
const FONT_FAMILY = "-apple-system, 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', sans-serif";

/**
 * A photo card with a title and a subtitle, anchored at the tip of its tail.
 *
 * `imageUrl` fills the photo band, cropped to fill without distortion. SVG
 * rendered through an `<img>` cannot fetch external resources, so pass a `data:`
 * URL — rasterize a remote photo to one first, the same way `RoundInfoBubbleIcon`
 * is used. Without an image the band shows `placeholderColor`.
 *
 * `iconSize` is the card's height and defaults to the sheet's own 107 rather than
 * `Settings.Default.iconSize`: the card carries text, which is unreadable once
 * the whole card is scaled down to a plain marker's size.
 */
export class PhotoCardPinIcon extends AbstractMarkerIcon {
  readonly anchor: Offset;
  readonly infoAnchor: Offset = { x: 0.5, y: 0 };
  private readonly properties: PhotoCardPinIconProperties;

  constructor(
    imageUrl: string = '',
    title: string = '',
    subtitle: string = '',
    options: PhotoCardPinIconOptions = {},
  ) {
    super();
    this.properties = {
      imageUrl,
      title,
      subtitle,
      cardColor: normalizeColor(options.cardColor ?? '#ffffff'),
      titleColor: normalizeColor(options.titleColor ?? '#1f1f1f'),
      subtitleColor: normalizeColor(options.subtitleColor ?? '#1f1f1f'),
      placeholderColor: normalizeColor(options.placeholderColor ?? '#d7d8dd'),
      shadow: options.shadow ?? true,
      scale: options.scale ?? 1,
      iconSize: options.iconSize ?? DESIGN_HEIGHT,
      debug: options.debug ?? false,
    };
    // The shadow needs room around the card, which lifts the tip off the canvas
    // edge, so the anchor follows the layout rather than being fixed.
    const { cardHeight, padding, canvasHeight } = this.layout();
    this.anchor = { x: 0.5, y: (padding + cardHeight) / canvasHeight };
  }

  get imageUrl(): string { return this.properties.imageUrl; }
  get title(): string { return this.properties.title; }
  get subtitle(): string { return this.properties.subtitle; }
  get cardColor(): string { return this.properties.cardColor; }
  get titleColor(): string { return this.properties.titleColor; }
  get subtitleColor(): string { return this.properties.subtitleColor; }
  get placeholderColor(): string { return this.properties.placeholderColor; }
  get shadow(): boolean { return this.properties.shadow; }
  get scale(): number { return this.properties.scale; }
  get iconSize(): number { return this.properties.iconSize; }
  get debug(): boolean { return this.properties.debug; }

  copy(
    imageUrl: string = this.imageUrl,
    title: string = this.title,
    subtitle: string = this.subtitle,
    options: PhotoCardPinIconOptions = {},
  ): PhotoCardPinIcon {
    return new PhotoCardPinIcon(imageUrl, title, subtitle, {
      cardColor: this.cardColor,
      titleColor: this.titleColor,
      subtitleColor: this.subtitleColor,
      placeholderColor: this.placeholderColor,
      shadow: this.shadow,
      scale: this.scale,
      iconSize: this.iconSize,
      debug: this.debug,
      ...options,
    });
  }

  toBitmapIcon(): BitmapIcon {
    return getOrCreateBitmapIcon(this.hashCode(), () => {
      const { unit, cardWidth, cardHeight, padding, canvasWidth, canvasHeight } = this.layout();

      const left = padding;
      const top = padding;
      const right = left + cardWidth;
      const centerX = left + cardWidth / 2;
      const radius = CORNER_RADIUS * unit;
      const photoBottom = top + PHOTO_HEIGHT * unit;
      const bodyBottom = top + BODY_HEIGHT * unit;
      const tipY = top + cardHeight;
      const tailHalfWidth = Math.min(TAIL_HALF_WIDTH * unit, cardWidth / 2 - radius);

      // One closed path: rounded card with the tail spliced into its bottom edge.
      const cardPath = [
        `M ${format(left + radius)} ${format(top)}`,
        `H ${format(right - radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(right)} ${format(top + radius)}`,
        `V ${format(bodyBottom - radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(right - radius)} ${format(bodyBottom)}`,
        `H ${format(centerX + tailHalfWidth)}`,
        `L ${format(centerX)} ${format(tipY)}`,
        `L ${format(centerX - tailHalfWidth)} ${format(bodyBottom)}`,
        `H ${format(left + radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(left)} ${format(bodyBottom - radius)}`,
        `V ${format(top + radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(left + radius)} ${format(top)}`,
        'Z',
      ].join(' ');

      // The photo shares the card's top corners and is cut off square at the
      // band's bottom edge.
      const photoPath = [
        `M ${format(left)} ${format(top + radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(left + radius)} ${format(top)}`,
        `H ${format(right - radius)}`,
        `A ${format(radius)} ${format(radius)} 0 0 1 ${format(right)} ${format(top + radius)}`,
        `V ${format(photoBottom)}`,
        `H ${format(left)}`,
        'Z',
      ].join(' ');

      const id = this.hashCode().toString(36);
      const textX = left + TEXT_PADDING_X * unit;
      const textWidth = cardWidth - TEXT_PADDING_X * unit * 2;
      const titleSize = TITLE_FONT_SIZE * unit;
      const subtitleSize = SUBTITLE_FONT_SIZE * unit;
      const title = truncateToWidth(this.title, titleSize, textWidth);
      const subtitle = truncateToWidth(this.subtitle, subtitleSize, textWidth);

      const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">`,
        '<defs>',
        `<clipPath id="c${id}"><path d="${photoPath}"/></clipPath>`,
        this.shadow
          ? `<filter id="s${id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="${format(SHADOW_OFFSET_Y * unit)}" stdDeviation="${format(SHADOW_BLUR * unit)}" flood-color="#000000" flood-opacity="${SHADOW_OPACITY}"/></filter>`
          : '',
        '</defs>',
        `<path d="${cardPath}" fill="${escapeXml(this.cardColor)}"${this.shadow ? ` filter="url(#s${id})"` : ''}/>`,
        `<g clip-path="url(#c${id})">`,
        `<path d="${photoPath}" fill="${escapeXml(this.placeholderColor)}"/>`,
        this.imageUrl
          ? `<image href="${escapeXml(this.imageUrl)}" x="${format(left)}" y="${format(top)}" width="${format(cardWidth)}" height="${format(PHOTO_HEIGHT * unit)}" preserveAspectRatio="xMidYMid slice"/>`
          : '',
        '</g>',
        title
          ? `<text x="${format(textX)}" y="${format(top + TITLE_BASELINE * unit)}" font-family="${FONT_FAMILY}" font-size="${format(titleSize)}" font-weight="600" fill="${escapeXml(this.titleColor)}">${escapeXml(title)}</text>`
          : '',
        subtitle
          ? `<text x="${format(textX)}" y="${format(top + SUBTITLE_BASELINE * unit)}" font-family="${FONT_FAMILY}" font-size="${format(subtitleSize)}" font-weight="700" fill="${escapeXml(this.subtitleColor)}">${escapeXml(subtitle)}</text>`
          : '',
        this.debug ? debugRect(canvasWidth, canvasHeight) : '',
        '</svg>',
      ];
      return svgBitmapIcon({ svg: parts.join(''), anchor: this.anchor, size: this.size(canvasWidth, canvasHeight) });
    });
  }

  hashCode(): number {
    return hashObject({ type: 'PhotoCardPinIcon', properties: this.properties });
  }

  private layout(): {
    unit: number;
    cardWidth: number;
    cardHeight: number;
    padding: number;
    canvasWidth: number;
    canvasHeight: number;
  } {
    const cardHeight = Math.max(1, Math.round(this.properties.iconSize * this.properties.scale));
    const unit = cardHeight / DESIGN_HEIGHT;
    const cardWidth = Math.max(1, Math.round(DESIGN_WIDTH * unit));
    // Enough room for three standard deviations of blur plus the offset.
    const padding = this.properties.shadow
      ? Math.ceil((SHADOW_BLUR * 3 + SHADOW_OFFSET_Y) * unit)
      : 0;
    return {
      unit,
      cardWidth,
      cardHeight,
      padding,
      canvasWidth: cardWidth + padding * 2,
      canvasHeight: cardHeight + padding * 2,
    };
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}

const format = (value: number): string => String(Number(value.toFixed(4)));

function estimateTextWidth(text: string, fontSize: number): number {
  return Array.from(text).reduce((sum, char) => {
    const code = char.codePointAt(0) ?? 0;
    return sum + fontSize * (code > 0xff ? 0.95 : 0.58);
  }, 0);
}

/** Trims to the card's width, since SVG text has no ellipsis of its own. */
function truncateToWidth(text: string, fontSize: number, maxWidth: number): string {
  if (!text || estimateTextWidth(text, fontSize) <= maxWidth) return text;
  const chars = Array.from(text);
  while (chars.length > 0 && estimateTextWidth(`${chars.join('')}…`, fontSize) > maxWidth) {
    chars.pop();
  }
  return chars.length > 0 ? `${chars.join('')}…` : '';
}
