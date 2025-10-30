import { useState, useEffect } from 'react';
import { pedidosApi } from '../api/pedidosApi';
import type { PedidoDetalleResponse } from '../models/types';
import { PedidoEdit } from './PedidoEdit';
import { ConfirmModal } from './ConfirmModal';

export const PedidosList = () => {
  const [pedidos, setPedidos] = useState<PedidoDetalleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState<{ id: number; cliente: string } | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [editando, setEditando] = useState<number | null>(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await pedidosApi.getAllPedidos();
      setPedidos(data);
    } catch {
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const toggleDetalle = (id: number) => {
    setPedidoExpandido(pedidoExpandido === id ? null : id);
  };

  const handleEliminarClick = (id: number, clienteNombre: string) => {
    setPedidoAEliminar({ id, cliente: clienteNombre });
    setShowModal(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!pedidoAEliminar) return;

    setShowModal(false);
    setEliminando(pedidoAEliminar.id);

    try {
      await pedidosApi.deletePedido(pedidoAEliminar.id);
      setPedidos((prev) => prev.filter(p => p.id !== pedidoAEliminar.id));

      if (pedidoExpandido === pedidoAEliminar.id) {
        setPedidoExpandido(null);
      }
    } catch {
      setError('Error al eliminar el pedido. Por favor intenta nuevamente.');
    } finally {
      setEliminando(null);
      setPedidoAEliminar(null);
    }
  };

  const handleCancelarEliminar = () => {
    setShowModal(false);
    setPedidoAEliminar(null);
  };

  const handleEditar = (id: number) => setEditando(id);

  const handleEditarSuccess = () => {
    setEditando(null);
    cargarPedidos();
  };

  const handleEditarCancel = () => setEditando(null);

  if (editando) {
    return (
      <PedidoEdit
        pedidoId={editando}
        onSuccess={handleEditarSuccess}
        onCancel={handleEditarCancel}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lista de Pedidos</h1>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Lista de Pedidos</h1>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start mb-4">
            <span className="text-red-600 text-xl mr-3">❌</span>
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={cargarPedidos}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lista de Pedidos</h1>
          <p className="text-gray-500">No hay pedidos registrados.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={showModal}
        title="¿Eliminar Pedido?"
        message={`¿Estás seguro de eliminar el Pedido #${pedidoAEliminar?.id} del cliente "${pedidoAEliminar?.cliente}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmarEliminar}
        onCancel={handleCancelarEliminar}
        type="danger"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Lista de Pedidos <span className="text-blue-600">({pedidos.length})</span>
            </h1>
            <button
              onClick={cargarPedidos}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              🔄 Actualizar
            </button>
          </div>

          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className={`border border-gray-200 rounded-lg overflow-hidden transition-opacity ${
                  eliminando === pedido.id ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div
                  className={`p-4 transition-colors ${
                    pedidoExpandido === pedido.id ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div 
                      onClick={() => toggleDetalle(pedido.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Pedido #{pedido.id}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Cliente:</span> {pedido.cliente.nombre} ({pedido.cliente.codigo})
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(pedido.fechaOrden).toLocaleString('es-PE')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold text-green-600">
                          S/ {pedido.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {pedido.detalles.length} producto(s)
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditar(pedido.id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEliminarClick(pedido.id, pedido.cliente.nombre)}
                        disabled={eliminando === pedido.id}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          eliminando === pedido.id
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {eliminando === pedido.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                </div>

                {pedidoExpandido === pedido.id && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Detalle de Productos</h4>
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};