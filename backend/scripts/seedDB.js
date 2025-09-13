// /scripts/seedDB.js
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import {
  Administrador,
  Cliente,
  Categoria,
  Producto,
  Rol,  
  AdministradorRol,
  ClienteRol,  
  MetodoPago,
  CuponDescuento,
} from '../src/models/index.js';
import { fileURLToPath } from 'url';

dotenv.config();

async function seedDatabase() {
  try {
    // =============================
    // 1. Crear administrador inicial
    // =============================
    let admin = await Administrador.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!admin) {
      const adminPassword = await bcrypt.hash('Admin1234', 10);
      admin = await Administrador.create({
        nombre: 'Admin',
        apellido: 'Admin',
        telefono: '1212121212',
        email: 'admin@example.com',
        contrasena: adminPassword,
        activo: true,
      });
    }

    // =============================
    // 2. Crear roles
    // =============================
    const rolesData = [
      {
        codigo: 'ADMIN',
        descripcion: 'Administrador del sistema',
        activo: true,
      },
      { codigo: 'CLIENTE', descripcion: 'Cliente registrado', activo: true },
      { codigo: 'DISENADOR', descripcion: 'Diseñador gráfico', activo: true },
      {
        codigo: 'INVITADO',
        descripcion: 'Usuario no registrado',
        activo: true,
      },
    ];

    const roles = [];
    for (const rol of rolesData) {
      const [rolDb] = await Rol.findOrCreate({
        where: { codigo: rol.codigo },
        defaults: rol,
      });
      roles.push(rolDb);
    }

    const rolAdmin = roles.find((r) => r.codigo === 'ADMIN');
    const rolCliente = roles.find((r) => r.codigo === 'CLIENTE');
    const rolDisenador = roles.find((r) => r.codigo === 'DISENADOR');
    const rolInvitado = roles.find((r) => r.codigo === 'INVITADO');

    // =============================
    // 3. Asociar admin a rol ADMIN
    // =============================
    await AdministradorRol.findOrCreate({
      where: { idAdministrador: admin.id, idRol: rolAdmin.id },
      defaults: { idAdministrador: admin.id, idRol: rolAdmin.id },
    });

    // =============================
    // 4. Crear clientes y asignar rol CLIENTE
    // =============================
    const clientes = [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '1111111111',
        email: 'juan@example.com',
        contrasena: 'Cliente1234',
        idAdministrador: admin.id,
      },
      {
        nombre: 'Ana',
        apellido: 'García',
        telefono: '2222222222',
        email: 'ana@example.com',
        contrasena: 'Cliente1234',
        idAdministrador: admin.id,
      },
      {
        nombre: 'Luis',
        apellido: 'Martínez',
        telefono: '3333333333',
        email: 'luis@example.com',
        contrasena: 'Cliente1234',
        idAdministrador: admin.id,
      },
    ];

    for (const cliente of clientes) {
      let clienteDb = await Cliente.findOne({
        where: { email: cliente.email },
      });
      if (!clienteDb) {
        const hashedPassword = await bcrypt.hash(cliente.contrasena, 10);
        clienteDb = await Cliente.create({
          ...cliente,
          contrasena: hashedPassword,
          activo: true,
        });
      }

      await ClienteRol.findOrCreate({
        where: { idCliente: clienteDb.id, idRol: rolCliente.id },
        defaults: { idCliente: clienteDb.id, idRol: rolCliente.id },
      });
    }

    // =============================
    // 5. Crear categorías
    // =============================
    const categorias = [
      {
        nombre: 'Comerciales',
        imagenURL: '/cat1.jpg',
        activo: true,
        idAdministrador: admin.id,
      },
      {
        nombre: 'Escolares',
        imagenURL: '/cat4.jpg',
        activo: true,
        idAdministrador: admin.id,
      },
      {
        nombre: 'Fiestas y Eventos',
        imagenURL: '/cat2.jpg',
        activo: true,
        idAdministrador: admin.id,
      },
      {
        nombre: 'Regalos',
        imagenURL: '/cat3.jpg',
        activo: true,
        idAdministrador: admin.id,
      },
    ];

    for (const cat of categorias) {
      await Categoria.findOrCreate({
        where: { nombre: cat.nombre },
        defaults: cat,
      });
    }

    // =============================
    // 6. Crear productos desde JSON
    // =============================
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const productosPath = path.join(__dirname, './productos.json');
    const rawData = fs.readFileSync(productosPath, 'utf-8');
    const productos = JSON.parse(rawData);

    for (const prod of productos) {
      await Producto.findOrCreate({
        where: { nombre: prod.nombre },
        defaults: {
          ...prod,
          esPersonalizable: true,
          activo: true,
        },
      });
    }

    // =============================
    // 7. Crear métodos de pago
    // =============================
    const metodosPago = [
      { nombre: 'Efectivo', activo: true, idAdministrador: admin.id },
      {
        nombre: 'Transferencia Bancaria',
        activo: true,
        idAdministrador: admin.id,
      },
      { nombre: 'Mercado Pago', activo: true, idAdministrador: admin.id },
    ];

    for (const metodo of metodosPago) {
      await MetodoPago.findOrCreate({
        where: { nombre: metodo.nombre },
        defaults: metodo,
      });
    }

    // =============================
    // 8. Crear cupones de descuento de prueba
    // =============================
    const cupones = [
      {
        nombreCupon: 'Descuento de Bienvenida',
        codigoCupon: 'BIENVENIDO10',
        porcentajeDescuento: 10,
        activo: true,
        idAdministrador: admin.id,
      },
      {
        nombreCupon: 'Oferta Verano',
        codigoCupon: 'VERANO2024',
        porcentajeDescuento: 25,
        activo: true,
        idAdministrador: admin.id,
      },
    ];

    for (const cupon of cupones) {
      await CuponDescuento.findOrCreate({
        where: { codigoCupon: cupon.codigoCupon },
        defaults: cupon,
      });
    }

    console.log('✅ Base de datos poblada exitosamente!');
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    process.exit();
  }
}

seedDatabase();
