/** A single-color map symbol in a normalized SVG view box. */
export interface MapIconGlyph {
  readonly id: string;
  readonly pathData: string;
  readonly viewBoxSize: number;
}
