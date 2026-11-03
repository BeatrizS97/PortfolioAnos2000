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

// Dados da seção "Contato" (também usados pela busca).
const CONTACT_EMAIL = 'beatriz.santos.ads97@gmail.com';
const CONTACT_LINKEDIN = 'beatrizsilvasantos-dev';
const CONTACT_GITHUB = 'BeatrizS97';

interface ProfileDetailsProps {
  searchTerm?: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ searchTerm = '' }) => {
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

  // Confere se algum dos textos contém o que foi buscado (sem busca, tudo "combina").
  const matches = (...texts: string[]) => texts.join(' ').toLowerCase().includes(searchTerm);

  // Itens que combinam com a busca. Se o título da seção combinar, a seção inteira aparece.
  const shownEducation = education.filter((item) =>
    matches(d.educationTitle, getLocalizedField(item, 'course', language))
  );
  const shownLanguages = languageSkills.filter((item) =>
    matches(d.languagesTitle, getLocalizedField(item, 'language', language))
  );
  const shownCertifications = certifications.filter((item) =>
    matches(d.certificationsTitle, getLocalizedField(item, 'title', language))
  );
  const shownExperience = experience.filter((item) =>
    matches(
      d.experienceTitle,
      getLocalizedField(item, 'title', language),
      getLocalizedField(item, 'period', language),
      getLocalizedField(item, 'description', language)
    )
  );
  const shownPublications = publications.filter((item) =>
    matches(
      d.publicationTitle,
      item.authors,
      String(item.year),
      getLocalizedField(item, 'title', language),
      item.venue,
      item.doi
    )
  );

  // Quais seções aparecem. Durante a busca, as seções sem resultado ficam escondidas.
  const searching = searchTerm !== '';
  const showAbout = matches(d.aboutTitle, profile ? tc(profile.about_me) : '', d.aboutExtra);
  const showContact = matches(d.contactTitle, d.emailLabel, CONTACT_EMAIL, 'LinkedIn', CONTACT_LINKEDIN, 'GitHub', CONTACT_GITHUB);
  const showEducation = !searching || shownEducation.length > 0;
  const showLanguages = !searching || shownLanguages.length > 0;
  const showExchange = matches(d.exchangeTitle, d.exchange);
  const showCertifications = !searching || shownCertifications.length > 0;
  const showExperience = !searching || shownExperience.length > 0;
  const showPublications = !searching || shownPublications.length > 0;
  const hasResults =
    showAbout || showContact || showEducation || showLanguages || showExchange || showCertifications || showExperience || showPublications;

  return (
    <div className="orkut-col orkut-col-center profile-details">
        {!hasResults && <p className="empty-state">{t.orkut.noResults}</p>}

        {showAbout && (
          <>
            <h3 className="welcome-msg">{d.aboutTitle}</h3>
            {loadingProfile ? (
              <div className="loading-spinner">{t.orkut.loading}</div>
            ) : profile ? (
              <p>{tc(profile.about_me)}</p>
            ) : (
              <p className="empty-state" role="alert">{errorText}</p>
            )}
            <p>{d.aboutExtra}</p>
          </>
        )}

        {showContact && (
          <>
            <div className="section-heading"><h4>{d.contactTitle}</h4></div>
            <ul className="quick-links">
              <li>{d.emailLabel}: {CONTACT_EMAIL}</li>
              <li>LinkedIn: <a href={`https://www.linkedin.com/in/${CONTACT_LINKEDIN}`} target="_blank" rel="noreferrer">{CONTACT_LINKEDIN}</a></li>
              <li>GitHub: <a href={`https://github.com/${CONTACT_GITHUB}`} target="_blank" rel="noreferrer">@{CONTACT_GITHUB}</a></li>
            </ul>
          </>
        )}

        {showEducation && (
          <>
            <div className="section-heading"><h4>{d.educationTitle}</h4></div>
            {loadingEducation ? (
              <div className="loading-spinner">{t.orkut.loading}</div>
            ) : errorEducation ? (
              <p className="empty-state" role="alert">{errorText}</p>
            ) : (
              <ul className="quick-links">
                {shownEducation.map((item) => (
                  <li key={item.id}>{getLocalizedField(item, 'course', language)}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {showLanguages && (
          <>
            <div className="section-heading"><h4>{d.languagesTitle}</h4></div>
            {loadingLanguages ? (
              <div className="loading-spinner">{t.orkut.loading}</div>
            ) : errorLanguages ? (
              <p className="empty-state" role="alert">{errorText}</p>
            ) : (
              <ul className="quick-links">
                {shownLanguages.map((item) => (
                  <li key={item.id}>{getLocalizedField(item, 'language', language)}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {showExchange && (
          <>
            <div className="section-heading"><h4>{d.exchangeTitle}</h4></div>
            <p>{d.exchange}</p>
          </>
        )}

        {showCertifications && (
          <>
            <div className="section-heading"><h4>{d.certificationsTitle}</h4></div>
            {loadingCertifications ? (
              <div className="loading-spinner">{t.orkut.loading}</div>
            ) : errorCertifications ? (
              <p className="empty-state" role="alert">{errorText}</p>
            ) : (
              <ul className="quick-links">
                {shownCertifications.map((item) => (
                  <li key={item.id}>{getLocalizedField(item, 'title', language)}</li>
                ))}
              </ul>
            )}
          </>
        )}

        {showExperience && (
          <>
            <div className="section-heading"><h4>{d.experienceTitle}</h4></div>
            {loadingExperience ? (
              <div className="loading-spinner">{t.orkut.loading}</div>
            ) : errorExperience ? (
              <p className="empty-state" role="alert">{errorText}</p>
            ) : (
              <ul className="quick-links">
                {shownExperience.map((item) => {
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
          </>
        )}

        {showPublications && (
          <>
            <div className="section-heading"><h4>{d.publicationTitle}</h4></div>
            {loadingPublications ? (
              <div className="loading-spinner">{t.orkut.loading}</div>
            ) : errorPublications ? (
              <p className="empty-state" role="alert">{errorText}</p>
            ) : (
              shownPublications.map((item) => (
                <p key={item.id}>
                  {item.authors} ({item.year}). <em>{getLocalizedField(item, 'title', language)}.</em> {item.venue}. DOI:{' '}
                  <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noreferrer">
                    {item.doi}
                  </a>
                </p>
              ))
            )}
          </>
        )}
    </div>
  );
};

export default ProfileDetails;