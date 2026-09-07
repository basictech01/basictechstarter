import { LiveClock } from './live-clock';

export interface PageHeaderProps {
  title: string;
  titleHi?: string;
  description?: string;
}

/** The sticky title banner shared by every dashboard route. */
export function PageHeader({ title, titleHi, description }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-start justify-between gap-4 border-b border-border bg-bg-light/90 px-6 py-4 backdrop-blur-sm md:px-8">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold text-text-dark">{title}</h1>
        {titleHi && <p className="font-display text-sm text-text-dark/55">{titleHi}</p>}
        {description && <p className="mt-1 text-sm text-text-dark/60">{description}</p>}
      </div>
      <LiveClock />
    </header>
  );
}
