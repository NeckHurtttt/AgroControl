import type { ReactNode } from 'react';

export interface FilaBarra {
  clave: string | number;
  etiqueta: ReactNode;
  valor: number;
  texto: string;
}

// Barras horizontales de una sola serie. Es una lista con el valor escrito en cada fila:
// se lee igual sin ver la barra y no necesita leyenda ni librería.
export default function Barras({ filas, nombre }: { filas: FilaBarra[]; nombre: string }) {
  const maximo = Math.max(...filas.map((fila) => fila.valor), 0);
  return (
    <ul className="barras" aria-label={nombre}>
      {filas.map((fila) => (
        <li key={fila.clave} className="barras__fila">
          <span className="barras__etiqueta">{fila.etiqueta}</span>
          <span className="barras__pista" aria-hidden>
            <span className="barras__marca" style={{ width: `${maximo > 0 ? (fila.valor / maximo) * 100 : 0}%` }} />
          </span>
          <strong className="barras__valor">{fila.texto}</strong>
        </li>
      ))}
    </ul>
  );
}
