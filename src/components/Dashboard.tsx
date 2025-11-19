import { Wind, Gauge, Navigation, TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataCount, setDataCount] = useState(0);

  useEffect(() => {
    async function fetchDataCount() {
      try {
        const { count, error } = await supabase
          .from('wind_data')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        setDataCount(count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    }

    fetchDataCount();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Panel de Control
        </h2>
        <p className="text-gray-600">
          Predicción mensual a largo plazo de vientos en Barranquilla
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Velocidad Media"
          value="--"
          unit="m/s"
          icon={<Wind className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Velocidad Máxima"
          value="--"
          unit="m/s"
          icon={<Gauge className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Dirección Dominante"
          value="--"
          unit="°"
          icon={<Navigation className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Registros"
          value={dataCount.toLocaleString()}
          unit="datos"
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendencia de Velocidad Mensual
          </h3>
          <div className="h-80 flex items-center justify-center text-gray-500">
            Gráfico de tendencia en desarrollo
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rosa de Vientos
          </h3>
          <div className="h-80 flex items-center justify-center text-gray-500">
            Rosa de vientos en desarrollo
          </div>
        </div>
      </div>
    </div>
  );
}
