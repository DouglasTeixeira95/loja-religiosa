'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function listarLancamentos() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar lançamentos:', error)
    return []
  }

  return data || []
}

export async function criarLancamento(data: {
  description: string
  amount: number
  type: 'COMPRA_ESTOQUE' | 'DESPESA_GERAL'
}) {
  const { data: lancamento, error } = await supabase
    .from('expenses')
    .insert([
      {
        description: data.description,
        amount: data.amount,
        type: data.type,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar lançamento:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/lancamentos')
  return { success: true, data: lancamento }
}
