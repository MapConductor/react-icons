import { AbstractMarkerIcon, Offset, BitmapIcon } from '@mapconductor/js-sdk-core';

interface CircleIconOptions {
    strokeColor?: string;
    strokeWidth?: number;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
declare class CircleIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(fillColor?: string, options?: CircleIconOptions);
    get fillColor(): string;
    get strokeColor(): string;
    get strokeWidth(): number;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(fillColor?: string, options?: CircleIconOptions): CircleIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private size;
}

interface FlagIconOptions {
    strokeColor?: string;
    strokeWidth?: number;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
declare class FlagIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(fillColor?: string, options?: FlagIconOptions);
    get fillColor(): string;
    get strokeColor(): string;
    get strokeWidth(): number;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(fillColor?: string, options?: FlagIconOptions): FlagIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private size;
}

interface RoundInfoBubbleIconOptions {
    fillColor?: string;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
declare class RoundInfoBubbleIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(iconUrl: string, label: string, options?: RoundInfoBubbleIconOptions);
    get iconUrl(): string;
    get label(): string;
    get fillColor(): string;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(iconUrl?: string, label?: string, options?: RoundInfoBubbleIconOptions): RoundInfoBubbleIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private size;
}

interface RightTailInfoBubbleIconOptions {
    fillColor?: string;
    labelTextColor?: string;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
declare class RightTailInfoBubbleIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(iconUrl: string, label: string, snippet: string, options?: RightTailInfoBubbleIconOptions);
    get iconUrl(): string;
    get label(): string;
    get snippet(): string;
    get fillColor(): string;
    get labelTextColor(): string;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(iconUrl?: string, label?: string, snippet?: string, options?: RightTailInfoBubbleIconOptions): RightTailInfoBubbleIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private size;
}

/** A single-color map symbol in a normalized SVG view box. */
interface MapIconGlyph {
    readonly id: string;
    readonly pathData: string;
    readonly viewBoxSize: number;
}

/** Map symbols from the common pack. Selection is always explicit. */
declare const CommonMapIcons: {
    /** Hospital or medical facility. */
    readonly hospital: {
        readonly id: "hospital";
        readonly pathData: "M9 3 L15 3 L15 9 L21 9 L21 15 L15 15 L15 21 L9 21 L9 15 L3 15 L3 9 L9 9 Z";
        readonly viewBoxSize: 24;
    };
};

interface PinGlyphIconOptions {
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
declare class PinGlyphIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly glyph: MapIconGlyph;
    readonly fillColor: string;
    readonly glyphColor: string;
    readonly strokeColor: string;
    readonly strokeWidth: number;
    readonly scale: number;
    readonly infoAnchor: Offset;
    readonly iconSize: number;
    readonly debug: boolean;
    constructor(glyph: MapIconGlyph, options?: PinGlyphIconOptions);
    copy(glyph?: MapIconGlyph, options?: PinGlyphIconOptions): PinGlyphIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
}

interface TeardropPinIconOptions {
    holeColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
/** A round head tapering to a point, anchored at the tip. */
declare class TeardropPinIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(fillColor?: string, options?: TeardropPinIconOptions);
    get fillColor(): string;
    get holeColor(): string;
    get strokeColor(): string;
    get strokeWidth(): number;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(fillColor?: string, options?: TeardropPinIconOptions): TeardropPinIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private size;
}

interface RoundedSquarePinIconOptions {
    holeColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
/** A rounded square whose bottom corners run into a tail, anchored at the tip. */
declare class RoundedSquarePinIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(fillColor?: string, options?: RoundedSquarePinIconOptions);
    get fillColor(): string;
    get holeColor(): string;
    get strokeColor(): string;
    get strokeWidth(): number;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(fillColor?: string, options?: RoundedSquarePinIconOptions): RoundedSquarePinIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private size;
}

interface ThumbnailPinIconOptions {
    frameColor?: string;
    placeholderColor?: string;
    shadow?: boolean;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
/**
 * A framed thumbnail on a rounded square with a tail, anchored at the tip.
 *
 * `imageUrl` fills the inner rounded square, cropped to fill without distortion.
 * SVG rendered through an `<img>` cannot fetch external resources, so pass a
 * `data:` URL — rasterize a remote photo to one first, the same way
 * `RoundInfoBubbleIcon` is used. Until an image is supplied the frame shows
 * `placeholderColor`.
 */
declare class ThumbnailPinIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(imageUrl?: string, options?: ThumbnailPinIconOptions);
    get imageUrl(): string;
    get frameColor(): string;
    get placeholderColor(): string;
    get shadow(): boolean;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(imageUrl?: string, options?: ThumbnailPinIconOptions): ThumbnailPinIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private layout;
    private size;
}

interface PhotoCardPinIconOptions {
    cardColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    placeholderColor?: string;
    shadow?: boolean;
    scale?: number;
    iconSize?: number;
    debug?: boolean;
}
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
declare class PhotoCardPinIcon extends AbstractMarkerIcon {
    readonly anchor: Offset;
    readonly infoAnchor: Offset;
    private readonly properties;
    constructor(imageUrl?: string, title?: string, subtitle?: string, options?: PhotoCardPinIconOptions);
    get imageUrl(): string;
    get title(): string;
    get subtitle(): string;
    get cardColor(): string;
    get titleColor(): string;
    get subtitleColor(): string;
    get placeholderColor(): string;
    get shadow(): boolean;
    get scale(): number;
    get iconSize(): number;
    get debug(): boolean;
    copy(imageUrl?: string, title?: string, subtitle?: string, options?: PhotoCardPinIconOptions): PhotoCardPinIcon;
    toBitmapIcon(): BitmapIcon;
    hashCode(): number;
    private layout;
    private size;
}

export { CircleIcon, type CircleIconOptions, CommonMapIcons, FlagIcon, type FlagIconOptions, type MapIconGlyph, PhotoCardPinIcon, type PhotoCardPinIconOptions, PinGlyphIcon, type PinGlyphIconOptions, RightTailInfoBubbleIcon, type RightTailInfoBubbleIconOptions, RoundInfoBubbleIcon, type RoundInfoBubbleIconOptions, RoundedSquarePinIcon, type RoundedSquarePinIconOptions, TeardropPinIcon, type TeardropPinIconOptions, ThumbnailPinIcon, type ThumbnailPinIconOptions };
