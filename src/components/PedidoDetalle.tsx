import { useState } from 'react';
import { pedidosApi } from '../api/pedidosApi';
import type { PedidoDetalleResponse } from '../models/types';

export const PedidoDetalle = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [pedido, setPedido] = useState<PedidoDetalleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!pedidoId || isNaN(Number(pedidoId))) {
      setError('Por favor ingrese un ID válido');
      return;
    }

    setLoading(true);
    setError(null);
    setPedido(null);

    try {
      const data = await pedidosApi.getPedidoById(Number(pedidoId));
      setPedido(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`No se encontró el pedido con ID ${pedidoId}`);
      } else {
        setError('Error al buscar el pedido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Consultar Pedido</h1>

        <div className="mb-8 flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              placeholder="Ingrese el ID del pedido"
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleBuscar();
                }
              }}
            />
          </div>
          <button
            onClick={handleBuscar}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <span className="text-red-600 text-xl mr-3">❌</span>
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {pedido && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Pedido #{pedido.id}</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-base font-medium text-gray-900">
                    {new Date(pedido.fechaOrden).toLocaleString('es-PE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="text-base font-medium text-gray-900">
                    {pedido.cliente.nombre} ({pedido.cliente.codigo})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">DNI</p>
                  <p className="text-base font-medium text-gray-900">{pedido.cliente.dni}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                          P. Unitario
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pedido.detalles.map((detalle, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{detalle.productoCodigo}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{detalle.productoDescripcion}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900">{detalle.cantidad}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            S/ {detalle.precioUnitario.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                            S/ {detalle.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">TOTAL:</span>
                  <span className="text-2xl font-bold text-green-700">S/ {pedido.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};