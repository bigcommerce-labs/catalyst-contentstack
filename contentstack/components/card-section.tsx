import React from 'react';

import { Link } from '~/components/link';
import { Button } from '~/components/ui/button';
import { CallToAction } from '~/contentstack/types';

interface Card {
  card_title_h3: string;
  description: string;
  call_to_action: CallToAction;
}

interface CardProps {
  cards: [Card];
}

export default function CardSection({ cards }: CardProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-8 bg-neutral-100 p-16">
      {cards.map((card, index) => (
        <div
          className="border-rounded flex w-96 flex-col border border-neutral-200 bg-white p-6"
          key={index}
        >
          {card.card_title_h3 ? (
            <h3 className="mb-4 text-2xl font-bold">{card.card_title_h3}</h3>
          ) : (
            ''
          )}
          {card.description ? <p className="grow">{card.description}</p> : ''}
          {card.call_to_action.title && card.call_to_action.href ? (
            <div className="mt-4">
              <Link href={card.call_to_action.href}>
                <Button variant="primary">{card.call_to_action.title}</Button>
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
}
