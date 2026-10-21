// src/components/apps/OrkutProfile/ProfileHeader.tsx
import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

type OrkutTab = 'home' | 'perfil' | 'comunidades';

interface ProfileHeaderProps {
  activeTab: OrkutTab;
  onTabChange: (tab: OrkutTab) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const TAB_IDS: OrkutTab[] = ['home', 'perfil', 'comunidades'];

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <div className="orkut-topbar">
      <div className="orkut-topbar-row">
        <img src="/assets/images/orkut.png" alt="Orkut" className="orkut-logo" />

        <nav className="orkut-tabs">
          {TAB_IDS.map((id) => (
            <button
              key={id}
              className={`orkut-tab ${activeTab === id ? 'orkut-tab--active' : ''}`}
              onClick={() => onTabChange(id)}
            >
              {t.orkut.tabs[id]}
            </button>
          ))}
        </nav>

        <form
          className="orkut-search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <input
            type="text"
            placeholder={t.orkut.searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="submit" aria-label={t.orkut.searchLabel}>🔍</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileHeader;
export type { OrkutTab };