import { CalendarDays, Sprout } from 'lucide-react';
import { Fragment, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import StatsGrid from '../components/common/StatsGrid';
import { useAuth } from '../features/auth/context/useAuth';
import type { Rol } from '../features/auth/models/Sesion';
import { NOMBRE_ROL, type Seccion } from '../features/auth/permisos';
import type { Catalogos } from '../features/campanas/utils/etiquetas';
import { resumenPor } from '../features/campanas/utils/rendimiento';
import { useCarga } from '../hooks/useCarga';
import { campanaAbierta, laborPendiente, sinAnulados } from '../shared/utils/estados';
import { ICONO_SECCION } from '../shared/utils/iconos';
import { cosechasPorVenir, incidenciasGraves, insumosPorReponer, laboresAtrasadas, siembrasAtrasadas } from '../shared/utils/resumenInicio';
import { formatArea } from '../utils/area';
import { formatCantidad, hoyISO } from '../utils/formato';
import { AvisosInicio } from './inicio/Avisos';
import { construirAvisos } from './inicio/construirAvisos';
import { cargarResumen, vacio } from './inicio/cargarResumen';
import { TarjetaAvance, TarjetaCategorias, TarjetaCosechas, TarjetaLabores, TarjetaProduccion, TarjetaStock } from './inicio/Tarjetas';

const SALUDO: Record<Rol, string> = {
  ADMINISTRADOR: 'Configuración general: usuarios, predios, parcelas y el estado de toda la operación.',
  JEFE_DE_CAMPO: 'Planificación: campañas abiertas, labores por asignar y avance en el campo.',
  OPERARIO: 'Su agenda de campo: las labores que tiene asignadas.',
  ALMACENERO: 'Inventario: stock de insumos y cosechas registradas.',
  SUPERVISOR: 'Indicadores de la operación: avance de campañas, labores y producción.',
};

const ACCESOS: { seccion: Exclude<Seccion, 'inicio'>; nombre: string; detalle: string }[] = [
  { seccion: 'predios', nombre: 'Predios', detalle: 'Campos y ubicaciones' },
  { seccion: 'parcelas', nombre: 'Parcelas', detalle: 'Lotes y superficies' },
  { seccion: 'cultivos', nombre: 'Cultivos', detalle: 'Catálogo de cultivos' },
  { seccion: 'campanas', nombre: 'Campañas', detalle: 'Planificación por temporada' },
  { seccion: 'labores', nombre: 'Labores', detalle: 'Trabajo en el campo' },
  { seccion: 'insumos', nombre: 'Insumos', detalle: 'Inventario y movimientos' },
  { seccion: 'cosechas', nombre: 'Cosechas', detalle: 'Producción registrada' },
  { seccion: 'incidencias', nombre: 'Incidencias', detalle: 'Problemas reportados' },
  { seccion: 'usuarios', nombre: 'Usuarios', detalle: 'Cuentas y roles' },
  { seccion: 'auditoria', nombre: 'Auditoría', detalle: 'Historial de cambios' },
];

const fechaDeHoy = () =>
  new Date().toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export default function DashboardPage() {
  const { sesion, puedeVer } = useAuth();
  const rol = sesion?.rol ?? 'SUPERVISOR';
  const { datos, loading, error } = useCarga(cargarResumen(rol), vacio, rol, 'inicio');
  const { predios, parcelas, cultivos, campanas, labores, insumos, usuarios, asignaciones, incidencias } = datos;
  const cosechas = sinAnulados(datos.cosechas);
  const catalogos: Catalogos = { predios, parcelas, cultivos };

  const areaTotal = parcelas.reduce((suma, parcela) => suma + (parcela.areaHa ?? 0), 0);
  const campanasAbiertas = campanas.filter(campanaAbierta);
  const pendientes = labores.filter(laborPendiente);
  const proximasLabores = [...pendientes].sort((a, b) => a.fechaPlan.localeCompare(b.fechaPlan)).slice(0, 5);
  const sinAsignar = pendientes.filter((labor) => !asignaciones.some((a) => a.laborId === labor.id)).length;
  const insumosSinStock = insumos.filter((insumo) => insumo.stockActual <= 0).length;
  const porReponer = insumosPorReponer(insumos).slice(0, 5);
  const hoy = hoyISO();
  const atrasadas = siembrasAtrasadas(campanas, hoy);
  const toneladas = cosechas.reduce((suma, c) => suma + c.toneladas, 0);
  const avance = labores.length === 0 ? 0 : Math.round(((labores.length - pendientes.length) / labores.length) * 100);
  const [fechaLarga] = useState(fechaDeHoy);

  const stats: Record<Rol, { etiqueta: string; valor: string | number }[]> = {
    ADMINISTRADOR: [
      { etiqueta: 'Usuarios activos', valor: usuarios.filter((u) => u.estado === 'ACTIVO').length },
      { etiqueta: 'Predios activos', valor: predios.filter((predio) => predio.activo).length },
      { etiqueta: `Parcelas (${formatArea(areaTotal)})`, valor: parcelas.length },
      { etiqueta: 'Campañas abiertas', valor: campanasAbiertas.length },
      { etiqueta: 'Siembras atrasadas', valor: atrasadas },
    ],
    JEFE_DE_CAMPO: [
      { etiqueta: 'Campañas abiertas', valor: campanasAbiertas.length },
      { etiqueta: 'Labores pendientes', valor: pendientes.length },
      { etiqueta: 'Pendientes sin operario', valor: sinAsignar },
      { etiqueta: 'Insumos sin stock', valor: insumosSinStock },
      { etiqueta: 'Siembras atrasadas', valor: atrasadas },
    ],
    OPERARIO: [
      { etiqueta: 'Asignadas a mí', valor: labores.length },
      { etiqueta: 'Pendientes', valor: pendientes.length },
      { etiqueta: 'Ejecutadas', valor: labores.length - pendientes.length },
    ],
    ALMACENERO: [
      { etiqueta: 'Insumos', valor: insumos.length },
      { etiqueta: 'Sin stock', valor: insumosSinStock },
      { etiqueta: 'Cosechas registradas', valor: cosechas.length },
      { etiqueta: 'Cosechado (t)', valor: formatCantidad(toneladas, 't') },
    ],
    SUPERVISOR: [
      { etiqueta: 'Campañas abiertas', valor: campanasAbiertas.length },
      { etiqueta: 'Avance de labores', valor: `${avance} %` },
      { etiqueta: 'Cosechado (t)', valor: formatCantidad(toneladas, 't') },
      { etiqueta: 'Insumos sin stock', valor: insumosSinStock },
      { etiqueta: 'Siembras atrasadas', valor: atrasadas },
    ],
  };

  const avisos = construirAvisos({
    graves: incidenciasGraves(incidencias),
    laboresTarde: laboresAtrasadas(labores, hoy),
    cosechasCerca: rol === 'OPERARIO' || rol === 'ALMACENERO' ? [] : cosechasPorVenir(campanas, hoy),
    campanas,
    catalogos,
    hoy,
  }).filter((aviso) => puedeVer(aviso.seccion));

  const produccion = resumenPor(campanas, cosechas, parcelas, cultivos, (campana) => campana.cultivoId);
  const tarjetaLabores = <TarjetaLabores rol={rol} labores={proximasLabores} campanas={campanas} catalogos={catalogos} hoy={hoy} />;
  const tarjetaAvance = <TarjetaAvance rol={rol} avance={avance} labores={labores} />;
  const tarjetaStock = <TarjetaStock insumos={porReponer} />;
  const tarjetaCosechas = <TarjetaCosechas cosechas={cosechas} campanas={campanas} catalogos={catalogos} />;
  const tarjetaProduccion = <TarjetaProduccion produccion={produccion} catalogos={catalogos} />;

  const tarjetaCategorias = <TarjetaCategorias insumos={insumos} />;

  const tarjetas: Record<Rol, ReactNode[]> = {
    ADMINISTRADOR: [tarjetaLabores, tarjetaAvance, tarjetaProduccion, tarjetaStock],
    JEFE_DE_CAMPO: [tarjetaLabores, tarjetaAvance, tarjetaProduccion, tarjetaStock],
    OPERARIO: [tarjetaLabores, tarjetaAvance],
    ALMACENERO: [tarjetaStock, tarjetaCategorias, tarjetaProduccion, tarjetaCosechas],
    SUPERVISOR: [tarjetaLabores, tarjetaAvance, tarjetaProduccion, tarjetaCosechas],
  };

  return (
    <section className="feature-page">
      <div className="inicio-hero">
        <p className="eyebrow">PANEL · {NOMBRE_ROL[rol].toUpperCase()}</p>
        <h1>Hola, {sesion?.nombreCompleto.split(' ')[0]}</h1>
        <p>{SALUDO[rol]}</p>
        <span className="inicio-hero__fecha"><CalendarDays size={15} aria-hidden />{fechaLarga}</span>
        <Sprout className="inicio-hero__dibujo" size={190} strokeWidth={1.25} aria-hidden />
      </div>

      {loading && <div className="state-card">Cargando resumen...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && (
        <>
          <StatsGrid stats={stats[rol]} />
          <AvisosInicio avisos={avisos} />
          <h2 className="inicio-titulo">Accesos rápidos</h2>
          <nav className="accesos-grid" aria-label="Accesos rápidos">
            {ACCESOS.filter((acceso) => puedeVer(acceso.seccion)).map(({ seccion, nombre, detalle }) => {
              const Icono = ICONO_SECCION[seccion];
              return (
                <Link key={seccion} className="acceso" to={`/${seccion}`}>
                  <span className="acceso__icono"><Icono size={19} aria-hidden /></span>
                  <span>
                    <strong>{seccion === 'labores' && rol === 'OPERARIO' ? 'Mis labores' : nombre}</strong>
                    <small>{detalle}</small>
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="dashboard-grid">
            {tarjetas[rol].map((tarjeta, i) => <Fragment key={i}>{tarjeta}</Fragment>)}
          </div>
        </>
      )}
    </section>
  );
}
