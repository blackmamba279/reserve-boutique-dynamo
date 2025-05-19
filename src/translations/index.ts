
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it';

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
    },
    language: {
      select: 'Language'
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
    },
    language: {
      select: 'Idioma'
    }
  },
  fr: {
    header: {
      storeDate: 'Aujourd\'hui c\'est',
      adminLogin: 'Connexion Admin'
    },
    product: {
      available: 'Disponible',
      reserved: 'Réservé',
      sold: 'Vendu',
      reference: 'Réf',
      reserveNow: 'Réserver Maintenant',
      yourName: 'Votre Nom',
      yourPhone: 'Votre Numéro de Téléphone',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      nameRequired: 'Veuillez fournir votre nom et numéro de téléphone'
    },
    catalog: {
      searchProducts: 'Rechercher des Produits',
      searchPlaceholder: 'Rechercher par nom ou référence...',
      category: 'Catégorie',
      allCategories: 'Toutes les Catégories',
      status: 'Statut',
      allStatus: 'Tous les Statuts',
      noProducts: 'Aucun produit trouvé'
    },
    whatsapp: {
      reservationMessage: 'Bonjour! Je suis intéressé à réserver ce produit:\n\nRéférence: {reference}\nNom: {name}\nPrix: C$ {price} ($ {dollarPrice})\n\nMon nom: {customerName}\nMon téléphone: {customerPhone}\n\nVeuillez confirmer cette réservation. Merci!'
    },
    language: {
      select: 'Langue'
    }
  },
  de: {
    header: {
      storeDate: 'Heute ist',
      adminLogin: 'Admin-Login'
    },
    product: {
      available: 'Verfügbar',
      reserved: 'Reserviert',
      sold: 'Verkauft',
      reference: 'Ref',
      reserveNow: 'Jetzt Reservieren',
      yourName: 'Ihr Name',
      yourPhone: 'Ihre Telefonnummer',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      nameRequired: 'Bitte geben Sie Ihren Namen und Ihre Telefonnummer an'
    },
    catalog: {
      searchProducts: 'Produkte Suchen',
      searchPlaceholder: 'Nach Name oder Referenz suchen...',
      category: 'Kategorie',
      allCategories: 'Alle Kategorien',
      status: 'Status',
      allStatus: 'Alle Status',
      noProducts: 'Keine Produkte gefunden'
    },
    whatsapp: {
      reservationMessage: 'Hallo! Ich interessiere mich für die Reservierung dieses Produkts:\n\nReferenz: {reference}\nName: {name}\nPreis: C$ {price} ($ {dollarPrice})\n\nMein Name: {customerName}\nMein Telefon: {customerPhone}\n\nBitte bestätigen Sie diese Reservierung. Danke!'
    },
    language: {
      select: 'Sprache'
    }
  },
  it: {
    header: {
      storeDate: 'Oggi è',
      adminLogin: 'Accesso Admin'
    },
    product: {
      available: 'Disponibile',
      reserved: 'Riservato',
      sold: 'Venduto',
      reference: 'Rif',
      reserveNow: 'Prenota Ora',
      yourName: 'Il Tuo Nome',
      yourPhone: 'Il Tuo Numero di Telefono',
      cancel: 'Annulla',
      confirm: 'Conferma',
      nameRequired: 'Si prega di fornire il proprio nome e numero di telefono'
    },
    catalog: {
      searchProducts: 'Cerca Prodotti',
      searchPlaceholder: 'Cerca per nome o riferimento...',
      category: 'Categoria',
      allCategories: 'Tutte le Categorie',
      status: 'Stato',
      allStatus: 'Tutti gli Stati',
      noProducts: 'Nessun prodotto trovato'
    },
    whatsapp: {
      reservationMessage: 'Ciao! Sono interessato a prenotare questo prodotto:\n\nRiferimento: {reference}\nNome: {name}\nPrezzo: C$ {price} ($ {dollarPrice})\n\nIl mio nome: {customerName}\nIl mio telefono: {customerPhone}\n\nPer favore conferma questa prenotazione. Grazie!'
    },
    language: {
      select: 'Lingua'
    }
  }
};
