// src/components/apps/OrkutProfile/FriendsGrid.tsx
import React from 'react';
import { useFriends } from '../../../hooks/useFriends';
import type { Friend } from '../../../types/friend';
import { useLanguage } from '../../../hooks/useLanguage';
import { getLocalizedField } from '../../../utils/getLocalizedField';

interface FriendCardProps {
  friend: Friend;
  roleTitle?: string;
}

// Card de um amigo. O React.memo evita re-render quando o componente pai atualiza por outros motivos (ex.: digitar na busca).
const FriendCard = React.memo(function FriendCard({ friend, roleTitle }: FriendCardProps) {
  return (
    <div className="friend-card" title={roleTitle}>
      <img src={friend.avatar_url ?? '/assets/images/icons/user-placeholder.png'} alt={friend.name} />
      <span>{friend.name}</span>
    </div>
  );
});

// Componente que exibe a seção de amigos no perfil do Orkut, incluindo título e grade de amigos.
const FriendsGrid: React.FC = () => {
  // Os amigos vêm do React Query (useFriends), que guarda o resultado em cache e cancela a busca se o componente sair da tela.
  const { data: friends = [] } = useFriends();
  const { language, t } = useLanguage();

  return (
    <section className="friends-section">
      <div className="section-heading">
        <h4>{t.friends.title}</h4>
      </div>
      <div className="friends-grid">
        {friends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} roleTitle={getLocalizedField(friend, 'role', language) || undefined} />
        ))}
      </div>
    </section>
  );
};

export default FriendsGrid;