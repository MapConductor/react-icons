const assert = require('node:assert/strict');
const test = require('node:test');

const {
  CircleIcon,
  FlagIcon,
  RightTailInfoBubbleIcon,
  RoundInfoBubbleIcon,
  CommonMapIcons,
  PinGlyphIcon,
} = require('../dist/index.js');

test('reuses cached bitmap icons for equivalent properties', () => {
  const pairs = [
    [new CircleIcon(), new CircleIcon()],
    [new FlagIcon(), new FlagIcon()],
    [new RoundInfoBubbleIcon('/marker.svg', '$197'), new RoundInfoBubbleIcon('/marker.svg', '$197')],
    [
      new RightTailInfoBubbleIcon('/marker.svg', '5h 37m', '304 mi'),
      new RightTailInfoBubbleIcon('/marker.svg', '5h 37m', '304 mi'),
    ],
    [
      new PinGlyphIcon(CommonMapIcons.hospital),
      new PinGlyphIcon(CommonMapIcons.hospital),
    ],
  ];

  for (const [first, second] of pairs) {
    assert.strictEqual(first.toBitmapIcon(), second.toBitmapIcon());
  }
});

test('renders an explicitly selected common glyph in a pin', () => {
  const icon = new PinGlyphIcon(CommonMapIcons.hospital, { fillColor: '#0067c0' });
  const bitmap = icon.toBitmapIcon();

  assert.equal(icon.glyph.id, 'hospital');
  assert.deepEqual(bitmap.anchor, { x: 0.5, y: 1 });
  assert.match(decodeURIComponent(bitmap.url), /M9 3 L15 3/);
});

test('keeps different icon properties and types in separate entries', () => {
  assert.notStrictEqual(new CircleIcon().toBitmapIcon(), new CircleIcon('#000000').toBitmapIcon());
  assert.notStrictEqual(new CircleIcon().toBitmapIcon(), new FlagIcon().toBitmapIcon());
});

test('evicts the least recently used entry after 512 icons', () => {
  const retained = new CircleIcon('#000000');
  const retainedBitmap = retained.toBitmapIcon();
  const evicted = new CircleIcon('#000001');
  const evictedBitmap = evicted.toBitmapIcon();

  for (let value = 2; value < 512; value += 1) {
    new CircleIcon(`#${value.toString(16).padStart(6, '0')}`).toBitmapIcon();
  }

  assert.strictEqual(retained.toBitmapIcon(), retainedBitmap);
  new CircleIcon('#000200').toBitmapIcon();

  assert.strictEqual(retained.toBitmapIcon(), retainedBitmap);
  assert.notStrictEqual(evicted.toBitmapIcon(), evictedBitmap);
});
