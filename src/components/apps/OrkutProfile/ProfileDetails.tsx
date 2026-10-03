// src/components/apps/OrkutProfile/ProfileDetails.tsx
import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../../../services/profileService';
import type { ProfileData } from '../../../types/profile';
import { useLanguage } from '../../../hooks/useLanguage';
import {
  useEducation,
  useLanguageSkills,
  useCertifications,
  useExperience,
} from '../../../hooks/useAcademicInfo';

const ProfileDetails: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { t, tc, language } = useLanguage();
  const d = t.profileDetails;

  const { data: education = [], isLoading: loadingEducation } = useEducation();
  const { data: languageSkills = [], isLoading: loadingLanguages } = useLanguageSkills();
  const { data: certifications = [], isLoading: loadingCertifications } = useCertifications();
  const { data: experience = [], isLoading: loadingExperience } = useExperience();

  useEffect(() => {
    let mounted = true;
    fetchProfile().then((data) => {
      if (mounted) setProfile(data);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="orkut-columns" style={{ gridTemplateColumns: '1fr' }}>
      <div className="orkut-col-center profile-details">
        <h3 className="welcome-msg">{d.aboutTitle}</h3>
        {profile ? <p>{tc(profile.about_me)}</p> : <div className="loading-spinner">{t.orkut.loading}</div>}
        <p>{d.aboutExtra}</p>

        <div className="section-heading"><h4>{d.contactTitle}</h4></div>
        <ul className="quick-links">
          <li>{d.emailLabel}: beatriz.santos.ads97@gmail.com</li>
          <li>LinkedIn: <a href="https://www.linkedin.com/in/beatrizsilvasantos-dev" target="_blank" rel="noreferrer">beatrizsilvasantos-dev</a></li>
          <li>GitHub: <a href="https://github.com/BeatrizS97" target="_blank" rel="noreferrer">@BeatrizS97</a></li>
        </ul>

        <div className="section-heading"><h4>{d.educationTitle}</h4></div>
        {loadingEducation ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : (
          <ul className="quick-links">
            {education.map((item) => (
              <li key={item.id}>
                {language === 'en'
                  ? item.course_en || item.course_pt
                  : language === 'es'
                    ? item.course_es || item.course_pt
                    : item.course_pt}
              </li>
            ))}
          </ul>
        )}

        <div className="section-heading"><h4>{d.languagesTitle}</h4></div>
        {loadingLanguages ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : (
          <ul className="quick-links">
            {languageSkills.map((item) => (
              <li key={item.id}>
                {language === 'en'
                  ? item.language_en || item.language_pt
                  : language === 'es'
                    ? item.language_es || item.language_pt
                    : item.language_pt}
              </li>
            ))}
          </ul>
        )}

        <div className="section-heading"><h4>{d.exchangeTitle}</h4></div>
        <p>{d.exchange}</p>

        <div className="section-heading"><h4>{d.certificationsTitle}</h4></div>
        {loadingCertifications ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : (
          <ul className="quick-links">
            {certifications.map((item) => (
              <li key={item.id}>
                {language === 'en'
                  ? item.title_en || item.title_pt
                  : language === 'es'
                    ? item.title_es || item.title_pt
                    : item.title_pt}
              </li>
            ))}
          </ul>
        )}

        <div className="section-heading"><h4>{d.experienceTitle}</h4></div>
        {loadingExperience ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : (
          <ul className="quick-links">
            {experience.map((item) => {
              const title =
                language === 'en' ? item.title_en || item.title_pt
                : language === 'es' ? item.title_es || item.title_pt
                : item.title_pt;
              const period =
                language === 'en' ? item.period_en || item.period_pt
                : language === 'es' ? item.period_es || item.period_pt
                : item.period_pt;
              const description =
                language === 'en' ? item.description_en || item.description_pt
                : language === 'es' ? item.description_es || item.description_pt
                : item.description_pt;

              return (
                <li key={item.id}>
                  <strong>{title}</strong> ({period}): {description}
                </li>
              );
            })}
          </ul>
        )}

        <div className="section-heading"><h4>{d.publicationTitle}</h4></div>
        <p>
          Santos, B. S. et al. (2025). <em>Inovação tecnológica e a inclusão
          escolar: o caminho para a equidade.</em> Revista Processando o Saber –
          FATEC PG. DOI:{' '}
          <a href="https://doi.org/10.5281/zenodo.15477654" target="_blank" rel="noreferrer">
            10.5281/zenodo.15477654
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProfileDetails;