const translations = {
  es: {
    sidebar: {
      dashboard: 'Dashboard',
      dids: 'Números (DIDs)',
      trunks: 'Troncales SIP',
      calls: 'Llamadas Activas',
      agents: 'Agentes de Voz (n8n)',
      insights: 'Analíticas',
    },
    didsPage: {
      title: 'Gestionar Números (DIDs)',
      description: 'Busca, aprovisiona y configura el enrutamiento de tus números de teléfono.',
      filterPlaceholder: 'Filtrar por número...',
      addDid: 'Añadir DID',
      table: {
        number: 'Número de Teléfono',
        country: 'País',
        status: 'Estado',
        routing: 'Enrutamiento',
        actions: 'Acciones',
      },
      addModal: {
        title: 'Añadir Nuevo DID',
        description: 'Ingresa los detalles de tu número. Será validado y aprovisionado.',
        phoneNumber: 'Número de Teléfono',
        phoneNumberPlaceholder: '+525512345678',
        country: 'País',
        cancel: 'Cancelar',
        save: 'Guardar DID',
      }
    },
  },
  en: {
    sidebar: {
        dashboard: 'Dashboard',
        dids: 'Numbers (DIDs)',
        trunks: 'SIP Trunks',
        calls: 'Active Calls',
        agents: 'Voice Agents (n8n)',
        insights: 'Insights',
    },
    didsPage: {
      title: 'Manage Numbers (DIDs)',
      description: 'Search, provision, and configure routing for your phone numbers.',
      filterPlaceholder: 'Filter by number...',
      addDid: 'Add DID',
       table: {
        number: 'Phone Number',
        country: 'Country',
        status: 'Status',
        routing: 'Routing',
        actions: 'Actions',
      },
       addModal: {
        title: 'Add New DID',
        description: 'Enter your number details. It will be validated and provisioned.',
        phoneNumber: 'Phone Number',
        phoneNumberPlaceholder: '+12025550104',
        country: 'Country',
        cancel: 'Cancel',
        save: 'Save DID',
      }
    },
  }
};

// For this demo, we'll default to Spanish 'es'
export const t = translations.es;
