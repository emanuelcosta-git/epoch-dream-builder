// Configuração temporária para SQLite
console.log('⚠️  Usando SQLite temporariamente - Configure Supabase depois');

// Mock do Supabase para compatibilidade
const mockSupabase = {
  from: (table) => ({
    select: () => Promise.resolve({ data: [] }),
    insert: () => Promise.resolve({ data: [] }),
    update: () => Promise.resolve({ data: [] }),
    delete: () => Promise.resolve({ data: [] }),
    upsert: () => Promise.resolve({ data: [] })
  })
};

module.exports = mockSupabase;
