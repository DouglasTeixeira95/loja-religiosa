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

  const salePayload: any = {
    total_amount: totalAmount,
    payment_method: paymentMethod,
  }
  
  if (customerId) {
    salePayload.customer_id = customerId
  }

  // 1. Criar a Venda (Sale)
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert([salePayload])
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

  // 3. Subtrair o Estoque dos Produtos
  for (const item of cart) {
    // Busca a quantidade atual
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.id)
      .single()
      
    if (productData && !productError) {
      const newStock = productData.stock_quantity - item.qty
      await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', item.id)
    }
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

export async function listarVendas() {
  const { data: sales, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        quantity,
        unit_price,
        total_price,
        products ( description )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Erro detalhado ao listar vendas:', JSON.stringify(error, null, 2))
    return []
  }

  // Busca os clientes separadamente para evitar erro de Foreign Key no Supabase
  const { data: customers } = await supabase.from('customers').select('id, name')
  const customersMap = new Map(customers?.map(c => [c.id, c.name]) || [])

  const salesWithCustomers = sales?.map(sale => ({
    ...sale,
    customers: {
      name: sale.customer_id ? customersMap.get(sale.customer_id) : undefined
    }
  })) || []

  return salesWithCustomers
}
