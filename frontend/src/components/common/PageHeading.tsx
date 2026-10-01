import type { ReactNode } from 'react';

interface PageHeadingProps {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  accion?: ReactNode;
}

export default function PageHeading({ eyebrow, titulo, descripcion, accion }: PageHeadingProps) {
  return (
    <div className="page-heading page-heading--actions">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{titulo}</h1>
        <p>{descripcion}</p>
      </div>
      {accion}
    </div>
  );
}
