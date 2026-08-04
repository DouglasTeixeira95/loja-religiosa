'use server'

import { supabase } from '@/lib/supabase'

type CartItem = {
  id: string
  code: string
  name: string
  price: number
  qty: number
}

export async function finalizarVenda(
  cart: CartItem[], 
  paymentMethod: string, 
  customerId?: string
) {
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0)

  // 1. Criar a Venda (Sale)
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert([{
      total_amount: totalAmount,
      payment_method: paymentMethod,
      customer_id: customerId || null
    }])
    .select()
    .single()

  if (saleError) {
    console.error('Erro ao criar venda:', saleError)
    return { success: false, error: saleError.message }
  }

  // 2. Inserir os Itens da Venda
  const saleItems = cart.map(item => ({
    sale_id: sale.id,
    product_id: item.id, // Aqui na vida real precisa ser o UUID do produto no banco
    quantity: item.qty,
    unit_price: item.price,
    total_price: item.price * item.qty
  }))

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems)

  if (itemsError) {
    console.error('Erro ao inserir itens da venda:', itemsError)
    return { success: false, error: itemsError.message }
  }

  // Se for crediário, cria a dívida na conta do cliente
  if (paymentMethod === 'CREDIARIO' && customerId) {
    const { error: accountError } = await supabase
      .from('customer_accounts')
      .insert([{
        customer_id: customerId,
        amount: totalAmount,
        type: 'DEBITO',
        sale_id: sale.id,
        notes: 'Venda via PDV'
      }])
      
    if (accountError) console.error('Erro ao lançar no crediário:', accountError)
  }

  return { success: true, data: sale }
}
