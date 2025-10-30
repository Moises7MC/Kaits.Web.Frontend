# Sistema Web Kaits - Frontend

Aplicación web moderna para la gestión de pedidos, productos y clientes, desarrollada con React + TypeScript + Vite y Tailwind CSS.

## 🚀 Tecnologías Utilizadas

### Core
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción rápida

### Gestión de Estado y Formularios
- **React Hook Form** - Manejo eficiente de formularios
- **Yup** - Validación de esquemas
- **@hookform/resolvers** - Integración de validadores con React Hook Form

### Estilos
- **Tailwind CSS v3** - Framework de CSS utility-first

### Comunicación con API
- **Axios** - Cliente HTTP para peticiones al backend

## 📋 Prerequisitos

- Node.js 16+ y npm
- Backend ASP.NET Core ejecutándose en `https://localhost:7192`

## 🔧 Instalación

1. **Clonar/descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno (opcional)**

Si tu backend corre en una URL diferente, actualiza `src/api/pedidosApi.ts`:
```typescript
const API_BASE_URL = 'https://tu-url-backend/api';
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Dependencias Instaladas

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "axios": "^1.x",
    "react-hook-form": "^7.x",
    "yup": "^1.x",
    "@hookform/resolvers": "^3.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── api/
│   └── pedidosApi.ts          # Cliente HTTP y endpoints
├── components/
│   ├── ClientesManager.tsx    # CRUD de clientes
│   ├── ConfirmModal.tsx       # Modal de confirmación reutilizable
│   ├── PedidoDetalle.tsx      # Consultar pedido por ID
│   ├── PedidoEdit.tsx         # Editar pedido existente
│   ├── PedidoForm.tsx         # Crear nuevo pedido
│   ├── PedidosList.tsx        # Lista de todos los pedidos
│   └── ProductosManager.tsx   # CRUD de productos
├── models/
│   └── types.ts               # Interfaces TypeScript
├── App.tsx                    # Componente principal con navegación
├── main.tsx                   # Punto de entrada
└── index.css                  # Estilos globales con Tailwind
```

## 🎯 Funcionalidades Implementadas

### 📦 Gestión de Pedidos
- ✅ **Crear pedidos** con múltiples productos
- ✅ **Listar todos los pedidos** con detalles expandibles
- ✅ **Consultar pedido** específico por ID
- ✅ **Editar pedidos** existentes
- ✅ **Eliminar pedidos** con confirmación
- ✅ Selección de clientes desde dropdown
- ✅ Selección de productos desde dropdown
- ✅ Cálculo automático de totales en el servidor

### 📦 Gestión de Productos
- ✅ **Crear productos** (código, descripción, precio)
- ✅ **Listar productos** en tabla
- ✅ **Editar productos** existentes
- ✅ **Eliminar productos** con modal de confirmación
- ✅ Validación de códigos duplicados

### 👥 Gestión de Clientes
- ✅ **Crear clientes** (código, nombre, DNI)
- ✅ **Listar clientes** en tabla
- ✅ **Editar clientes** existentes
- ✅ **Eliminar clientes** con modal de confirmación
- ✅ Validación de DNI (8 dígitos numéricos)

## 🎨 Características de UI/UX

- ✨ **Diseño moderno** con Tailwind CSS
- ✨ **Modal de confirmación** personalizado para eliminaciones
- ✨ **Validaciones en tiempo real** con mensajes claros
- ✨ **Estados de carga** con indicadores visuales
- ✨ **Mensajes de éxito/error** contextuales
- ✨ **Navegación por tabs** entre secciones
- ✨ **Responsive design** adaptable a diferentes pantallas
- ✨ **Transiciones suaves** en interacciones

## 🔌 Endpoints del Backend Utilizados

### Pedidos
- `POST /api/Pedidos` - Crear pedido
- `GET /api/Pedidos/{id}` - Obtener pedido por ID
- `GET /api/Pedidos` - Listar todos los pedidos
- `PUT /api/Pedidos/{id}` - Actualizar pedido
- `DELETE /api/Pedidos/{id}` - Eliminar pedido

### Productos
- `POST /api/Productos` - Crear producto
- `GET /api/Productos` - Listar productos
- `PUT /api/Productos/{codigo}` - Actualizar producto
- `DELETE /api/Productos/{codigo}` - Eliminar producto

### Clientes
- `POST /api/Clientes` - Crear cliente
- `GET /api/Clientes` - Listar clientes
- `PUT /api/Clientes/{id}` - Actualizar cliente
- `DELETE /api/Clientes/{id}` - Eliminar cliente

## 🔐 Configuración de CORS

El backend debe permitir peticiones desde `http://localhost:5173`:

```csharp
// En Program.cs del backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowReactApp");
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 🎓 Patrones y Buenas Prácticas Implementadas

- ✅ **Separación de responsabilidades** (API, componentes, tipos)
- ✅ **Componentes reutilizables** (ConfirmModal)
- ✅ **Custom hooks** potenciales para lógica compartida
- ✅ **Tipado fuerte** con TypeScript
- ✅ **Validaciones centralizadas** con Yup schemas
- ✅ **Manejo de errores** consistente
- ✅ **Estados de carga** para mejor UX
- ✅ **Código limpio** y mantenible

## 🚨 Notas Importantes

1. **Certificado SSL**: Si tienes problemas con el certificado autofirmado del backend, acepta el certificado en el navegador visitando `https://localhost:7192` directamente.

2. **Puerto del frontend**: Por defecto Vite usa el puerto 5173. Si está ocupado, usará otro puerto automáticamente.

3. **Hot Reload**: Los cambios en el código se reflejan automáticamente sin recargar la página.

## 🐛 Solución de Problemas

### Error de CORS
**Síntoma**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solución**: Verifica que el backend tenga configurado CORS correctamente (ver sección de CORS).

### Error 404 en endpoints
**Síntoma**: Endpoints retornan 404

**Solución**: Verifica que la URL base en `src/api/pedidosApi.ts` coincida con tu backend.

### Input de DNI acepta letras
**Síntoma**: Se pueden escribir letras en el campo DNI

**Solución**: Ya está solucionado con `type="number"` y `onInput` que filtra caracteres.

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Yup Validation](https://github.com/jquense/yup)

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como parte de una prueba técnica, aplicando arquitectura limpia y mejores prácticas de desarrollo frontend moderno.

### Características Técnicas Destacadas

- **TypeScript estricto** para prevenir errores en tiempo de desarrollo
- **Formularios dinámicos** con `useFieldArray` para items de pedidos
- **Validaciones sincronizadas** entre cliente y servidor
- **Modal personalizado** sin dependencias externas pesadas
- **Gestión de estado** eficiente sin librerías adicionales
- **API centralizada** para fácil mantenimiento
---
