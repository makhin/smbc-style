import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Section({ id, title, description, children }: SectionProps) {
  return (
    <section className="border-b-[length:var(--border-width-default)] border-border py-8" id={id}>
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h2>{title}</h2>
          {description && <p className="mt-1 max-w-[780px] text-fg-muted">{description}</p>}
        </div>
        <a className="inline-grid min-h-8 w-8 shrink-0 place-items-center text-xl text-fg-muted" href={`#${id}`} aria-label={`Link to ${title}`}>
          #
        </a>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
