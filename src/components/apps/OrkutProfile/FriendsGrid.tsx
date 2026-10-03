// src/components/apps/OrkutProfile/FriendsGrid.tsx
import React, { useEffect, useState } from 'react';
import { fetchFriends } from '../../../services/friendsService';
import type { Friend } from '../../../types/friend';
import { useLanguage } from '../../../hooks/useLanguage';

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
          <div key={friend.id} className="friend-card" title={friend.role ? tc(friend.role) : undefined}>
            <img src={friend.avatar_url} alt={friend.name} />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FriendsGrid;
