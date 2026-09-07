import { Card } from '@/components/molecules/card';
import { Kicker } from '@/components/molecules/kicker';
import { cn } from '@/lib/utils';

export interface DistrictMetricCardsProps {
  tehsilCount: number;
  boundaryStatus: 'Not available' | 'Placeholder' | 'Surveyed';
  activeAlertCount: number;
  headquarters: string;
}

export function DistrictMetricCards({ tehsilCount, boundaryStatus, activeAlertCount, headquarters }: DistrictMetricCardsProps) {
  const cards: ReadonlyArray<{ label: string; value: string; tone: string }> = [
    { label: 'Tehsils', value: String(tehsilCount), tone: 'text-forest' },
    { label: 'Boundary', value: boundaryStatus, tone: 'text-forest' },
    { label: 'Active alerts', value: String(activeAlertCount), tone: activeAlertCount > 0 ? 'text-alert-critical' : 'text-forest' },
    { label: 'Headquarters', value: headquarters, tone: 'text-forest' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-4">
          <Kicker>{card.label}</Kicker>
          <p className={cn('font-display mt-1 truncate text-2xl leading-tight font-semibold', card.tone)} title={card.value}>
            {card.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
