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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Consultar Pedido</h1>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <input
            type="number"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            placeholder="Ingrese el ID del pedido"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
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
          style={{
            padding: '10px 24px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
          }}
        >
          ❌ {error}
        </div>
      )}

      {pedido && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Pedido #{pedido.id}</h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '5px 0' }}>
              <strong>Fecha:</strong> {new Date(pedido.fechaOrden).toLocaleString('es-PE')}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Cliente:</strong> {pedido.cliente.nombre} ({pedido.cliente.codigo})
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>DNI:</strong> {pedido.cliente.dni}
            </p>
          </div>

          <h3>Productos</h3>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              backgroundColor: 'white',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Código
                </th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Descripción
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                  Cantidad
                </th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                  P. Unitario
                </th>
                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {pedido.detalles.map((detalle, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {detalle.productoCodigo}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {detalle.productoDescripcion}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {detalle.cantidad}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                    S/ {detalle.precioUnitario.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>
                    S/ {detalle.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              textAlign: 'right',
              fontSize: '20px',
              fontWeight: 'bold',
              padding: '15px',
              backgroundColor: '#d4edda',
              borderRadius: '4px',
            }}
          >
            TOTAL: S/ {pedido.total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};