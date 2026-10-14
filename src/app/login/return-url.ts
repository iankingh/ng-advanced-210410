export function internalReturnUrl(value: string | null): string {
  if (!value || value.charAt(0) !== '/' || value.charAt(1) === '/' || value.indexOf('\\') !== -1) {
    return '/dashboard';
  }

  return value;
}
