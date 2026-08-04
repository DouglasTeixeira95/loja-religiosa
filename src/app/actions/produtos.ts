'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function criarProduto(data: {
  code: string
  description: string
  stock_quantity: number
  size?: string
  unit_price: number
  box_price: number
}) {
  const { data: produto, error } = await supabase
    .from('products')
    .insert([
      {
        code: data.code,
        description: data.description,
        stock_quantity: data.stock_quantity,
        size: data.size,
        unit_price: data.unit_price,
        box_price: data.box_price,
        cost_price: 0 // Será atualizado futuramente com o sistema de lançamentos
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar produto:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/produtos')
  return { success: true, data: produto }
}

export async function listarProdutos() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }

  return data
}
