import { Wind } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <Wind className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vento
            </h1>
            <p className="text-sm text-gray-600">Barranquilla, Colombia</p>
          </div>
        </div>
      </div>
    </header>
  );
}
