import { useEffect, useState } from 'react';
import api from '../services/api';

function Tienda() {
    // Estado para guardar los productos obtenidos del backend
    const [productos, setProductos] = useState([]);

    // Estado para mostrar mensajes de error
    const [mensaje, setMensaje] = useState('');

    // Se ejecuta al cargar la página para obtener los productos
    useEffect(() => {
        const obtenerProductos = async () => {
            try {
            // Petición GET al backend
            const res = await api.get('/productos');

            // Guardamos los productos en el estado
            setProductos(res.data);
            } catch (error) {
                console.error(error);
                setMensaje('Error al cargar productos');
            }
        };

    obtenerProductos();
    }, []);

    return (
        <main>
        <h2>Tienda</h2>

        {/* Mensaje de error si existe */}
        {mensaje && <p>{mensaje}</p>}

        <div>
            {/* Recorremos los productos y los mostramos */}
            {productos.map((producto) => (
            <div key={producto.cod_producto}>
                <h3>{producto.nombre_producto}</h3>

                <p>{producto.descripcion_producto}</p>

                <p>Precio: {producto.precio} €</p>

                <p>Categorías: {producto.categorias}</p>
            </div>
            ))}
        </div>
        </main>
    );
}

export default Tienda;