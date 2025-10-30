import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { pedidosApi } from '../api/pedidosApi';
import type { CreateProductoCommand, ProductoDetalle, UpdateProductoCommand } from '../models/types';
import { ConfirmModal } from './ConfirmModal'; 

const schema = yup.object({
  codigo: yup.string().required('El código es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  precioUnitario: yup.number()
    .min(0.01, 'El precio debe ser mayor a 0')
    .required('El precio es requerido'),
}).required();

export const ProductosManager = () => {
  const [productos, setProductos] = useState<ProductoDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [codigoOriginal, setCodigoOriginal] = useState<string>('');
  const [eliminando, setEliminando] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<{ codigo: string; descripcion: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateProductoCommand>({
    resolver: yupResolver(schema),
    defaultValues: {
      codigo: '',
      descripcion: '',
      precioUnitario: 0,
    },
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await pedidosApi.getProductos();
      const productosConPrecio = data.map(p => ({
        ...p,
        precioUnitario: 0
      }));
      setProductos(productosConPrecio as ProductoDetalle[]);
    } catch (err: any) {
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoProducto = () => {
    setEditando(null);
    setCodigoOriginal('');
    reset({ codigo: '', descripcion: '', precioUnitario: 0 });
    setMostrarFormulario(true);
    setSuccess(false);
    setError(null);
  };

  const handleEditarProducto = (producto: ProductoDetalle) => {
    setEditando(producto.codigo);
    setCodigoOriginal(producto.codigo);
    reset({
      codigo: producto.codigo,
      descripcion: producto.descripcion,
      precioUnitario: producto.precioUnitario,
    });
    setMostrarFormulario(true);
    setSuccess(false);
    setError(null);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEditando(null);
    setCodigoOriginal('');
    reset({ codigo: '', descripcion: '', precioUnitario: 0 });
    setError(null);
  };

  const handleEliminarClick = (codigo: string, descripcion: string) => {
    setProductoAEliminar({ codigo, descripcion });
    setShowModal(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!productoAEliminar) return;

    setShowModal(false);
    setEliminando(productoAEliminar.codigo);
    setError(null);
    setSuccess(false);

    try {
      await pedidosApi.deleteProducto(productoAEliminar.codigo);
      setProductos(productos.filter(p => p.codigo !== productoAEliminar.codigo));
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`No se encontró el producto con código ${productoAEliminar.codigo}`);
      } else {
        setError('Error al eliminar el producto. Por favor intenta nuevamente.');
      }
    } finally {
      setEliminando(null);
      setProductoAEliminar(null);
    }
  };

  const handleCancelarEliminar = () => {
    setShowModal(false);
    setProductoAEliminar(null);
  };

  const onSubmit = async (data: CreateProductoCommand) => {
    setLoadingForm(true);
    setError(null);
    setSuccess(false);

    try {
      if (editando) {
        await pedidosApi.updateProducto(codigoOriginal, data as UpdateProductoCommand);
        setSuccess(true);
      } else {
        await pedidosApi.createProducto(data as CreateProductoCommand);
        setSuccess(true);
      }
      
      reset();
      setMostrarFormulario(false);
      setEditando(null);
      setCodigoOriginal('');
      cargarProductos();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(err.response.data.message || `Ya existe un producto con el código ${data.codigo}`);
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Datos inválidos');
      } else {
        setError(err.response?.data?.message || `Error al ${editando ? 'actualizar' : 'crear'} el producto`);
      }
    } finally {
      setLoadingForm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestión de Productos</h1>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={showModal}
        title="¿Eliminar Producto?"
        message={`¿Estás seguro de eliminar el producto "${productoAEliminar?.descripcion}" (${productoAEliminar?.codigo})? Esta acción no se puede deshacer.`}
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
              Gestión de Productos <span className="text-blue-600">({productos.length})</span>
            </h1>
            <div className="flex gap-3">
              <button
                onClick={cargarProductos}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🔄 Actualizar
              </button>
              <button
                onClick={handleNuevoProducto}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Producto'}
              </button>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <span className="text-green-600 text-xl mr-3">✅</span>
              <span className="text-green-800 font-medium">
                Producto {editando ? 'actualizado' : eliminando ? 'eliminado' : 'creado'} exitosamente
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <span className="text-red-600 text-xl mr-3">❌</span>
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {mostrarFormulario && (
            <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editando ? `Editar Producto: ${codigoOriginal}` : 'Agregar Nuevo Producto'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="codigo" className="block text-sm font-semibold text-gray-700 mb-2">
                      Código:
                    </label>
                    <input
                      id="codigo"
                      type="text"
                      {...register('codigo')}
                      placeholder="Ej: P001"
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    {errors.codigo && (
                      <p className="mt-1 text-sm text-red-600">{errors.codigo.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción:
                    </label>
                    <input
                      id="descripcion"
                      type="text"
                      {...register('descripcion')}
                      placeholder="Ej: Laptop HP"
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    {errors.descripcion && (
                      <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="precioUnitario" className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio Unitario:
                    </label>
                    <input
                      id="precioUnitario"
                      type="number"
                      step="0.01"
                      {...register('precioUnitario')}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    {errors.precioUnitario && (
                      <p className="mt-1 text-sm text-red-600">{errors.precioUnitario.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loadingForm}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                      loadingForm
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loadingForm ? 'Guardando...' : editando ? '💾 Actualizar Producto' : '💾 Guardar Producto'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelar}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {productos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay productos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productos.map((producto) => (
                    <tr 
                      key={producto.codigo} 
                      className={`hover:bg-gray-50 transition-opacity ${
                        eliminando === producto.codigo ? 'opacity-50' : 'opacity-100'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {producto.codigo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {producto.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleEditarProducto(producto)}
                            disabled={eliminando === producto.codigo}
                            className={`px-3 py-1.5 rounded transition-colors text-xs ${
                              eliminando === producto.codigo
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-yellow-500 text-white hover:bg-yellow-600'
                            }`}
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            onClick={() => handleEliminarClick(producto.codigo, producto.descripcion)}
                            disabled={eliminando === producto.codigo}
                            className={`px-3 py-1.5 rounded transition-colors text-xs ${
                              eliminando === producto.codigo
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {eliminando === producto.codigo ? '⏳' : '🗑️ Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};