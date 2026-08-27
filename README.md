# MapConductor Icons for React

Map-ready React icon containers and region-neutral glyphs. Use them for application-owned markers such as a hospital symbol inside a pin, circle, flag, or information bubble.

Locale never changes an icon automatically. Choose a regional pack explicitly when local conventions matter.

## Installation

Install the current stable package:

```sh
npm install @mapconductor/react-icons
```

The glyph API documented below is on branch `0.2.0-2` until the next npm release. To try it from source:

```sh
git clone --branch 0.2.0-2 https://github.com/MapConductor/react-icons.git
cd react-icons
npm install
npm run build
```

Then install that local directory in your application with `npm install /path/to/react-icons`.

## Quick start

```ts
import {
  CommonMapIcons,
  PinGlyphIcon,
} from '@mapconductor/react-icons';

const hospitalMarker = new PinGlyphIcon(CommonMapIcons.hospital, {
  fillColor: '#e53935',
  glyphColor: '#ffffff',
});

const bitmapIcon = hospitalMarker.toBitmapIcon();
```

The package also provides `TeardropPinIcon`, `RoundedSquarePinIcon`, `ThumbnailPinIcon`, `CircleIcon`, `FlagIcon`, `RoundInfoBubbleIcon`, and `RightTailInfoBubbleIcon` for their existing shape, image, and label use cases. `ThumbnailPinIcon` frames a caller-supplied photo and `PhotoCardPinIcon` puts one on a card with a title and a subtitle; pass either a `data:` URL, since SVG rendered as an image cannot fetch external resources. Rendered bitmap icons use a bounded LRU cache.

## Regional packs

- [Japan](https://github.com/MapConductor/react-icons-jp)
- [United States](https://github.com/MapConductor/react-icons-us)
- [Weather](https://github.com/MapConductor/react-icons-weather)

## Contributing icons

Cross-platform artwork and generated API definitions live in the Android source repository. Stable IDs and shapes remain identical across Android, iOS, and React.

<!-- BEGIN GENERATED ICON CATALOG -->
## Included glyphs

Glyph IDs are stable across Android, iOS, and React.

| Preview | API | Stable ID | Description |
|---|---|---|---|
| <img src="docs/icons/hospital.svg" width="40" height="40" alt="Hospital or medical facility"> | `CommonMapIcons.hospital` | `hospital` | Hospital or medical facility |
<!-- END GENERATED ICON CATALOG -->
