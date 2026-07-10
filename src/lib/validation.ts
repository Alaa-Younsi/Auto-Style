// Algerian mobile numbers: local (0XXXXXXXXX) or international (+213XXXXXXXXX),
// prefix 5/6/7. Users commonly type them with spaces or dashes, so normalize
// before validating/submitting rather than rejecting well-formed numbers.
const PHONE_REGEX = /^(0|\+213)[5-7]\d{8}$/;

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
}

export function isValidAlgerianPhone(phone: string): boolean {
  return PHONE_REGEX.test(normalizePhone(phone));
}
