import axios from 'axios';
import type { 
  CreatePedidoCommand, 
  PedidoDetalleResponse, 
  UpdatePedidoCommand, 
  Cliente, 
  Producto,
  CreateProductoCommand,
  ProductoDetalle,
  UpdateProductoCommand,
  CreateClienteCommand,
  UpdateClienteCommand
} from '../models/types';

const API_BASE_URL = 'https://localhost:7192/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pedidosApi = {
  getAllPedidos: async (): Promise<PedidoDetalleResponse[]> => {
    const response = await axiosInstance.get('/Pedidos');
    return response.data;
  },
  
  createPedido: async (pedido: CreatePedidoCommand): Promise<any> => {
    const response = await axiosInstance.post('/Pedidos', pedido);
    return response.data;
  },

  getPedidoById: async (id: number): Promise<PedidoDetalleResponse> => {
    const response = await axiosInstance.get(`/Pedidos/${id}`);
    return response.data;
  },

  updatePedido: async (id: number, pedido: UpdatePedidoCommand): Promise<any> => {
    const response = await axiosInstance.put(`/Pedidos/${id}`, pedido);
    return response.data;
  },

  deletePedido: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Pedidos/${id}`);
  },

  getClientes: async (): Promise<Cliente[]> => {
    const response = await axiosInstance.get('/Clientes');
    return response.data;
  },

  getProductos: async (): Promise<Producto[]> => {
    const response = await axiosInstance.get('/Productos');
    return response.data;
  },

  createProducto: async (producto: CreateProductoCommand): Promise<ProductoDetalle> => {
    const response = await axiosInstance.post('/Productos', producto);
    return response.data;
  },

  updateProducto: async (codigo: string, producto: UpdateProductoCommand): Promise<any> => {
    const response = await axiosInstance.put(`/Productos/${codigo}`, producto);
    return response.data;
  },

  deleteProducto: async (codigo: string): Promise<void> => {
    await axiosInstance.delete(`/Productos/${codigo}`);
  },


  createCliente: async (cliente: CreateClienteCommand): Promise<any> => {
    const response = await axiosInstance.post('/Clientes', cliente);
    return response.data;
  },

  updateCliente: async (id: number, cliente: UpdateClienteCommand): Promise<any> => {
    const response = await axiosInstance.put(`/Clientes/${id}`, cliente);
    return response.data;
  },

  deleteCliente: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Clientes/${id}`);
  },
};

export default pedidosApi;