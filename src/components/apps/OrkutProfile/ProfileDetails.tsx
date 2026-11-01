// src/components/apps/OrkutProfile/ProfileDetails.tsx
import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../../../services/profileService';
import type { ProfileData } from '../../../types/profile';
import type { Language } from '../../../types/language';
import { useLanguage } from '../../../hooks/useLanguage';
import { getLocalizedField } from '../../../utils/getLocalizedField';
import {
  useEducation,
  useLanguageSkills,
  useCertifications,
  useExperience,
  usePublications,
} from '../../../hooks/useAcademicInfo';

// Mensagem exibida no lugar de uma seção que não carregou (API fora do ar ou sem conexão), por idioma.
const LOAD_ERROR_TEXT: Record<Language, string> = {
  pt: 'Não foi possível carregar esta seção agora. Tente novamente mais tarde.',
  en: "Couldn't load this section right now. Please try again later.",
  es: 'No se pudo cargar esta sección ahora. Inténtalo de nuevo más tarde.',
};

const ProfileDetails: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { t, tc, language } = useLanguage();
  const d = t.profileDetails;
  const errorText = LOAD_ERROR_TEXT[language];

  const { data: education = [], isLoading: loadingEducation, isError: errorEducation } = useEducation();
  const { data: languageSkills = [], isLoading: loadingLanguages, isError: errorLanguages } = useLanguageSkills();
  const { data: certifications = [], isLoading: loadingCertifications, isError: errorCertifications } = useCertifications();
  const { data: experience = [], isLoading: loadingExperience, isError: errorExperience } = useExperience();
  const { data: publications = [], isLoading: loadingPublications, isError: errorPublications } = usePublications();

  useEffect(() => {
    let mounted = true;
    fetchProfile().then((data) => {
      if (mounted) {
        setProfile(data);
        setLoadingProfile(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="orkut-col orkut-col-center profile-details">
        <h3 className="welcome-msg">{d.aboutTitle}</h3>
        {loadingProfile ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : profile ? (
          <p>{tc(profile.about_me)}</p>
        ) : (
          <p className="empty-state" role="alert">{errorText}</p>
        )}
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
        ) : errorEducation ? (
          <p className="empty-state" role="alert">{errorText}</p>
        ) : (
          <ul className="quick-links">
            {education.map((item) => (
              <li key={item.id}>{getLocalizedField(item, 'course', language)}</li>
            ))}
          </ul>
        )}

        <div className="section-heading"><h4>{d.languagesTitle}</h4></div>
        {loadingLanguages ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : errorLanguages ? (
          <p className="empty-state" role="alert">{errorText}</p>
        ) : (
          <ul className="quick-links">
            {languageSkills.map((item) => (
              <li key={item.id}>{getLocalizedField(item, 'language', language)}</li>
            ))}
          </ul>
        )}

        <div className="section-heading"><h4>{d.exchangeTitle}</h4></div>
        <p>{d.exchange}</p>

        <div className="section-heading"><h4>{d.certificationsTitle}</h4></div>
        {loadingCertifications ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : errorCertifications ? (
          <p className="empty-state" role="alert">{errorText}</p>
        ) : (
          <ul className="quick-links">
            {certifications.map((item) => (
              <li key={item.id}>{getLocalizedField(item, 'title', language)}</li>
            ))}
          </ul>
        )}

        <div className="section-heading"><h4>{d.experienceTitle}</h4></div>
        {loadingExperience ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : errorExperience ? (
          <p className="empty-state" role="alert">{errorText}</p>
        ) : (
          <ul className="quick-links">
            {experience.map((item) => {
              const title = getLocalizedField(item, 'title', language);
              const period = getLocalizedField(item, 'period', language);
              const description = getLocalizedField(item, 'description', language);

              return (
                <li key={item.id}>
                  <strong>{title}</strong> ({period}): {description}
                </li>
              );
            })}
          </ul>
        )}

        <div className="section-heading"><h4>{d.publicationTitle}</h4></div>
        {loadingPublications ? (
          <div className="loading-spinner">{t.orkut.loading}</div>
        ) : errorPublications ? (
          <p className="empty-state" role="alert">{errorText}</p>
        ) : (
          publications.map((item) => (
            <p key={item.id}>
              {item.authors} ({item.year}). <em>{getLocalizedField(item, 'title', language)}.</em> {item.venue}. DOI:{' '}
              <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noreferrer">
                {item.doi}
              </a>
            </p>
          ))
        )}
    </div>
  );
};

export default ProfileDetails;