import { AbstractMarkerIcon, Settings, type BitmapIcon, type Offset } from '@mapconductor/js-sdk-core';
import { debugRect, escapeXml, hashObject, normalizeColor, svgBitmapIcon, getOrCreateBitmapIcon, type IconSize } from './utils';

export interface ThumbnailPinIconOptions {
  frameColor?: string;
  placeholderColor?: string;
  shadow?: boolean;
  scale?: number;
  iconSize?: number;
  debug?: boolean;
}

interface ThumbnailPinIconProperties {
  imageUrl: string;
  frameColor: string;
  placeholderColor: string;
  shadow: boolean;
  scale: number;
  iconSize: number;
  debug: boolean;
}

/** Canvas aspect from the A-03 sheet: 50 wide by 56 tall. */
const WIDTH_TO_HEIGHT_RATIO = 50 / 56;

/** Body height as a fraction of the shape height; the tail takes the rest. */
const BODY_HEIGHT_RATIO = 50 / 56;

/** Outer corner radius as a fraction of the shape width. Fitted to the sheet. */
const CORNER_RADIUS_RATIO = 9.25 / 50;

/** Frame thickness as a fraction of the shape width. */
const FRAME_THICKNESS_RATIO = 2 / 50;

/** Tail half width at the body's bottom edge, as a fraction of the shape width. */
const TAIL_HALF_WIDTH_RATIO = 4 / 50;

/** Drop shadow blur, offset and opacity, matching the sheet. */
const SHADOW_BLUR_RATIO = 2 / 50;
const SHADOW_OFFSET_Y_RATIO = 2 / 50;
const SHADOW_OPACITY = 0.2;

/**
 * A framed thumbnail on a rounded square with a tail, anchored at the tip.
 *
 * `imageUrl` fills the inner rounded square, cropped to fill without distortion.
 * SVG rendered through an `<img>` cannot fetch external resources, so pass a
 * `data:` URL — rasterize a remote photo to one first, the same way
 * `RoundInfoBubbleIcon` is used. Until an image is supplied the frame shows
 * `placeholderColor`.
 */
export class ThumbnailPinIcon extends AbstractMarkerIcon {
  readonly anchor: Offset;
  readonly infoAnchor: Offset = { x: 0.5, y: 0 };
  private readonly properties: ThumbnailPinIconProperties;

  constructor(imageUrl: string = '', options: ThumbnailPinIconOptions = {}) {
    super();
    this.properties = {
      imageUrl,
      frameColor: normalizeColor(options.frameColor ?? '#ffffff'),
      placeholderColor: normalizeColor(options.placeholderColor ?? '#d7d8dd'),
      shadow: options.shadow ?? true,
      scale: options.scale ?? 1,
      iconSize: options.iconSize ?? Settings.Default.iconSize,
      debug: options.debug ?? false,
    };
    // The shadow needs room around the shape, which pushes the tip up off the
    // canvas edge, so the anchor follows the layout rather than being fixed.
    const { shapeHeight, padding, canvasHeight } = this.layout();
    this.anchor = { x: 0.5, y: (padding + shapeHeight) / canvasHeight };
  }

  get imageUrl(): string { return this.properties.imageUrl; }
  get frameColor(): string { return this.properties.frameColor; }
  get placeholderColor(): string { return this.properties.placeholderColor; }
  get shadow(): boolean { return this.properties.shadow; }
  get scale(): number { return this.properties.scale; }
  get iconSize(): number { return this.properties.iconSize; }
  get debug(): boolean { return this.properties.debug; }

  copy(imageUrl: string = this.imageUrl, options: ThumbnailPinIconOptions = {}): ThumbnailPinIcon {
    return new ThumbnailPinIcon(imageUrl, {
      frameColor: this.frameColor,
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
      const { shapeWidth, shapeHeight, padding, canvasWidth, canvasHeight } = this.layout();

      const left = padding;
      const top = padding;
      const right = left + shapeWidth;
      const centerX = left + shapeWidth / 2;
      const bodyBottom = top + shapeHeight * BODY_HEIGHT_RATIO;
      const tipY = top + shapeHeight;
      const radius = Math.min(shapeWidth * CORNER_RADIUS_RATIO, shapeWidth / 2, (bodyBottom - top) / 2);
      const tailHalfWidth = Math.min(shapeWidth * TAIL_HALF_WIDTH_RATIO, shapeWidth / 2 - radius);
      const frame = shapeWidth * FRAME_THICKNESS_RATIO;

      // One closed path: rounded body with the tail spliced into its bottom edge.
      const pinPath = [
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

      // The frame keeps a uniform thickness, so the photo's corners are the
      // body's corners pulled in by that thickness.
      const imageX = left + frame;
      const imageY = top + frame;
      const imageSize = Math.max(0, shapeWidth - frame * 2);
      const imageHeight = Math.max(0, bodyBottom - top - frame * 2);
      const imageRadius = Math.max(0, radius - frame);

      const id = this.hashCode().toString(36);
      const blur = shapeWidth * SHADOW_BLUR_RATIO;
      const offsetY = shapeWidth * SHADOW_OFFSET_Y_RATIO;

      const parts = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">`,
        '<defs>',
        `<clipPath id="c${id}"><rect x="${format(imageX)}" y="${format(imageY)}" width="${format(imageSize)}" height="${format(imageHeight)}" rx="${format(imageRadius)}" ry="${format(imageRadius)}"/></clipPath>`,
        this.shadow
          ? `<filter id="s${id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="${format(offsetY)}" stdDeviation="${format(blur)}" flood-color="#000000" flood-opacity="${SHADOW_OPACITY}"/></filter>`
          : '',
        '</defs>',
        `<path d="${pinPath}" fill="${escapeXml(this.frameColor)}"${this.shadow ? ` filter="url(#s${id})"` : ''}/>`,
        `<g clip-path="url(#c${id})">`,
        `<rect x="${format(imageX)}" y="${format(imageY)}" width="${format(imageSize)}" height="${format(imageHeight)}" fill="${escapeXml(this.placeholderColor)}"/>`,
        this.imageUrl
          ? `<image href="${escapeXml(this.imageUrl)}" x="${format(imageX)}" y="${format(imageY)}" width="${format(imageSize)}" height="${format(imageHeight)}" preserveAspectRatio="xMidYMid slice"/>`
          : '',
        '</g>',
        this.debug ? debugRect(canvasWidth, canvasHeight) : '',
        '</svg>',
      ];
      return svgBitmapIcon({ svg: parts.join(''), anchor: this.anchor, size: this.size(canvasWidth, canvasHeight) });
    });
  }

  hashCode(): number {
    return hashObject({ type: 'ThumbnailPinIcon', properties: this.properties });
  }

  private layout(): {
    shapeWidth: number;
    shapeHeight: number;
    padding: number;
    canvasWidth: number;
    canvasHeight: number;
  } {
    const shapeHeight = Math.max(1, Math.round(this.properties.iconSize * this.properties.scale));
    const shapeWidth = Math.max(1, Math.round(shapeHeight * WIDTH_TO_HEIGHT_RATIO));
    // Enough room for three standard deviations of blur plus the offset.
    const padding = this.properties.shadow
      ? Math.ceil(shapeWidth * (SHADOW_BLUR_RATIO * 3 + SHADOW_OFFSET_Y_RATIO))
      : 0;
    return {
      shapeWidth,
      shapeHeight,
      padding,
      canvasWidth: shapeWidth + padding * 2,
      canvasHeight: shapeHeight + padding * 2,
    };
  }

  private size(width: number, height: number): IconSize {
    return { width, height };
  }
}

const format = (value: number): string => String(Number(value.toFixed(4)));
