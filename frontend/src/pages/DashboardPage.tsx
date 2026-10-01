import { Link } from 'react-router';

export default function DashboardPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Panel principal</p>
          <h2>Bienvenido a AgroControl</h2>
        </div>
      </div>
      <div className="placeholder-card">
        <h3>Predios y parcelas conectados al backend</h3>
        <p>
          Registra los fundos de la operación y divídelos en parcelas. Desde aquí
          crecerán campañas, labores, insumos y cosechas con trazabilidad por parcela.
        </p>
        <Link className="button-link" to="/predios">Ver predios</Link>
      </div>
    </section>
  );
}
