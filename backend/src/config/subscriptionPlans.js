
export const SUBSCRIPTION_TRIAL_DAYS = 30

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'INR',
    trialEligible: false,
    features: [],
  },

  BASIC: {
    name: 'Basic',
    monthlyPrice: 299,
    annualPrice: 2999,
    currency: 'INR',
    trialEligible: true,
    features: [],
  },

  PRO: {
    name: 'Pro',
    monthlyPrice: 499,
    annualPrice: 5499,
    currency: 'INR',
    trialEligible: true,
    features: [],
  },

  ENTERPRISE: {
    name: 'Enterprise',
    monthlyPrice: 799,
    annualPrice: 9499,
    currency: 'INR',
    trialEligible: true,
    features: [],
  },
}
