import { useState } from 'react';
import { PedidoForm } from './components/PedidoForm';
import { PedidoDetalle } from './components/PedidoDetalle';
import { PedidosList } from './components/PedidosList';
import { ProductosManager } from './components/ProductosManager';
import { ClientesManager } from './components/ClientesManager';

type Tab = 'crear' | 'consultar' | 'listar' | 'productos' | 'clientes';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('listar');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 py-4 flex-wrap">
            <button
              onClick={() => setActiveTab('listar')}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'listar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Lista de Pedidos
            </button>
            <button
              onClick={() => setActiveTab('crear')}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'crear'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ➕ Crear Pedido
            </button>
            <button
              onClick={() => setActiveTab('consultar')}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'consultar'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔍 Consultar Pedido
            </button>
            <button
              onClick={() => setActiveTab('productos')}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'productos'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 Productos
            </button>
            <button
              onClick={() => setActiveTab('clientes')}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'clientes'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👥 Clientes
            </button>
          </div>
        </div>
      </div>

      <div className="py-6">
        {activeTab === 'listar' && <PedidosList />}
        {activeTab === 'crear' && <PedidoForm />}
        {activeTab === 'consultar' && <PedidoDetalle />}
        {activeTab === 'productos' && <ProductosManager />}
        {activeTab === 'clientes' && <ClientesManager />}
      </div>
    </div>
  );
}

export default App;