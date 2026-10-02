// api/_supabase.ts

// Importa a função createClient para criar o cliente Supabase e o tipo SupabaseClient para tipagem.
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;
/* Declara uma variável client que armazena a instância do Supabase, inicialmente nula. 
   Funcionando como um singleton para evitar múltiplas instâncias do cliente Supabase.
   O singleton é importante para garantir que apenas uma instância do cliente Supabase seja criada 
   e reutilizada em todas as requisições.
*/

// Cria (uma única vez) o client Supabase usado pelas serverless functions. 
export function getSupabaseClient(): SupabaseClient {
 // Se ainda não houver um client, cria um novo.
  if (!client) { 
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    // Se as variáveis de ambiente SUPABASE_URL ou SUPABASE_KEY não estiverem configuradas, lança um erro.
    if (!url || !key) { 
      throw new Error('Variáveis SUPABASE_URL / SUPABASE_KEY não configuradas.');
    }

    // Cria o client Supabase com a URL e a chave fornecidas.
    client = createClient(url, key);
  }
  return client;
}

