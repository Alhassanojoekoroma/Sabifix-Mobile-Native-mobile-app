import { createContext, useContext } from 'react';

interface OnboardingContextType {
    completeOnboarding: () => Promise<void>;
}

export const OnboardingContext = createContext<OnboardingContextType>({
    completeOnboarding: async () => { },
});

export const useOnboarding = () => useContext(OnboardingContext);
