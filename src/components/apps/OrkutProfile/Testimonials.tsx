// src/components/apps/OrkutProfile/Testimonials.tsx
import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const items = t.testimonials.items;

  return (
    <section className="testimonials">
      <div className="section-heading">
        <h4>{t.testimonials.title}</h4>
      </div>
      {items.length === 0 ? (
        <p className="empty-state">{t.testimonials.empty}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.author}>
              <p>&ldquo;{item.text}&rdquo;</p>
              <span>— {item.author}, {item.role}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Testimonials;
