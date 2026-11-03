import { TriangleAlert, Wheat, type LucideIcon } from 'lucide-react';
import type { Campana } from '../../features/campanas/models/Campana';
import { etiquetaCampana, etiquetaParcela, type Catalogos } from '../../features/campanas/utils/etiquetas';
import { nombreTipoIncidencia, type Incidencia } from '../../features/incidencias/models/Incidencia';
import type { Labor } from '../../features/labores/models/Labor';
import { iconoLabor } from '../../shared/utils/iconos';
import { diasAtraso } from '../../shared/utils/resumenInicio';
import { formatFecha } from '../../utils/formato';

export interface Aviso {
  clave: string;
  seccion: 'incidencias' | 'labores' | 'campanas';
  icono: LucideIcon;
  titulo: string;
  detalle: string;
  a: string;
}

interface DatosAvisos {
  graves: Incidencia[];
  laboresTarde: Labor[];
  cosechasCerca: Campana[];
  campanas: Campana[];
  catalogos: Catalogos;
  hoy: string;
}

export function construirAvisos({ graves, laboresTarde, cosechasCerca, campanas, catalogos, hoy }: DatosAvisos): Aviso[] {
  return [
    ...graves.map((incidencia) => ({
      clave: `i${incidencia.id}`,
      seccion: 'incidencias' as const,
      icono: TriangleAlert,
      titulo: `${nombreTipoIncidencia(incidencia.tipo)} grave · ${incidencia.parcelaId ? etiquetaParcela(incidencia.parcelaId, catalogos) : 'sin parcela'}`,
      detalle: incidencia.responsableId === null ? 'Sin responsable' : incidencia.estado === 'ABIERTA' ? 'Sin atender' : 'En atención',
      a: '/incidencias',
    })),
    ...laboresTarde.map((labor) => {
      const campanaLabor = campanas.find((item) => item.id === labor.campanaId);
      return {
        clave: `l${labor.id}`,
        seccion: 'labores' as const,
        icono: iconoLabor(labor.tipo),
        titulo: `${labor.tipo.replace(/_/g, ' ')} atrasada${campanaLabor ? ` · ${etiquetaCampana(campanaLabor, catalogos)}` : ''}`,
        detalle: `${diasAtraso(labor.fechaPlan, hoy)} días`,
        a: '/labores',
      };
    }),
    ...cosechasCerca.map((campanaCerca) => {
      const fecha = campanaCerca.fechaCosechaEstimada ?? hoy;
      return {
        clave: `c${campanaCerca.id}`,
        seccion: 'campanas' as const,
        icono: Wheat,
        titulo: `Cosecha ${fecha < hoy ? 'atrasada' : 'próxima'} · ${etiquetaCampana(campanaCerca, catalogos)}`,
        detalle: formatFecha(fecha),
        a: `/campanas/${campanaCerca.id}`,
      };
    }),
  ];
}
