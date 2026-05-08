import { useEffect, useState } from 'react';

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import api from '../services/api';

// Página de detalle de producto
function ProductoDetalle() {
    // ID obtenido desde la URL
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    // Producto cargado desde backend
    const [producto, setProducto] = useState(null);

    // Mensaje visual
    const [mensaje, setMensaje] = useState('');

    // Obtener producto al entrar
    useEffect(() => {
        const obtenerProducto = async () => {
        try {
            const res = await api.get(`/productos/${id}`);
            setProducto(res.data);
        } catch (error) {
            console.error(error);
            setMensaje('Error al cargar producto');
        }
        };

        obtenerProducto();
    }, [id]);

    // Añadir producto al carrito
    const agregarAlCarrito = async () => {
        const token = localStorage.getItem('token');

        // Si no hay sesión se redirige al login
        if (!token) {
        navigate('/login', {
            state: { from: location },
        });

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
            error.response?.data?.mensaje ||
            'Error al añadir al carrito'
        );
        }
    };

    // Pantalla de carga
    if (!producto) {
        return <p>Cargando producto...</p>;
    }

    return (
        <main>
        {/* Botón volver */}
        <button
            className="btn-volver"
            onClick={() => navigate(-1)}
        >
            ← Volver
        </button>

        <section className="detalle-producto">

            {/* Imagen / placeholder */}
            <div className="detalle-imagen">
            <div className="placeholder-imagen">
                <div className="placeholder-contenido">
                <span>{producto.plataforma}</span>
                </div>
            </div>
            </div>

            {/* Información */}
            <div className="detalle-info">

            <p className="detalle-tipo">
                {producto.tipo_producto}
            </p>

            <h1>{producto.nombre_producto}</h1>

            <p className="detalle-plataforma">
                Plataforma: {producto.plataforma}
            </p>

            <div className="detalle-divider"></div>

            <p className="detalle-descripcion">
                {producto.descripcion_producto}
            </p>

            <div className="detalle-compra">

                <div>
                <p className="detalle-label">
                    Precio
                </p>

                <p className="detalle-precio">
                    {producto.precio} €
                </p>
                </div>

                <div>
                <p className="detalle-label">
                    Stock disponible
                </p>

                <p className="detalle-stock">
                    {producto.stock}
                </p>
                </div>

            </div>

            <button
                className="btn-comprar"
                onClick={agregarAlCarrito}
            >
                Añadir al carrito
            </button>

            {/* Mensaje */}
            {mensaje && (
                <p className="mensaje-producto">
                {mensaje}
                </p>
            )}

            </div>
        </section>
        </main>
    );
}

export default ProductoDetalle;