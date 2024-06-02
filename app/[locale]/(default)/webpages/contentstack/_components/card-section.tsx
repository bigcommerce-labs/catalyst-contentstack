import React from 'react';

import { Link } from '~/components/link';
import { CallToAction } from '~/contentstack/types';

interface Card {
  title_h3: string;
  description: string;
  call_to_action: CallToAction;
}

interface CardProps {
  cards: [Card];
}

export default function CardSection({ cards }: CardProps) {
  return (
    <div className="demo-section">
      {cards.map((card, index) => (
        <div className="cards" key={index}>
          {card.title_h3 ? <h3>{card.title_h3}</h3> : ''}
          {card.description ? <p>{card.description}</p> : ''}
          <div className="card-cta">
            {card.call_to_action.title && card.call_to_action.href ? (
              <Link className="btn primary-btn" href={card.call_to_action.href}>
                {card.call_to_action.title}
              </Link>
            ) : (
              ''
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
