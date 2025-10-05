// Aplica máscara brasileira de telefone: (00) 00000-0000
export function applyPhoneMask(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  const dlen = digits.length;
  if (dlen === 0) return '';

  const area = digits.slice(0, 2);
  const mid = digits.slice(2, Math.min(7, dlen));
  const last = digits.slice(7, dlen);

  if (dlen <= 2) {
    return `(${area}`;
  }

  if (dlen <= 7) {
    return `(${area}) ${mid}`;
  }

  return `(${area}) ${mid}-${last}`;
}

// Remove máscara, retornando apenas dígitos (útil se necessário)
export function stripPhoneMask(masked: string): string {
  return masked.replace(/\D/g, '');
}