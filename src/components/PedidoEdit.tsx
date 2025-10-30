import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { UpdatePedidoCommand, OrderItemDto, Cliente, Producto } from '../models/types';
import { pedidosApi } from '../api/pedidosApi';

const schema = yup.object({
  pedidoId: yup.number().required(),
  clienteCodigo: yup.string().required('El código del cliente es requerido'),
  items: yup.array()
    .of(
      yup.object({
        productoCodigo: yup.string().required('El código del producto es requerido'),
        cantidad: yup.number()
          .min(1, 'La cantidad debe ser mayor a 0')
          .required('La cantidad es requerida'),
      })
    )
    .min(1, 'Debe agregar al menos un producto')
    .required('Los items son requeridos'),
}).required();

interface PedidoEditProps {
  pedidoId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PedidoEdit = ({ pedidoId, onSuccess, onCancel }: PedidoEditProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<UpdatePedidoCommand>({
    resolver: yupResolver(schema),
    defaultValues: {
      pedidoId: pedidoId,
      clienteCodigo: '',
      items: [{ productoCodigo: '', cantidad: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesData, productosData] = await Promise.all([
          pedidosApi.getClientes(),
          pedidosApi.getProductos(),
        ]);
        setClientes(clientesData);
        setProductos(productosData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoadingClientes(false);
        setLoadingProductos(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const pedido = await pedidosApi.getPedidoById(pedidoId);
        
        const items: OrderItemDto[] = pedido.detalles.map(d => ({
          productoCodigo: d.productoCodigo,
          cantidad: d.cantidad,
        }));

        reset({
          pedidoId: pedido.id,
          clienteCodigo: pedido.cliente.codigo,
          items: items,
        });
      } catch (err: any) {
        setError('Error al cargar el pedido');
      } finally {
        setLoadingData(false);
      }
    };

    cargarPedido();
  }, [pedidoId, reset]);

  const onSubmit = async (data: UpdatePedidoCommand) => {
    setLoading(true);
    setError(null);

    try {
      await pedidosApi.updatePedido(pedidoId, data);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData || loadingClientes || loadingProductos) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Editar Pedido #{pedidoId}</h1>
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Pedido #{pedidoId}</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <span className="text-red-600 text-xl mr-3">❌</span>
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="clienteCodigo" className="block text-sm font-semibold text-gray-700 mb-2">
              Seleccionar Cliente:
            </label>
            <select
              id="clienteCodigo"
              {...register('clienteCodigo')}
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">-- Seleccione un cliente --</option>
              {clientes.map((cliente) => (
                <option key={cliente.codigo} value={cliente.codigo}>
                  {cliente.nombre} - DNI: {cliente.dni}
                </option>
              ))}
            </select>
            {errors.clienteCodigo && (
              <p className="mt-1 text-sm text-red-600">{errors.clienteCodigo.message}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start">
                  <div className="flex-[2]">
                    <select
                      {...register(`items.${index}.productoCodigo`)}
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">-- Seleccione un producto --</option>
                      {productos.map((producto) => (
                        <option key={producto.codigo} value={producto.codigo}>
                          {producto.descripcion}
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.productoCodigo && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.productoCodigo?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="number"
                      {...register(`items.${index}.cantidad`)}
                      placeholder="Cantidad"
                      min="1"
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    {errors.items?.[index]?.cantidad && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.cantidad?.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      fields.length === 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {errors.items && typeof errors.items.message === 'string' && (
              <p className="mt-2 text-sm text-red-600">{errors.items.message}</p>
            )}

            <button
              type="button"
              onClick={() => append({ productoCodigo: '', cantidad: 1 })}
              className="mt-4 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              + Agregar Producto
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};