export function normalizeWhatsappNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function buildWhatsappUrl(phone: string, message: string) {
  return `https://wa.me/${normalizeWhatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}
