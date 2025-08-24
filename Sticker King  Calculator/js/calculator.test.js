import { calculatePrice } from './calculator.js';

// Mocking config dependency
jest.mock('./config.js', () => ({
  get MATERIAL_PRICES() {
    return {
      unspecified: 0,
      print_only: 460.00,
      cut_contour: 560.00,
      uv_lamination: 800.00,
      chromadeck: 2300.00,
      poster: 400.00,
      iron_on: 970.00,
    };
  },
  get ROLL_WIDTH() {
    return 650;
  },
  get BLEED() {
    return 1;
  },
  get MIN_PRICE_PER_STICKER() {
    return 0.20;
  }
}));

describe('calculatePrice', () => {
  test('should calculate the correct price for a standard sticker', () => {
    // 100mm x 100mm sticker, print_only price is 460
    // Roll width = 650mm. Bleed = 1mm.
    // Width with bleed = 101mm.
    // Stickers per row (horizontal) = floor(650 / 101) = 6
    // Cost per row = Area * vinylCost = (0.65m * 0.1m) * 460 = 29.9
    // Price per sticker = 29.9 / 6 = 4.98333
    const { price } = calculatePrice(100, 100, 'print_only');
    expect(price).toBe('4.98');
  });

  test('should return "Invalid dimensions" for zero width', () => {
    const { price } = calculatePrice(0, 100, 'print_only');
    expect(price).toBe('Invalid dimensions');
  });

  test('should return "Invalid dimensions" for negative height', () => {
    const { price } = calculatePrice(100, -50, 'print_only');
    expect(price).toBe('Invalid dimensions');
  });

  test('should return "Invalid dimensions" for unspecified material', () => {
    const { price } = calculatePrice(100, 100, 'unspecified');
    expect(price).toBe('Invalid dimensions');
  });

  test('should calculate correct price for cut_contour material', () => {
    // Using the same dimensions, but with cut_contour price (560)
    // Cost per row = (0.65 * 0.1) * 560 = 36.4
    // Price per sticker = 36.4 / 6 = 6.0666
    const { price } = calculatePrice(100, 100, 'cut_contour');
    expect(price).toBe('6.07');
  });

  test('should calculate correct price for poster material', () => {
    // Poster price is 400
    // Cost per row = (0.65 * 0.1) * 400 = 26
    // Price per sticker = 26 / 6 = 4.3333
    const { price } = calculatePrice(100, 100, 'poster');
    expect(price).toBe('4.33');
  });
});
