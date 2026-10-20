'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

const SUPPLIER_SEPARATOR = ' || FORN:'

function packDescriptionWithSupplier(description: string, supplier?: string) {
  const cleanDesc = (description || '').split(SUPPLIER_SEPARATOR)[0].trim()
  const cleanSupplier = (supplier || '').trim()
  return cleanSupplier ? `${cleanDesc}${SUPPLIER_SEPARATOR}${cleanSupplier}` : cleanDesc
}

function unpackProduct(product: any) {
  if (!product) return product
  const rawDesc = String(product.description || '')
  if (rawDesc.includes(SUPPLIER_SEPARATOR)) {
    const [cleanDesc, supplierPart] = rawDesc.split(SUPPLIER_SEPARATOR)
    return {
      ...product,
      description: cleanDesc.trim(),
      supplier: (supplierPart || '').trim(),
    }
  }
  return {
    ...product,
    supplier: product.supplier || '',
  }
}

export async function criarProduto(data: {
  code: string
  description: string
  supplier?: string
  stock_quantity: number
  size?: string
  cost_price?: number
  unit_price: number
  box_price: number
}) {
  const { data: produto, error } = await supabase
    .from('products')
    .insert([
      {
        code: data.code,
        description: packDescriptionWithSupplier(data.description, data.supplier),
        stock_quantity: data.stock_quantity,
        size: data.size,
        unit_price: data.unit_price,
        box_price: data.box_price,
        cost_price: data.cost_price ?? 0
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar produto:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/produtos')
  return { success: true, data: unpackProduct(produto) }
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

  return (data || []).map(unpackProduct)
}

export async function atualizarProduto(id: string, data: any) {
  const { supplier, ...rest } = data
  const payload = {
    ...rest,
    description: packDescriptionWithSupplier(data.description, supplier),
  }

  const { error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar produto:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/produtos')
  return { success: true }
}

export async function buscarProdutoPorId(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar produto por ID:', error)
    return null
  }
  
  return unpackProduct(data)
}

export async function buscarProduto(term: string) {
  // Tenta buscar por código exato primeiro, ou parte da descrição
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`code.ilike.%${term}%,description.ilike.%${term}%`)
    .limit(1)

  if (error || !data || data.length === 0) {
    return { success: false, error: 'Produto não encontrado no banco de dados.' }
  }

  return { success: true, data: unpackProduct(data[0]) }
}

export async function excluirProduto(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir produto:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/produtos')
  return { success: true }
}
