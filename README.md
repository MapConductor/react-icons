# @mapconductor/react-icons

Marker icon utilities for MapConductor React SDK.

This package is the React/TypeScript port of `android-icons`.

Map glyphs are selected explicitly; the package never substitutes a symbol from
the browser locale.

```ts
import { CommonMapIcons, PinGlyphIcon } from '@mapconductor/react-icons';

const hospital = new PinGlyphIcon(CommonMapIcons.hospital, {
  fillColor: '#0067c0',
  glyphColor: '#ffffff',
});
```

Region-specific glyphs are distributed as separate packages such as
`@mapconductor/react-icons-jp` and use the same containers.

```ts
import { CircleIcon, FlagIcon } from '@mapconductor/react-icons';

const circle = new CircleIcon('#ef4444');
const flag = new FlagIcon('#2563eb');
```

The info-bubble icons accept an image URL where Android accepts a `Drawable`.

```ts
import { RoundInfoBubbleIcon, RightTailInfoBubbleIcon } from '@mapconductor/react-icons';

const round = new RoundInfoBubbleIcon('/marker.svg', '$197');
const rightTail = new RightTailInfoBubbleIcon('/marker.svg', '5時間37分', '304マイル');
```
