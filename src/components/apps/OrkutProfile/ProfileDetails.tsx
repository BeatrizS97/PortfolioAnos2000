// src/components/apps/OrkutProfile/ProfileDetails.tsx
import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { getLocalizedField } from '../../../utils/getLocalizedField';
import { useProfile } from '../../../hooks/useProfile';
import ProfileSection from './ProfileSection';
import {
  useEducation,
  useLanguageSkills,
  useCertifications,
  useExperience,
  useExchange,
  usePublications,
} from '../../../hooks/useAcademicInfo';

// Pega o último trecho de um link (ex.: ".../in/beatrizsilvasantos-dev" vira "beatrizsilvasantos-dev"),
// usado como nome exibido do LinkedIn e do GitHub (os links completos vêm do banco).
function getLastPathSegment(url: string): string {
  return url.split('/').filter(Boolean).pop() ?? url;
}

interface ProfileDetailsProps {
  searchTerm?: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ searchTerm = '' }) => {
  const { t, language } = useLanguage();
  const d = t.profileDetails;
  // Mensagem exibida no lugar de uma seção que não carregou (API fora do ar ou sem conexão): d.loadError.
  const errorText = d.loadError;

  // O perfil vem do React Query (useProfile), como as seções abaixo. Sem perfil (API fora do ar), "profile" fica null.
  const { data: profile = null, isLoading: loadingProfile } = useProfile();
  const { data: education = [], isLoading: loadingEducation, isError: errorEducation } = useEducation();
  const { data: languageSkills = [], isLoading: loadingLanguages, isError: errorLanguages } = useLanguageSkills();
  const { data: certifications = [], isLoading: loadingCertifications, isError: errorCertifications } = useCertifications();
  const { data: experience = [], isLoading: loadingExperience, isError: errorExperience } = useExperience();
  const { data: exchange = [], isLoading: loadingExchange, isError: errorExchange } = useExchange();
  const { data: publications = [], isLoading: loadingPublications, isError: errorPublications } = usePublications();

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
  const shownExchange = exchange.filter((item) =>
    matches(d.exchangeTitle, getLocalizedField(item, 'description', language))
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

  // Parágrafos que vêm depois do "sobre mim" (também vêm do banco, na tabela profile). Vazios se o perfil não carregou.
  const aboutHubConnect = profile ? getLocalizedField(profile, 'about_hub_connect', language) : '';
  const aboutExtra = profile ? getLocalizedField(profile, 'about_extra', language) : '';

  // Quais seções aparecem. Durante a busca, as seções sem resultado ficam escondidas.
  // O contato (e-mail, LinkedIn e GitHub) vem do perfil: sem perfil carregado, a seção não aparece.
  const searching = searchTerm !== '';
  const showAbout = matches(d.aboutTitle, profile ? getLocalizedField(profile, 'about_me', language) : '', aboutHubConnect, aboutExtra);
  const showContact =
    profile !== null &&
    matches(d.contactTitle, d.emailLabel, profile.email ?? '', 'LinkedIn', profile.linkedin_url ?? '', 'GitHub', profile.github_url ?? '');
  const showEducation = !searching || shownEducation.length > 0;
  const showLanguages = !searching || shownLanguages.length > 0;
  const showExchange = !searching || shownExchange.length > 0;
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
              <p>{getLocalizedField(profile, 'about_me', language)}</p>
            ) : (
              <p className="empty-state" role="alert">{errorText}</p>
            )}
            {aboutHubConnect && <p>{aboutHubConnect}</p>}
            {aboutExtra && <p>{aboutExtra}</p>}
          </>
        )}

        {showContact && profile && (
          <>
            <div className="section-heading"><h4>{d.contactTitle}</h4></div>
            <ul className="quick-links">
              {profile.email && <li>{d.emailLabel}: {profile.email}</li>}
              {profile.linkedin_url && (
                <li>LinkedIn: <a href={profile.linkedin_url} target="_blank" rel="noreferrer">{getLastPathSegment(profile.linkedin_url)}</a></li>
              )}
              {profile.github_url && (
                <li>GitHub: <a href={profile.github_url} target="_blank" rel="noreferrer">@{getLastPathSegment(profile.github_url)}</a></li>
              )}
            </ul>
          </>
        )}

        {showEducation && (
          <ProfileSection title={d.educationTitle} isLoading={loadingEducation} isError={errorEducation}>
            <ul className="quick-links">
              {shownEducation.map((item) => (
                <li key={item.id}>{getLocalizedField(item, 'course', language)}</li>
              ))}
            </ul>
          </ProfileSection>
        )}

        {showLanguages && (
          <ProfileSection title={d.languagesTitle} isLoading={loadingLanguages} isError={errorLanguages}>
            <ul className="quick-links">
              {shownLanguages.map((item) => (
                <li key={item.id}>{getLocalizedField(item, 'language', language)}</li>
              ))}
            </ul>
          </ProfileSection>
        )}

        {showExchange && (
          <ProfileSection title={d.exchangeTitle} isLoading={loadingExchange} isError={errorExchange}>
            {shownExchange.map((item) => (
              <p key={item.id}>{getLocalizedField(item, 'description', language)}</p>
            ))}
          </ProfileSection>
        )}

        {showCertifications && (
          <ProfileSection title={d.certificationsTitle} isLoading={loadingCertifications} isError={errorCertifications}>
            <ul className="quick-links">
              {shownCertifications.map((item) => (
                <li key={item.id}>{getLocalizedField(item, 'title', language)}</li>
              ))}
            </ul>
          </ProfileSection>
        )}

        {showExperience && (
          <ProfileSection title={d.experienceTitle} isLoading={loadingExperience} isError={errorExperience}>
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
          </ProfileSection>
        )}

        {showPublications && (
          <ProfileSection title={d.publicationTitle} isLoading={loadingPublications} isError={errorPublications}>
            {shownPublications.map((item) => (
              <p key={item.id}>
                {item.authors} ({item.year}). <em>{getLocalizedField(item, 'title', language)}.</em> {item.venue}. DOI:{' '}
                <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noreferrer">
                  {item.doi}
                </a>
              </p>
            ))}
          </ProfileSection>
        )}
    </div>
  );
};

export default ProfileDetails;
