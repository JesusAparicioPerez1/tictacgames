import nintendo from '../assets/imagenes/nintendo.png';
import playstation from '../assets/imagenes/playstation.png';
import xbox from '../assets/imagenes/xbox.jpg';
import pc from '../assets/imagenes/PC.png';
import defecto from '../assets/imagenes/default.jpg';

// Devuelve una imagen según la plataforma
const obtenerImagenProducto = (plataforma) => {
    switch (plataforma?.toLowerCase()) {
        case 'nintendo':
        return nintendo;

        case 'playstation':
        return playstation;

        case 'xbox':
        return xbox;

        case 'pc':
        return pc;

        default:
        return defecto;
    }
};

export default obtenerImagenProducto;