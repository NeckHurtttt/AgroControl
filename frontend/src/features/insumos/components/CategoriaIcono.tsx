import { categoria, type CategoriaInsumo } from '../models/Insumo';

interface CategoriaIconoProps {
  valor: CategoriaInsumo;
  // Con texto muestra "ícono + nombre"; sin texto, solo el ícono (con su nombre para lectores de pantalla)
  conNombre?: boolean;
}

export default function CategoriaIcono({ valor, conNombre = false }: CategoriaIconoProps) {
  const { icono: Icono, nombre } = categoria(valor);
  return (
    <span className="icono-texto">
      <Icono size={16} strokeWidth={2} aria-hidden={conNombre} aria-label={conNombre ? undefined : nombre} />
      {conNombre && nombre}
    </span>
  );
}
