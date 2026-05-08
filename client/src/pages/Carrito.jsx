import { useEffect, useState } from 'react';
import api from '../services/api';

// Página del carrito del usuario registrado
function Carrito() {
    // Productos añadidos al carrito
    const [carrito, setCarrito] = useState([]);

    // Mensaje de estado
    const [mensaje, setMensaje] = useState('');

    // Cargar carrito al entrar en la página
    useEffect(() => {
        const obtenerCarrito = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await api.get('/carrito', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            setCarrito(res.data.carrito);
        } catch (error) {
            console.error(error);
            setMensaje('Error al cargar el carrito');
        }
        };

        obtenerCarrito();
    }, []);

    // Calcula el total del carrito
    const totalCarrito = carrito.reduce((total, item) => {
        return total + Number(item.precio_unitario) * Number(item.cantidad);
    }, 0);

    // Confirma el pedido y vacía el carrito
    const confirmarPedido = async () => {
        try {
        const token = localStorage.getItem('token');

        const res = await api.post(
            '/carrito/confirmar',
            {},
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        setMensaje(`Pedido creado correctamente (ID: ${res.data.cod_pedido})`);
        setCarrito([]);
        } catch (error) {
        console.error(error);
        setMensaje(
            error.response?.data?.mensaje || 'Error al confirmar pedido'
        );
        }
    };

    return (
        <main>
        <h2>Carrito</h2>

        {/* Mensaje de estado */}
        {mensaje && <p className="mensaje-producto">{mensaje}</p>}

        {carrito.length === 0 ? (
            <div className="carrito-vacio">
            <h3>El carrito está vacío</h3>
            <p>Añade productos desde la tienda para poder finalizar tu compra.</p>
            </div>
        ) : (
            <section className="carrito-layout">
            {/* Lista de productos */}
            <div className="carrito-lista">
                {carrito.map((item) => (
                <div key={item.cod_producto} className="carrito-item">
                    <div className="carrito-imagen">
                    Producto
                    </div>

                    <div className="carrito-info">
                    <h3>{item.nombre_producto}</h3>
                    <p>Cantidad: {item.cantidad}</p>
                    <p>Precio unitario: {item.precio_unitario} €</p>
                    </div>

                    <div className="carrito-subtotal">
                    <p>
                        {(Number(item.precio_unitario) * Number(item.cantidad)).toFixed(2)} €
                    </p>
                    </div>
                </div>
                ))}
            </div>

            {/* Resumen del pedido */}
            <aside className="carrito-resumen">
                <h3>Resumen</h3>

                <div className="resumen-linea">
                <span>Productos</span>
                <span>{carrito.length}</span>
                </div>

                <div className="resumen-linea total">
                <span>Total</span>
                <span>{totalCarrito.toFixed(2)} €</span>
                </div>

                <button
                className="btn-comprar"
                onClick={confirmarPedido}
                >
                Finalizar compra
                </button>
            </aside>
            </section>
        )}
        </main>
    );
}

export default Carrito;