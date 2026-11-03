import { ArrowRight, BarChart3, ChartPie, Tractor, Warehouse, Wheat, type LucideIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router';
import Barras from '../../components/ui/Barras';
import EmptyState from '../../components/ui/EmptyState';
import type { Rol } from '../../features/auth/models/Sesion';
import type { Campana } from '../../features/campanas/models/Campana';
import { etiquetaCampana, nombreCultivo, type Catalogos } from '../../features/campanas/utils/etiquetas';
import type { Resumen } from '../../features/campanas/utils/rendimiento';
import type { Cosecha } from '../../features/cosechas/models/Cosecha';
import { CATEGORIAS, categoria, type Insumo } from '../../features/insumos/models/Insumo';
import type { Labor } from '../../features/labores/models/Labor';
import { iconoLabor } from '../../shared/utils/iconos';
import { diasAtraso } from '../../shared/utils/resumenInicio';
import { formatCantidad, formatFecha } from '../../utils/formato';

export function Fila({ icono: Icono, children }: { icono: LucideIcon; children: ReactNode }) {
  return (
    <span className="fila">
      <span className="fila__icono"><Icono size={16} aria-hidden /></span>
      <span>{children}</span>
    </span>
  );
}

function Enlace({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="button-link" to={to}>{children}<ArrowRight size={16} aria-hidden /></Link>;
}

interface TarjetaLaboresProps {
  rol: Rol;
  labores: Labor[];
  campanas: Campana[];
  catalogos: Catalogos;
  hoy: string;
}

export function TarjetaLabores({ rol, labores, campanas, catalogos, hoy }: TarjetaLaboresProps) {
  const campana = (id: number) => campanas.find((item) => item.id === id);
  return (
    <article className="list-card">
      <h3><Tractor size={18} aria-hidden />{rol === 'OPERARIO' ? 'Mis próximas labores' : 'Próximas labores'}</h3>
      {labores.length === 0 ? (
        <EmptyState title="No hay labores pendientes." description="Cuando se planifiquen aparecerán aquí." />
      ) : (
        <ul>
          {labores.map((labor) => {
            const campanaLabor = campana(labor.campanaId);
            return (
              <li key={labor.id}>
                <Fila icono={iconoLabor(labor.tipo)}>
                  <strong>{labor.tipo.replace(/_/g, ' ')}</strong>
                  <br />
                  <small className="muted">
                    {campanaLabor ? etiquetaCampana(campanaLabor, catalogos) : `Campaña ${labor.campanaId}`}
                  </small>
                </Fila>
                <span>
                  {formatFecha(labor.fechaPlan)}
                  {diasAtraso(labor.fechaPlan, hoy) > 0 && (
                    <small className="celda-nota field-error">Atrasada · {diasAtraso(labor.fechaPlan, hoy)} días</small>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <Enlace to="/labores">{rol === 'OPERARIO' ? 'Ir a mis labores' : 'Ver labores'}</Enlace>
    </article>
  );
}

export function TarjetaStock({ insumos }: { insumos: Insumo[] }) {
  return (
    <article className="list-card">
      <h3><Warehouse size={18} aria-hidden />Por reponer</h3>
      {insumos.length === 0 ? (
        <EmptyState title="Nada por reponer." description="Los insumos con poco stock aparecerán aquí." />
      ) : (
        <ul>
          {insumos.map((insumo) => (
            <li key={insumo.id}>
              <Fila icono={categoria(insumo.categoria).icono}>{insumo.nombre}</Fila>
              <strong className={insumo.stockActual <= 0 ? 'field-error' : ''}>
                {formatCantidad(insumo.stockActual, insumo.unidadMedida)}
              </strong>
            </li>
          ))}
        </ul>
      )}
      <Enlace to="/insumos">Ver inventario</Enlace>
    </article>
  );
}

export function TarjetaCosechas({ cosechas, campanas, catalogos }: { cosechas: Cosecha[]; campanas: Campana[]; catalogos: Catalogos }) {
  const campana = (id: number) => campanas.find((item) => item.id === id);
  return (
    <article className="list-card">
      <h3><Wheat size={18} aria-hidden />Últimas cosechas</h3>
      {cosechas.length === 0 ? (
        <EmptyState title="No hay cosechas registradas." description="Las últimas aparecerán aquí." />
      ) : (
        <ul>
          {[...cosechas].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5).map((cosecha) => {
            const campanaCosecha = campana(cosecha.campanaId);
            return (
              <li key={cosecha.id}>
                <Fila icono={Wheat}>
                  {campanaCosecha ? etiquetaCampana(campanaCosecha, catalogos) : `Campaña ${cosecha.campanaId}`}
                  <br />
                  <small className="muted">{formatFecha(cosecha.fecha)}</small>
                </Fila>
                <strong>{formatCantidad(cosecha.cantidad, cosecha.unidadMedida)}</strong>
              </li>
            );
          })}
        </ul>
      )}
      <Enlace to="/cosechas">Ver cosechas</Enlace>
    </article>
  );
}

interface TarjetaAvanceProps {
  rol: Rol;
  avance: number;
  labores: Labor[];
}

export function TarjetaAvance({ rol, avance, labores }: TarjetaAvanceProps) {
  const contarLabores = (estado: Labor['estado']) => labores.filter((labor) => labor.estado === estado).length;
  return (
    <article className="list-card">
      <h3><ChartPie size={18} aria-hidden />{rol === 'OPERARIO' ? 'Mi avance' : 'Avance de labores'}</h3>
      {labores.length === 0 ? (
        <EmptyState title="Aún no hay labores." description="El avance se calcula con las labores ejecutadas." />
      ) : (
        <div className="avance-anillo">
          <div
            className="avance-anillo__circulo"
            role="img"
            aria-label={`${avance} % de labores ejecutadas`}
            style={{ '--avance': `${avance}%` } as CSSProperties}
          >
            <strong>{avance} %</strong>
          </div>
          <ul>
            <li><span>Planificadas</span><strong>{contarLabores('PLANIFICADA')}</strong></li>
            <li><span>En curso</span><strong>{contarLabores('EN_CURSO')}</strong></li>
            <li><span>Ejecutadas</span><strong>{contarLabores('EJECUTADA')}</strong></li>
          </ul>
        </div>
      )}
    </article>
  );
}

export function TarjetaCategorias({ insumos }: { insumos: Insumo[] }) {
  return (
    <article className="list-card">
      <h3><ChartPie size={18} aria-hidden />Inventario por categoría</h3>
      <ul>
        {CATEGORIAS.map((c) => (
          <li key={c.valor}>
            <Fila icono={c.icono}>{c.nombre}</Fila>
            <strong>{insumos.filter((insumo) => insumo.categoria === c.valor).length}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function TarjetaProduccion({ produccion, catalogos }: { produccion: Resumen<number>[]; catalogos: Catalogos }) {
  const filas = (valor: (fila: Resumen<number>) => number, texto: (fila: Resumen<number>) => string) =>
    [...produccion]
      .sort((a, b) => valor(b) - valor(a))
      .map((fila) => ({ clave: fila.clave, etiqueta: nombreCultivo(fila.clave, catalogos), valor: valor(fila), texto: texto(fila) }));
  return (
    <article className="list-card">
      <h3><BarChart3 size={18} aria-hidden />Producción por cultivo</h3>
      {produccion.length === 0 ? (
        <EmptyState title="Todavía no hay cosecha." description="Aquí se comparará lo cosechado por cultivo." />
      ) : (
        <>
          <p className="barras__titulo">Cosecha neta (t)</p>
          <Barras nombre="Cosecha neta por cultivo" filas={filas((fila) => fila.toneladas, (fila) => formatCantidad(fila.toneladas, 't'))} />
          <p className="barras__titulo">Rendimiento (t/ha)</p>
          <Barras nombre="Rendimiento por cultivo" filas={filas((fila) => fila.rendimiento, (fila) => `${fila.rendimiento.toFixed(2).replace('.', ',')} t/ha`)} />
        </>
      )}
    </article>
  );
}
