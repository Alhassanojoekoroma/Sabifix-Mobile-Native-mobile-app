/**
 * Monime Payment Service - Updated for Checkout Session API
 * Supports Orange Money, AfriMoney, QMoney, and other payment methods
 */

const MONIME_API_KEY = process.env.EXPO_PUBLIC_MONIME_API_KEY;
const MONIME_MODE = process.env.EXPO_PUBLIC_MONIME_MODE || 'test';
const BASE_URL = 'https://api.monime.io';
const API_VERSION = 'caph-2025-08-23';

export interface CheckoutSessionParams {
    amount: number; // in minor units (e.g., cents, kobo)
    currency: string;
    metadata?: Record<string, any>;
    successUrl?: string;
    cancelUrl?: string;
}

export interface CheckoutSession {
    id: string;
    url: string;
    status: string;
    amount: number;
    currency: string;
}

/**
 * Create a Checkout Session for payment
 * This supports all payment methods: Orange Money, AfriMoney, QMoney, Cards, Banks
 */
export async function createCheckoutSession(
    params: CheckoutSessionParams
): Promise<CheckoutSession> {
    try {
        const response = await fetch(`${BASE_URL}/v1/checkout_sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MONIME_API_KEY}`,
                'Content-Type': 'application/json',
                'Monime-Version': API_VERSION,
            },
            body: JSON.stringify({
                amount: params.amount,
                currency: params.currency,
                metadata: params.metadata,
                success_url: params.successUrl,
                cancel_url: params.cancelUrl,
                mode: MONIME_MODE,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create checkout session');
        }

        const data = await response.json();
        return {
            id: data.id,
            url: data.url,
            status: data.status,
            amount: data.amount,
            currency: data.currency,
        };
    } catch (error) {
        console.error('Checkout session creation error:', error);
        throw error;
    }
}

/**
 * Get Checkout Session status
 */
export async function getCheckoutSession(sessionId: string): Promise<CheckoutSession> {
    try {
        const response = await fetch(`${BASE_URL}/v1/checkout_sessions/${sessionId}`, {
            headers: {
                'Authorization': `Bearer ${MONIME_API_KEY}`,
                'Monime-Version': API_VERSION,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get checkout session');
        }

        return await response.json();
    } catch (error) {
        console.error('Get checkout session error:', error);
        throw error;
    }
}

/**
 * Get available payment methods
 */
export async function getPaymentMethods(): Promise<string[]> {
    // Monime supports these payment methods
    return [
        'Orange Money',
        'AfriMoney',
        'QMoney',
        'Bank Transfer',
        'Card Payment',
        'Mobile Money',
    ];
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency: string = 'SLE'): string {
    const majorUnits = toMajorUnits(amount);
    return `Le ${majorUnits.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Convert major units to minor units (e.g., dollars to cents)
 */
export function toMinorUnits(amount: number): number {
    return Math.round(amount * 100);
}

/**
 * Convert minor units to major units (e.g., cents to dollars)
 */
export function toMajorUnits(amount: number): number {
    return amount / 100;
}

/**
 * Validate amount
 */
export function isValidAmount(amount: number, minAmount: number = 1000): boolean {
    return amount >= minAmount && amount > 0;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
        SLE: 'Le',
        USD: '$',
        EUR: '€',
        GBP: '£',
    };
    return symbols[currency] || currency;
}
