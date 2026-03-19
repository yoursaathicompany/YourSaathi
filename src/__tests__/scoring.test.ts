// ─── Scoring & Coin Logic Unit Tests ─────────────────────────────────────

describe('Scoring Logic', () => {
  // Mock normalized compare function (simulating the one in our API)
  const normalize = (val: any) => {
    if (Array.isArray(val)) return val.map(String).sort().join('|');
    return String(val ?? '').toLowerCase().trim();
  };

  test('Grading MCQ Single Correct', () => {
    const user = 'Berlin';
    const correct = 'Berlin';
    expect(normalize(user)).toBe(normalize(correct));
  });

  test('Grading MCQ Single Incorrect', () => {
    const user = 'Tokyo';
    const correct = 'Berlin';
    expect(normalize(user)).not.toBe(normalize(correct));
  });

  test('Grading MCQ Multi Correct (Order Indifferent)', () => {
    const user = ['React', 'Next.js'];
    const correct = ['Next.js', 'React'];
    expect(normalize(user)).toBe(normalize(correct));
  });

  test('Grading MCQ Multi Partial/Incorrect', () => {
    const user = ['React'];
    const correct = ['React', 'Next.js'];
    expect(normalize(user)).not.toBe(normalize(correct));
  });
});

describe('Coin Reward Logic', () => {
  const MAX_COINS = 100;
  const calculateCoins = (correct: number) => Math.min(correct, MAX_COINS);

  test('Award 1 coin per correct answer', () => {
    expect(calculateCoins(15)).toBe(15);
  });

  test('Cap coins at MAX_COINS_PER_ATTEMPT', () => {
    expect(calculateCoins(150)).toBe(100);
  });

  test('Zero coins for zero correct', () => {
    expect(calculateCoins(0)).toBe(0);
  });
});
