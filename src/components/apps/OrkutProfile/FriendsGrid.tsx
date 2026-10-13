// src/components/apps/OrkutProfile/FriendsGrid.tsx
import React, { useEffect, useState } from 'react';
import { fetchFriends } from '../../../services/friendsService';
import type { Friend } from '../../../types/friend';
import { useLanguage } from '../../../hooks/useLanguage';

interface FriendCardProps {
  friend: Friend;
  roleTitle?: string;
}

// Card de um amigo. O React.memo evita re-render quando o componente pai atualiza por outros motivos (ex.: digitar na busca).
const FriendCard = React.memo(function FriendCard({ friend, roleTitle }: FriendCardProps) {
  return (
    <div className="friend-card" title={roleTitle}>
      <img src={friend.avatar_url} alt={friend.name} />
      <span>{friend.name}</span>
    </div>
  );
});

// Componente que exibe a seção de amigos no perfil do Orkut, incluindo título, link "ver todos" e grade de amigos.
const FriendsGrid: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { t, tc } = useLanguage();

  // Efeito colateral que busca os amigos do serviço ao montar o componente.
  useEffect(() => {
    let mounted = true;
    fetchFriends().then((data) => {
      if (mounted) setFriends(data);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="friends-section">
      <div className="section-heading">
        <h4>{t.friends.title}</h4>
        <a href="#" className="see-all-link" onClick={(e) => e.preventDefault()}>{t.friends.seeAll}</a>
      </div>
      <div className="friends-grid">
        {friends.map((friend) => (
          <FriendCard key={friend.id} friend={friend} roleTitle={friend.role ? tc(friend.role) : undefined} />
        ))}
      </div>
    </section>
  );
};

export default FriendsGrid;