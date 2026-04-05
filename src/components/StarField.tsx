/**
 * StarField — realistic twinkling stars in the left and right corners.
 * Pure CSS animations: opacity & scale run on the compositor thread,
 * so this has zero INP impact.
 */

const LEFT_STARS = [
  // [x%, y%, size-px, duration-s, delay-s, color]
  [2,   4,  2.5, 2.8, 0.0,  '#ffffff'],
  [5,   9,  1.2, 3.5, 0.7,  '#c4b5fd'],
  [1,  15,  1.8, 4.1, 1.4,  '#ffffff'],
  [8,  20,  1.0, 2.3, 0.3,  '#fbcfe8'],
  [3,  28,  2.2, 3.9, 2.1,  '#ffffff'],
  [11, 12,  1.5, 5.2, 0.9,  '#a5f3fc'],
  [6,  35,  1.0, 2.7, 1.7,  '#ffffff'],
  [14,  5,  1.8, 3.3, 0.4,  '#c4b5fd'],
  [9,  42,  2.0, 4.5, 1.1,  '#ffffff'],
  [2,  50,  1.2, 3.1, 2.5,  '#fbcfe8'],
  [16, 22,  1.4, 2.6, 0.6,  '#ffffff'],
  [12, 48,  2.6, 4.8, 1.8,  '#a5f3fc'],
  [7,  58,  1.0, 3.7, 0.2,  '#ffffff'],
  [4,  65,  1.6, 2.4, 1.3,  '#c4b5fd'],
  [18, 38,  1.2, 5.5, 0.8,  '#ffffff'],
  [10, 72,  2.0, 3.2, 2.0,  '#ffffff'],
  [1,  78,  1.4, 4.0, 1.5,  '#fbcfe8'],
  [15, 60,  1.8, 2.9, 0.1,  '#ffffff'],
  [6,  84,  1.0, 3.6, 2.3,  '#a5f3fc'],
  [20, 55,  1.2, 4.3, 0.5,  '#ffffff'],
  [3,  90,  2.2, 3.0, 1.9,  '#c4b5fd'],
  [13, 80,  1.6, 5.0, 1.2,  '#ffffff'],
];

const RIGHT_STARS = [
  [98,  4,  2.5, 3.1, 0.2,  '#ffffff'],
  [94,  11, 1.2, 2.6, 0.9,  '#c4b5fd'],
  [99,  18, 1.8, 4.4, 1.6,  '#ffffff'],
  [91,  25, 1.0, 3.8, 0.3,  '#fbcfe8'],
  [96,  33, 2.0, 2.9, 2.2,  '#ffffff'],
  [88,  10, 1.5, 5.1, 0.7,  '#a5f3fc'],
  [93,  40, 1.2, 3.3, 1.4,  '#ffffff'],
  [85,   6, 1.8, 2.7, 0.5,  '#c4b5fd'],
  [90,  47, 2.4, 4.7, 1.0,  '#ffffff'],
  [97,  55, 1.0, 3.6, 2.6,  '#fbcfe8'],
  [83,  20, 1.4, 2.5, 0.4,  '#ffffff'],
  [87,  50, 2.6, 4.9, 1.7,  '#a5f3fc'],
  [92,  62, 1.0, 3.0, 0.1,  '#ffffff'],
  [95,  70, 1.6, 2.3, 1.3,  '#c4b5fd'],
  [81,  35, 1.2, 5.4, 0.8,  '#ffffff'],
  [89,  75, 2.0, 3.5, 2.1,  '#ffffff'],
  [99,  82, 1.4, 4.2, 1.6,  '#fbcfe8'],
  [84,  60, 1.8, 2.8, 0.0,  '#ffffff'],
  [93,  88, 1.0, 3.9, 2.4,  '#a5f3fc'],
  [79,  45, 1.2, 4.6, 0.6,  '#ffffff'],
  [96,  93, 2.2, 3.2, 2.0,  '#c4b5fd'],
  [86,  80, 1.6, 5.2, 1.1,  '#ffffff'],
];

// 4-pointed star SVG path (looks like a real star / sparkle)
function StarShape({ size, color }: { size: number; color: string }) {
  // For tiny stars use circles; for larger ones use a sparkle shape
  if (size < 1.5) {
    return (
      <circle cx="0" cy="0" r={size / 2} fill={color} />
    );
  }
  const s = size;
  const inner = s * 0.28;
  // 4-point sparkle
  const path = `
    M 0 ${-s}
    L ${inner} ${-inner}
    L ${s} 0
    L ${inner} ${inner}
    L 0 ${s}
    L ${-inner} ${inner}
    L ${-s} 0
    L ${-inner} ${-inner}
    Z
  `;
  return <path d={path} fill={color} />;
}

type StarDef = (string | number)[];

function Star({ def }: { def: StarDef }) {
  const [x, y, size, dur, delay, color] = def as [number, number, number, number, number, string];
  const animStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    willChange: 'opacity, transform',
    animation: `star-twinkle ${dur}s ease-in-out ${delay}s infinite`,
    filter: `drop-shadow(0 0 ${size * 1.5}px ${color})`,
  };
  return (
    <div style={animStyle}>
      <svg
        width={size * 2 + 2}
        height={size * 2 + 2}
        viewBox={`${-size - 1} ${-size - 1} ${size * 2 + 2} ${size * 2 + 2}`}
        style={{ overflow: 'visible' }}
      >
        <StarShape size={size} color={color} />
      </svg>
    </div>
  );
}

export default function StarField() {
  return (
    <>
      <style>{`
        @keyframes star-twinkle {
          0%   { opacity: 0.08; transform: scale(0.6); }
          25%  { opacity: 0.55; transform: scale(0.95); }
          50%  { opacity: 1;    transform: scale(1.15); }
          75%  { opacity: 0.45; transform: scale(0.9);  }
          100% { opacity: 0.08; transform: scale(0.6);  }
        }
      `}</style>

      {/* Fixed overlay — sits above background, below content */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {LEFT_STARS.map((def, i) => (
          <Star key={`L${i}`} def={def} />
        ))}
        {RIGHT_STARS.map((def, i) => (
          <Star key={`R${i}`} def={def} />
        ))}
      </div>
    </>
  );
}
