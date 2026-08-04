'use server'

import { supabase } from '@/lib/supabase'

export async function buscarEstatisticasDashboard() {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  // 1. Vendas de hoje (Receita Mensal)
  const { data: vendasHoje, error: vendasHojeError } = await supabase
    .from('sales')
    .select('total_amount, payment_method, created_at')
    .gte('created_at', hoje.toISOString())
    .neq('payment_method', 'ORCAMENTO')

  const totalVendasHoje = vendasHoje?.reduce((acc, venda) => acc + venda.total_amount, 0) || 0
  const qtdVendasHoje = vendasHoje?.length || 0

  // 2. Contas em Aberto (Crediário)
  const { data: accounts, error: accountsError } = await supabase
    .from('customer_accounts')
    .select('amount, type')

  const debitos = accounts?.filter(a => a.type === 'DEBITO').reduce((acc, curr) => acc + curr.amount, 0) || 0
  const creditos = accounts?.filter(a => a.type === 'CREDITO').reduce((acc, curr) => acc + curr.amount, 0) || 0
  const contasAberto = (debitos - creditos) > 0 ? (debitos - creditos) : 0

  // 3. Total de Produtos e Estoque Baixo
  const { data: produtos } = await supabase
    .from('products')
    .select('id, stock_quantity')
  
  const totalProdutos = produtos?.length || 0
  const estoqueBaixo = produtos?.filter(p => p.stock_quantity <= 5).length || 0

  return {
    vendasHoje: totalVendasHoje,
    qtdVendasHoje,
    contasAberto,
    totalProdutos,
    estoqueBaixo,
    // Aqui poderiamos buscar histórico pra montar os gráficos
  }
}
