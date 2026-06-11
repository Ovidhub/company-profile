export type PaymentMethodType = "bank_transfer" | "paystack" | "flutterwave" | "card" | "cash_on_delivery" | "paypal" | "stripe" | "custom";

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  enabled: boolean;
  isDefault: boolean;
  description?: string;
  icon?: string; // emoji or text representation
  // Bank Transfer fields
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  swiftCode?: string;
  bankAddress?: string;
  // Paystack/Flutterwave/Stripe fields
  publicKey?: string;
  secretKey?: string;
  // Card field (no details, just enabled)
  // Cash on Delivery fields
  codInstructions?: string;
  // Custom fields
  customInstructions?: string;
  order: number;
  metadata?: Record<string, string>;
}

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm_paystack",
    name: "Paystack",
    type: "paystack",
    enabled: true,
    isDefault: true,
    description: "Secure online payments via Paystack — supports cards, bank transfer, and USSD.",
    icon: "💳",
    publicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    secretKey: "demo-secret-placeholder",
    order: 1,
  },
  {
    id: "pm_bank_transfer",
    name: "Bank Transfer (Nigeria)",
    type: "bank_transfer",
    enabled: true,
    isDefault: false,
    description: "Direct bank transfer to our corporate account.",
    icon: "🏦",
    bankName: "Guaranty Trust Bank (GTBank)",
    accountName: "De-Ebrightmarn Limited",
    accountNumber: "0123456789",
    routingNumber: "058",
    swiftCode: "GTBINGLA",
    bankAddress: "Plot 123, Ahmadu Bello Way, Victoria Island, Lagos, Nigeria",
    order: 2,
  },
  {
    id: "pm_cod",
    name: "Cash on Delivery",
    type: "cash_on_delivery",
    enabled: true,
    isDefault: false,
    description: "Pay in cash when your order is delivered (Abuja only).",
    icon: "💵",
    codInstructions: "Available for orders within Abuja FCT. Please have exact amount ready. Inspection allowed before payment.",
    order: 3,
  },
  {
    id: "pm_flutterwave",
    name: "Flutterwave",
    type: "flutterwave",
    enabled: false,
    isDefault: false,
    description: "Pan-African payment gateway — cards, mobile money, and bank transfers across Africa.",
    icon: "🌍",
    publicKey: "",
    secretKey: "",
    order: 4,
  },
  {
    id: "pm_stripe",
    name: "Stripe",
    type: "stripe",
    enabled: false,
    isDefault: false,
    description: "International credit/debit card payments powered by Stripe.",
    icon: "💎",
    publicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx",
    secretKey: "demo-secret-placeholder",
    order: 5,
  },
];
