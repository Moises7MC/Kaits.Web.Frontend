import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { pedidosApi } from '../api/pedidosApi';
import type { Cliente, CreateClienteCommand, UpdateClienteCommand } from '../models/types';
import { ConfirmModal } from './ConfirmModal';

const schema = yup.object({
  codigo: yup.string().required('El código es requerido'),
  nombre: yup.string().required('El nombre es requerido'),
  dni: yup.string()
    .required('El DNI es requerido')
    .matches(/^\d{8}$/, 'El DNI debe tener 8 dígitos'),
}).required();

export const ClientesManager = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState<{ id: number; nombre: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateClienteCommand>({
    resolver: yupResolver(schema),
    defaultValues: {
      codigo: '',
      nombre: '',
      dni: '',
    },
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await pedidosApi.getClientes();
      setClientes(data);
    } catch (err: any) {
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoCliente = () => {
    setEditando(null);
    reset({ codigo: '', nombre: '', dni: '' });
    setMostrarFormulario(true);
    setSuccess(false);
    setError(null);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setEditando(cliente.id);
    reset({
      codigo: cliente.codigo,
      nombre: cliente.nombre,
      dni: cliente.dni,
    });
    setMostrarFormulario(true);
    setSuccess(false);
    setError(null);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEditando(null);
    reset({ codigo: '', nombre: '', dni: '' });
    setError(null);
  };

  const handleEliminarClick = (id: number, nombre: string) => {
    setClienteAEliminar({ id, nombre });
    setShowModal(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!clienteAEliminar) return;

    setShowModal(false);
    setEliminando(clienteAEliminar.id);
    setError(null);
    setSuccess(false);

    try {
      await pedidosApi.deleteCliente(clienteAEliminar.id);
      setClientes(clientes.filter(c => c.id !== clienteAEliminar.id));
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No se encontró el cliente');
      } else if (err.response?.status === 409) {
        setError(err.response.data.message || 'No se puede eliminar el cliente porque tiene pedidos asociados');
      } else {
        setError('Error al eliminar el cliente. Por favor intenta nuevamente.');
      }
    } finally {
      setEliminando(null);
      setClienteAEliminar(null);
    }
  };

  const handleCancelarEliminar = () => {
    setShowModal(false);
    setClienteAEliminar(null);
  };

  const onSubmit = async (data: CreateClienteCommand) => {
    setLoadingForm(true);
    setError(null);
    setSuccess(false);

    try {
      if (editando) {
        const updateData: UpdateClienteCommand = {
          id: editando,
          codigo: data.codigo,
          nombre: data.nombre,
          dni: data.dni,
        };
        await pedidosApi.updateCliente(editando, updateData);
        setSuccess(true);
      } else {
        await pedidosApi.createCliente(data);
        setSuccess(true);
      }

      reset();
      setMostrarFormulario(false);
      setEditando(null);
      cargarClientes();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else if (err.response?.status === 409) {
        setError(err.response.data.message || 'Ya existe un cliente con ese código');
      } else {
        setError(err.response?.data?.message || `Error al ${editando ? 'actualizar' : 'crear'} el cliente`);
      }
    } finally {
      setLoadingForm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestión de Clientes</h1>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={showModal}
        title="¿Eliminar Cliente?"
        message={`¿Estás seguro de eliminar el cliente "${clienteAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
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
              Gestión de Clientes <span className="text-blue-600">({clientes.length})</span>
            </h1>
            <div className="flex gap-3">
              <button
                onClick={cargarClientes}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🔄 Actualizar
              </button>
              <button
                onClick={handleNuevoCliente}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Cliente'}
              </button>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <span className="text-green-600 text-xl mr-3">✅</span>
              <span className="text-green-800 font-medium">
                Cliente {editando ? 'actualizado' : eliminando ? 'eliminado' : 'creado'} exitosamente
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
                {editando ? `Editar Cliente ID: ${editando}` : 'Agregar Nuevo Cliente'}
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
                      placeholder="Ej: C001"
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    {errors.codigo && (
                      <p className="mt-1 text-sm text-red-600">{errors.codigo.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre:
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      {...register('nombre')}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 mb-2">
                      DNI:
                    </label>
                    <input
                      id="dni"
                      type="number"
                      {...register('dni')}
                      placeholder="12345678"
                      maxLength={8}
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/\D/g, '').slice(0, 8);
                      }}
                    />
                    {errors.dni && (
                      <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
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
                    {loadingForm ? 'Guardando...' : editando ? '💾 Actualizar Cliente' : '💾 Guardar Cliente'}
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

          {clientes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay clientes registrados</p>
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
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr 
                      key={cliente.id} 
                      className={`hover:bg-gray-50 transition-opacity ${
                        eliminando === cliente.id ? 'opacity-50' : 'opacity-100'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cliente.codigo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {cliente.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cliente.dni}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditarCliente(cliente)}
                            disabled={eliminando === cliente.id}
                            className={`px-3 py-1.5 rounded transition-colors text-xs ${
                              eliminando === cliente.id
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-yellow-500 text-white hover:bg-yellow-600'
                            }`}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleEliminarClick(cliente.id, cliente.nombre)}
                            disabled={eliminando === cliente.id}
                            className={`px-3 py-1.5 rounded transition-colors text-xs ${
                              eliminando === cliente.id
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {eliminando === cliente.id ? '⏳' : '🗑️ Eliminar'}
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