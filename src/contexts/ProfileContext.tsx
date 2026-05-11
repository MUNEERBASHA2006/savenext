import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  avatar: string;
  isOnboarded: boolean;
  isBankConnected: boolean;
  bankName?: string;
}

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'New User',
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-cumOnrbmKqfPJdyvbWi1mKsMp39EQuncC9FOGOxLxTx2-3EV8lt2vUp27GZBNCUakjRIxVV9FJTVf93wea_gn6o74C8ZoJFFLW7ZYLdoKPPkk3xF2Vyjhf24nqiCqM81CDC99m-E6zLu79VPgwX8456vIvgKCbv3he_57X1-d9xCVovQElLbmHLRGgRFmdhKyIffVv-M4OtrCrWBAq28YKKrPtBbzSLfc0rGfIq1u5k8scB_tiREmjD9TM_pVyuiwbk1twLeVrA",
  isOnboarded: false,
  isBankConnected: false,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('save_nest_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('save_nest_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
