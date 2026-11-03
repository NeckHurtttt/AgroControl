import type { Rol } from '../../features/auth/models/Sesion';
import type { Campana } from '../../features/campanas/models/Campana';
import { campanaService } from '../../features/campanas/services/campanaService';
import type { Cosecha } from '../../features/cosechas/models/Cosecha';
import { cosechaService } from '../../features/cosechas/services/cosechaService';
import { cultivoService } from '../../features/cultivos/services/cultivoService';
import type { Incidencia } from '../../features/incidencias/models/Incidencia';
import { incidenciaService } from '../../features/incidencias/services/incidenciaService';
import type { Insumo } from '../../features/insumos/models/Insumo';
import { insumoService } from '../../features/insumos/services/insumoService';
import type { AsignacionLabor, Labor } from '../../features/labores/models/Labor';
import { laborService } from '../../features/labores/services/laborService';
import { parcelaService } from '../../features/parcelas/services/parcelaService';
import type { Predio } from '../../features/predios/models/Predio';
import { predioService } from '../../features/predios/services/predioService';
import type { Usuario } from '../../features/usuarios/models/Usuario';
import { usuarioService } from '../../features/usuarios/services/usuarioService';

// Cada rol pide solo lo que su panel muestra (y lo que el backend le permite leer).
export const cargarResumen = (rol: Rol) => async (signal: AbortSignal) => {
  const vePlanificacion = rol !== 'ALMACENERO';
  const veCosechas = rol !== 'OPERARIO';
  const veIncidencias = rol !== 'ALMACENERO';
  const [predios, parcelas, cultivos, campanas, labores, insumos, cosechas, usuarios, asignaciones, incidencias] = await Promise.all([
    predioService.listar(signal),
    parcelaService.listar(signal),
    cultivoService.listar(signal),
    campanaService.listar(signal),
    vePlanificacion ? laborService.listar(signal) : Promise.resolve<Labor[]>([]),
    insumoService.listar(signal),
    veCosechas ? cosechaService.listar(signal) : Promise.resolve<Cosecha[]>([]),
    rol === 'ADMINISTRADOR' ? usuarioService.listar(signal) : Promise.resolve<Usuario[]>([]),
    rol === 'JEFE_DE_CAMPO' ? laborService.listarAsignaciones(signal) : Promise.resolve<AsignacionLabor[]>([]),
    veIncidencias ? incidenciaService.listar(signal) : Promise.resolve<Incidencia[]>([]),
  ]);
  return { predios, parcelas, cultivos, campanas, labores, insumos, cosechas, usuarios, asignaciones, incidencias };
};

export const vacio = {
  predios: [] as Predio[],
  parcelas: [],
  cultivos: [],
  campanas: [] as Campana[],
  labores: [] as Labor[],
  insumos: [] as Insumo[],
  cosechas: [] as Cosecha[],
  usuarios: [] as Usuario[],
  asignaciones: [] as AsignacionLabor[],
  incidencias: [] as Incidencia[],
};
