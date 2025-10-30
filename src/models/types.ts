export interface OrderItemDto {
  productoCodigo: string;
  cantidad: number;
}

export interface CreatePedidoCommand {
  clienteCodigo: string;
  items: OrderItemDto[];
}

export interface ClienteDto {
  codigo: string;
  nombre: string;
  dni: string;
}

export interface DetalleDto {
  productoCodigo: string;
  productoDescripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoDetalleResponse {
  id: number;
  fechaOrden: string;
  cliente: ClienteDto;
  detalles: DetalleDto[];
  total: number;
}

export interface UpdatePedidoCommand {
  pedidoId: number;
  clienteCodigo: string;
  items: OrderItemDto[];
}

export interface Cliente {
  id: number; 
  codigo: string;
  nombre: string;
  dni: string;
}

export interface Producto {
  codigo: string;
  descripcion: string;
}

export interface ProductoDetalle {
  codigo: string;
  descripcion: string;
  precioUnitario: number;
}

export interface CreateProductoCommand {
  codigo: string;
  descripcion: string;
  precioUnitario: number;
}

export interface UpdateProductoCommand {
  codigo: string;
  descripcion: string;
  precioUnitario: number;
}

export interface CreateClienteCommand {
  codigo: string;
  nombre: string;
  dni: string;
}

export interface UpdateClienteCommand {
  id: number;
  codigo: string;
  nombre: string;
  dni: string;
}