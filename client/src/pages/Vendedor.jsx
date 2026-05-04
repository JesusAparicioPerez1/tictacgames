import { useEffect, useState } from 'react';
import api from '../services/api';

// Página para que el vendedor cree y gestione sus productos
function Vendedor() {
    // Estado del formulario
    const [form, setForm] = useState({
        nombre_producto: '',
        descripcion_producto: '',
        precio: '',
        stock: '',
        tipo_producto: '',
        plataforma: '',
    });

    // Lista de productos del vendedor
    const [productos, setProductos] = useState([]);

    // Mensaje de estado
    const [mensaje, setMensaje] = useState('');

    // Obtener productos del vendedor (IMPORTANTE: va antes de useEffect)
    const obtenerMisProductos = async () => {
        try {
        const token = localStorage.getItem('token');

        const res = await api.get('/productos/mis-productos', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setProductos(res.data);
        } catch (error) {
        console.error(error);
        }
    };
    
    // Cargar productos al entrar en la página
    useEffect(() => {
        const cargarProductos = async () => {
            await obtenerMisProductos();
        };

        cargarProductos();
        }, []);

    // Manejo de inputs del formulario
    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    // Crear producto
    const crearProducto = async (e) => {
        e.preventDefault();

        try {
        const token = localStorage.getItem('token');

        const producto = {
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock),
        };

        await api.post('/productos', producto, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setMensaje('Producto creado correctamente');

        // Recargar productos
        obtenerMisProductos();

        // Limpiar formulario
        setForm({
            nombre_producto: '',
            descripcion_producto: '',
            precio: '',
            stock: '',
            tipo_producto: '',
            plataforma: '',
        });
        } catch (error) {
        console.error(error);
        setMensaje('Error al crear producto');
        }
    };

    // Eliminar producto
    const eliminarProducto = async (id) => {
        try {
        const token = localStorage.getItem('token');

        await api.delete(`/productos/${id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setMensaje('Producto eliminado');

        // Recargar productos
        obtenerMisProductos();
        } catch (error) {
        console.error(error);
        setMensaje('Error al eliminar producto');
        }
    };

    return (
        <main>
        <h2>Panel Vendedor</h2>

        {/* Mensaje */}
        {mensaje && <p>{mensaje}</p>}

        {/* FORMULARIO */}
        <form onSubmit={crearProducto}>
            <input
            type="text"
            name="nombre_producto"
            value={form.nombre_producto}
            onChange={handleChange}
            placeholder="Nombre"
            required
            />

            <input
            type="text"
            name="descripcion_producto"
            value={form.descripcion_producto}
            onChange={handleChange}
            placeholder="Descripción"
            />

            <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="Precio (€)"
            required
            />

            <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            step="1"
            min="0"
            placeholder="Stock"
            required
            />

            <select
            name="tipo_producto"
            value={form.tipo_producto}
            onChange={handleChange}
            required
            >
            <option value="">Tipo</option>
            <option value="videojuego">Videojuego</option>
            <option value="dlc">DLC</option>
            <option value="tarjeta">Tarjeta</option>
            </select>

            <select
            name="plataforma"
            value={form.plataforma}
            onChange={handleChange}
            required
            >
            <option value="">Plataforma</option>
            <option value="Nintendo">Nintendo</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="PC">PC</option>
            </select>

            <button type="submit">Crear producto</button>
        </form>

        {/* LISTADO DE PRODUCTOS */}
        <h3>Mis productos</h3>

        {productos.map((p) => (
            <div key={p.cod_producto}>
            <p>
                {p.nombre_producto} - {p.precio}€
            </p>

            <button onClick={() => eliminarProducto(p.cod_producto)}>
                Eliminar
            </button>
            </div>
        ))}
        </main>
    );
}

export default Vendedor;