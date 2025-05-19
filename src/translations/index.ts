
export type SupportedLanguage = 'en' | 'es';

export const translations = {
  en: {
    header: {
      storeDate: 'Today is',
      adminLogin: 'Admin Login'
    },
    product: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
      reference: 'Ref',
      reserveNow: 'Reserve Now',
      yourName: 'Your Name',
      yourPhone: 'Your Phone Number',
      cancel: 'Cancel',
      confirm: 'Confirm',
      nameRequired: 'Please provide your name and phone number'
    },
    catalog: {
      searchProducts: 'Search Products',
      searchPlaceholder: 'Search by name or reference...',
      category: 'Category',
      allCategories: 'All Categories',
      status: 'Status',
      allStatus: 'All Status',
      noProducts: 'No products found'
    },
    whatsapp: {
      reservationMessage: 'Hello! I\'m interested in reserving this product:\n\nReference: {reference}\nName: {name}\nPrice: C$ {price} ($ {dollarPrice})\n\nMy name: {customerName}\nMy phone: {customerPhone}\n\nPlease confirm this reservation. Thank you!'
    }
  },
  es: {
    header: {
      storeDate: 'Hoy es',
      adminLogin: 'Iniciar Sesión Administrador'
    },
    product: {
      available: 'Disponible',
      reserved: 'Reservado',
      sold: 'Vendido',
      reference: 'Ref',
      reserveNow: 'Reservar Ahora',
      yourName: 'Tu Nombre',
      yourPhone: 'Tu Número de Teléfono',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      nameRequired: 'Por favor proporciona tu nombre y número de teléfono'
    },
    catalog: {
      searchProducts: 'Buscar Productos',
      searchPlaceholder: 'Buscar por nombre o referencia...',
      category: 'Categoría',
      allCategories: 'Todas las Categorías',
      status: 'Estado',
      allStatus: 'Todos los Estados',
      noProducts: 'No se encontraron productos'
    },
    whatsapp: {
      reservationMessage: '¡Hola! Estoy interesado en reservar este producto:\n\nReferencia: {reference}\nNombre: {name}\nPrecio: C$ {price} ($ {dollarPrice})\n\nMi nombre: {customerName}\nMi teléfono: {customerPhone}\n\nPor favor confirma esta reserva. ¡Gracias!'
    }
  }
};
