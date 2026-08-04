'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function criarCliente(data: {
  name: string
  phone?: string
  address?: string
  cpf?: string
}) {
  const { data: cliente, error } = await supabase
    .from('customers')
    .insert([
      {
        name: data.name,
        phone: data.phone,
        address: data.address,
        cpf: data.cpf
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar cliente:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/clientes')
  return { success: true, data: cliente }
}

export async function listarClientes() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Erro ao buscar clientes:', error)
    return []
  }

  return data || []
}
