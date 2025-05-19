
import { SupportedLanguage } from "@/context/LanguageContext";

export type { SupportedLanguage };

export type TranslationKeys = {
  header: {
    storeDate: string;
    adminLogin: string;
  };
  product: {
    available: string;
    reserved: string;
    sold: string;
    reference: string;
    price: string;
    status: string;
    category: string;
    addToCart: string;
    viewDetails: string;
    notAvailable: string;
  };
  catalog: {
    searchProducts: string;
    searchPlaceholder: string;
    category: string;
    status: string;
    allCategories: string;
    allStatus: string;
    noProducts: string;
  };
  admin: {
    signOut: string;
    backToCatalog: string;
  };
};

const translations: Record<SupportedLanguage, TranslationKeys> = {
  en: {
    header: {
      storeDate: "Today is",
      adminLogin: "Admin Login",
    },
    product: {
      available: "Available",
      reserved: "Reserved",
      sold: "Sold",
      reference: "Ref",
      price: "Price",
      status: "Status",
      category: "Category",
      addToCart: "Add to Cart",
      viewDetails: "View Details",
      notAvailable: "Not Available",
    },
    catalog: {
      searchProducts: "Search Products",
      searchPlaceholder: "Search by name or reference...",
      category: "Category",
      status: "Status",
      allCategories: "All Categories",
      allStatus: "All Status",
      noProducts: "No products found",
    },
    admin: {
      signOut: "Sign Out",
      backToCatalog: "Back to Catalog",
    },
  },
  es: {
    header: {
      storeDate: "Hoy es",
      adminLogin: "Acceso Admin",
    },
    product: {
      available: "Disponible",
      reserved: "Reservado",
      sold: "Vendido",
      reference: "Ref",
      price: "Precio",
      status: "Estado",
      category: "Categoría",
      addToCart: "Añadir al Carrito",
      viewDetails: "Ver Detalles",
      notAvailable: "No Disponible",
    },
    catalog: {
      searchProducts: "Buscar Productos",
      searchPlaceholder: "Buscar por nombre o referencia...",
      category: "Categoría",
      status: "Estado",
      allCategories: "Todas las Categorías",
      allStatus: "Todos los Estados",
      noProducts: "No se encontraron productos",
    },
    admin: {
      signOut: "Cerrar Sesión",
      backToCatalog: "Volver al Catálogo",
    },
  },
  fr: {
    header: {
      storeDate: "Aujourd'hui est",
      adminLogin: "Admin Connexion",
    },
    product: {
      available: "Disponible",
      reserved: "Réservé",
      sold: "Vendu",
      reference: "Réf",
      price: "Prix",
      status: "État",
      category: "Catégorie",
      addToCart: "Ajouter au Panier",
      viewDetails: "Voir Détails",
      notAvailable: "Non Disponible",
    },
    catalog: {
      searchProducts: "Rechercher des Produits",
      searchPlaceholder: "Rechercher par nom ou référence...",
      category: "Catégorie",
      status: "État",
      allCategories: "Toutes les Catégories",
      allStatus: "Tous les États",
      noProducts: "Aucun produit trouvé",
    },
    admin: {
      signOut: "Déconnexion",
      backToCatalog: "Retour au Catalogue",
    },
  },
  de: {
    header: {
      storeDate: "Heute ist",
      adminLogin: "Admin Login",
    },
    product: {
      available: "Verfügbar",
      reserved: "Reserviert",
      sold: "Verkauft",
      reference: "Ref",
      price: "Preis",
      status: "Status",
      category: "Kategorie",
      addToCart: "In den Warenkorb",
      viewDetails: "Details Ansehen",
      notAvailable: "Nicht Verfügbar",
    },
    catalog: {
      searchProducts: "Produkte Suchen",
      searchPlaceholder: "Nach Name oder Referenz suchen...",
      category: "Kategorie",
      status: "Status",
      allCategories: "Alle Kategorien",
      allStatus: "Alle Status",
      noProducts: "Keine Produkte gefunden",
    },
    admin: {
      signOut: "Abmelden",
      backToCatalog: "Zurück zum Katalog",
    },
  },
  it: {
    header: {
      storeDate: "Oggi è",
      adminLogin: "Accesso Admin",
    },
    product: {
      available: "Disponibile",
      reserved: "Riservato",
      sold: "Venduto",
      reference: "Rif",
      price: "Prezzo",
      status: "Stato",
      category: "Categoria",
      addToCart: "Aggiungi al Carrello",
      viewDetails: "Vedi Dettagli",
      notAvailable: "Non Disponibile",
    },
    catalog: {
      searchProducts: "Cerca Prodotti",
      searchPlaceholder: "Cerca per nome o riferimento...",
      category: "Categoria",
      status: "Stato",
      allCategories: "Tutte le Categorie",
      allStatus: "Tutti gli Stati",
      noProducts: "Nessun prodotto trovato",
    },
    admin: {
      signOut: "Disconnetti",
      backToCatalog: "Torna al Catalogo",
    },
  },
};

export default translations;
