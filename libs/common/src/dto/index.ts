// ✅ Ruta corregida: añadimos /productos/
export * from './ms-productos/productos/create-productos.dto';
export * from './ms-productos/productos/update-productos.dto';
export * from './ms-productos/categorias/create-categoria.dto';
export * from './ms-productos/categorias/update-categoria.dto';
export * from './ms-productos/alergenos/create-alergeno.dto';
export * from './ms-productos/alergenos/update-alergeno.dto';


// Usuarios
export * from './ms-usuarios/create-usuario.dto';
export * from './ms-usuarios/update-usuario.dto';   

// tables
export * from './ms-tables/create-table.dto';
export * from './ms-tables/update-table.dto';

// orders
export * from './ms-orders/create-order.dto';

// auth
// Añade esto al final del archivo:
export * from './ms-auth/auth/LoginUserDto.dto';
export * from './ms-auth/auth/RegisterUserDto.dto';

// Si necesitas categorías en el futuro, añádelas así:
// export * from './ms-productos/categorias/create-categoria.dto';