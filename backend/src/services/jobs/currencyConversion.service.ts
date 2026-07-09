/**
 * Converts job salaries to INR for display. Uses frankfurter.app — free,
 * keyless, ECB-backed FX rates — with an in-memory cache so we don't hit it
 * on every request.
 */

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

let cachedRates: Record<string, number> | null = null;
let cachedAt = 0;

const FALLBACK_RATES: Record<string, number> = {
  USD: 83,
  EUR: 90,
  GBP: 105,
  INR: 1,
};

async function getRatesToInr(): Promise<Record<string, number>> {
  if (cachedRates && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedRates;
  }

  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP");
    if (!res.ok) throw new Error(`frankfurter.app responded with ${res.status}`);
    const data = (await res.json()) as { rates: Record<string, number> };

    // API gives INR->X; invert to get X->INR.
    const rates: Record<string, number> = { INR: 1 };
    for (const [currency, rate] of Object.entries(data.rates)) {
      rates[currency] = 1 / rate;
    }

    cachedRates = rates;
    cachedAt = Date.now();
    return rates;
  } catch (error) {
    console.error("Failed to fetch FX rates, using fallback:", error);
    return FALLBACK_RATES;
  }
}

export async function convertToInr(amount: number | null, currency: string | null): Promise<number | null> {
  if (amount == null) return null;
  const cur = (currency ?? "USD").toUpperCase();
  if (cur === "INR") return Math.round(amount);

  const rates = await getRatesToInr();
  const rate = rates[cur] ?? FALLBACK_RATES[cur] ?? FALLBACK_RATES.USD;
  return Math.round(amount * rate);
}

export async function convertRangeToInr(
  min: number | null,
  max: number | null,
  currency: string | null
): Promise<{ min: number | null; max: number | null }> {
  return {
    min: await convertToInr(min, currency),
    max: await convertToInr(max, currency),
  };
}
