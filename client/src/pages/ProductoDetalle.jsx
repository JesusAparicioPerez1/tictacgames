import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

// Página de detalle de un producto concreto
function ProductoDetalle() {
    // Obtiene el id del producto desde la URL
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();
    // Producto cargado desde backend
    const [producto, setProducto] = useState(null);

    // Mensaje de estado o error
    const [mensaje, setMensaje] = useState('');

    // Obtiene el producto al cargar la página
    useEffect(() => {
        const obtenerProducto = async () => {
        try {
            const res = await api.get(`/productos/${id}`);
            setProducto(res.data);
        } catch (error) {
            console.error(error);
            setMensaje('Error al cargar el producto');
        }
        };

        obtenerProducto();
    }, [id]);

    // Añade el producto al carrito del usuario registrado
    const agregarAlCarrito = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', { state: { from: location } });
            return;
        }

        try {
        await api.post(
            '/carrito',
            {
            cod_producto: producto.cod_producto,
            cantidad: 1,
            },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        setMensaje('Producto añadido al carrito');
        } catch (error) {
        console.error(error);
        setMensaje(
            error.response?.data?.mensaje || 'Error al añadir al carrito'
        );
        }
    };

    if (mensaje && !producto) {
        return <p>{mensaje}</p>;
    }

    if (!producto) {
        return <p>Cargando producto...</p>;
    }

    return (
        <main>
        {/* Botón volver */}
        <button onClick={() => navigate(-1)}>
        ← Volver
        </button>

        <h2>{producto.nombre_producto}</h2>

        <div className="panel-card">
            <p>{producto.descripcion_producto}</p>
            <p>Precio: {producto.precio} €</p>
            <p>Stock: {producto.stock}</p>
            <p>Tipo: {producto.tipo_producto}</p>
            <p>Plataforma: {producto.plataforma}</p>

            <button onClick={agregarAlCarrito}>
            Añadir al carrito
            </button>
        </div>

        {mensaje && <p>{mensaje}</p>}
        </main>
    );
}

export default ProductoDetalle;