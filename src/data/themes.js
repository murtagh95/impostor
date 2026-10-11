export const THEMES = [
  {
    id: 'alimentos',
    name: 'Alimentos',
    emoji: '🍕',
    words: [
      'Pizza', 'Hamburguesa', 'Empanada', 'Asado', 'Milanesa', 'Ñoquis', 'Sushi',
      'Helado', 'Chocolate', 'Banana', 'Manzana', 'Frutilla', 'Sandía', 'Palta',
      'Tomate', 'Zanahoria', 'Papa frita', 'Queso', 'Dulce de leche', 'Alfajor',
      'Medialuna', 'Tostada', 'Huevo frito', 'Arroz', 'Fideos', 'Pochoclo',
      'Taco', 'Ensalada', 'Sopa', 'Panqueque', 'Torta', 'Choripán',
    ],
  },
  {
    id: 'halloween',
    name: 'Halloween',
    emoji: '🎃',
    words: [
      'Calabaza', 'Fantasma', 'Bruja', 'Vampiro', 'Momia', 'Zombie', 'Esqueleto',
      'Murciélago', 'Telaraña', 'Araña', 'Caldero', 'Escoba', 'Gato negro',
      'Lápida', 'Cementerio', 'Hombre lobo', 'Frankenstein', 'Caramelos',
      'Disfraz', 'Máscara', 'Castillo embrujado', 'Calavera', 'Vela', 'Luna llena',
      'Ataúd', 'Hechizo', 'Poción', 'Búho', 'Linterna', 'Diablo',
    ],
  },
  {
    id: 'cosas',
    name: 'Cosas',
    emoji: '📦',
    words: [
      'Silla', 'Mesa', 'Lámpara', 'Reloj', 'Paraguas', 'Llave', 'Tijera',
      'Espejo', 'Almohada', 'Cepillo de dientes', 'Celular', 'Televisor',
      'Heladera', 'Microondas', 'Bicicleta', 'Auto', 'Guitarra', 'Pelota',
      'Anteojos', 'Billetera', 'Martillo', 'Escalera', 'Ventilador', 'Control remoto',
      'Taza', 'Botella', 'Vela', 'Cuchara', 'Sartén', 'Auriculares',
    ],
  },
  {
    id: 'escuela',
    name: 'Escuela',
    emoji: '🏫',
    words: [
      'Pizarrón', 'Tiza', 'Mochila', 'Cuaderno', 'Lápiz', 'Goma de borrar',
      'Regla', 'Cartuchera', 'Sacapuntas', 'Compás', 'Calculadora', 'Maestra',
      'Director', 'Recreo', 'Examen', 'Boletín', 'Tarea', 'Biblioteca',
      'Pupitre', 'Guardapolvo', 'Timbre', 'Patio', 'Mapa', 'Globo terráqueo',
      'Diccionario', 'Educación física', 'Matemática', 'Acto escolar', 'Fotocopia',
      'Abanderado',
    ],
  },
  {
    id: 'moda',
    name: 'Moda y ropa',
    emoji: '👗',
    words: [
      'Remera', 'Pantalón', 'Jean', 'Pollera', 'Vestido', 'Campera', 'Buzo',
      'Camisa', 'Corbata', 'Traje', 'Zapatillas', 'Botas', 'Ojotas', 'Sandalias',
      'Gorra', 'Sombrero', 'Bufanda', 'Guantes', 'Medias', 'Cinturón', 'Cartera',
      'Collar', 'Aros', 'Pulsera', 'Anillo', 'Malla', 'Pijama', 'Tacos',
      'Lentes de sol', 'Pasarela',
    ],
  },
  {
    id: 'trabajo',
    name: 'Trabajo',
    emoji: '💼',
    words: [
      'Oficina', 'Jefe', 'Reunión', 'Computadora', 'Teclado', 'Impresora',
      'Correo electrónico', 'Sueldo', 'Vacaciones', 'Entrevista', 'Currículum',
      'Escritorio', 'Café', 'Presentación', 'Planilla', 'Contrato', 'Ascenso',
      'Home office', 'Horas extra', 'Cliente', 'Proyecto', 'Calendario',
      'Videollamada', 'Abogado', 'Médico', 'Bombero', 'Policía', 'Cocinero',
      'Albañil', 'Docente',
    ],
  },
  {
    id: 'verano',
    name: 'Verano',
    emoji: '☀️',
    words: [
      'Playa', 'Pileta', 'Sol', 'Arena', 'Mar', 'Ola', 'Sombrilla', 'Protector solar',
      'Reposera', 'Castillo de arena', 'Helado', 'Ojotas', 'Malla', 'Toalla',
      'Pelota de playa', 'Surf', 'Barrilete', 'Vacaciones', 'Camping', 'Carpa',
      'Ventilador', 'Aire acondicionado', 'Limonada', 'Sandía', 'Flotador',
      'Gaviota', 'Caracol', 'Bronceado', 'Mosquito', 'Pileta inflable',
    ],
  },
]

export const getTheme = (id) => THEMES.find((t) => t.id === id)
