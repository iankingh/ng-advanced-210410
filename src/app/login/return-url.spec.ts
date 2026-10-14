import { internalReturnUrl } from './return-url';

describe('internalReturnUrl', () => {
  it('preserves an internal route with its query and fragment', () => {
    expect(internalReturnUrl('/components/cards?view=all#details'))
      .toBe('/components/cards?view=all#details');
  });

  it('falls back to the dashboard for external or malformed destinations', () => {
    expect(internalReturnUrl('https://example.com')).toBe('/dashboard');
    expect(internalReturnUrl('//example.com')).toBe('/dashboard');
    expect(internalReturnUrl('/\\example.com')).toBe('/dashboard');
    expect(internalReturnUrl(null)).toBe('/dashboard');
  });
});
