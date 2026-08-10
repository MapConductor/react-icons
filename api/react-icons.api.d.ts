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

export { CircleIcon, type CircleIconOptions, FlagIcon, type FlagIconOptions, RightTailInfoBubbleIcon, type RightTailInfoBubbleIconOptions, RoundInfoBubbleIcon, type RoundInfoBubbleIconOptions };
