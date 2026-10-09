interface Stat {
  etiqueta: string;
  valor: string | number;
}

interface StatsGridProps {
  stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <article key={stat.etiqueta} className="stat-card">
          <span>{stat.etiqueta}</span>
          <strong>{stat.valor}</strong>
        </article>
      ))}
    </div>
  );
}
