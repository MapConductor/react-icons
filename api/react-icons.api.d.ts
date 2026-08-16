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

export { CircleIcon, type CircleIconOptions, CommonMapIcons, FlagIcon, type FlagIconOptions, type MapIconGlyph, PinGlyphIcon, type PinGlyphIconOptions, RightTailInfoBubbleIcon, type RightTailInfoBubbleIconOptions, RoundInfoBubbleIcon, type RoundInfoBubbleIconOptions };
