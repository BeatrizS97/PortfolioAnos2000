// src/utils/typeGuards.ts

// Retorna true apenas para números finitos (rejeita NaN, Infinity e qualquer valor que não seja número).
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
