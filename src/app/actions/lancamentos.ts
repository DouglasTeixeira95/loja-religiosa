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
  productId?: string
  addedQuantity?: number
  newCostPrice?: number
}) {
  // 1. Se tiver um produto vinculado na compra de estoque, soma a quantidade e atualiza o custo
  if (data.type === 'COMPRA_ESTOQUE' && data.productId && data.addedQuantity && data.addedQuantity > 0) {
    const { data: prod, error: prodFetchErr } = await supabase
      .from('products')
      .select('stock_quantity, cost_price')
      .eq('id', data.productId)
      .single()

    if (!prodFetchErr && prod) {
      const novoEstoque = Number(prod.stock_quantity || 0) + Number(data.addedQuantity)
      const updatePayload: { stock_quantity: number; cost_price?: number } = {
        stock_quantity: novoEstoque,
      }
      if (typeof data.newCostPrice === 'number' && !isNaN(data.newCostPrice) && data.newCostPrice > 0) {
        updatePayload.cost_price = data.newCostPrice
      }

      const { error: prodUpdateErr } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', data.productId)

      if (prodUpdateErr) {
        console.error('Erro ao atualizar estoque do produto:', prodUpdateErr)
        return { success: false, error: 'Erro ao somar estoque do produto: ' + prodUpdateErr.message }
      }
    }
  }

  // 2. Registra o lançamento financeiro
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
  revalidatePath('/produtos')
  revalidatePath('/dashboard')
  return { success: true, data: lancamento }
}

export async function excluirLancamento(id: string) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir lançamento:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/lancamentos')
  return { success: true }
}
