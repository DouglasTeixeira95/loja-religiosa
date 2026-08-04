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
  return { success: true }
}

export async function buscarClienteComCrediario(id: string) {
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (customerError) return null

  const { data: accounts } = await supabase
    .from('customer_accounts')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })

  const debitos = accounts?.filter(a => a.type === 'DEBITO') || []
  const creditos = accounts?.filter(a => a.type === 'CREDITO') || []
  
  const totalDebito = debitos.reduce((acc, curr) => acc + curr.amount, 0)
  const totalCredito = creditos.reduce((acc, curr) => acc + curr.amount, 0)
  const saldoDevedor = totalDebito - totalCredito

  return {
    ...customer,
    accounts: accounts || [],
    saldoDevedor: saldoDevedor > 0 ? saldoDevedor : 0
  }
}

export async function registrarPagamentoCrediario(customerId: string, amount: number, notes?: string) {
  const { error } = await supabase
    .from('customer_accounts')
    .insert([{
      customer_id: customerId,
      amount: amount,
      type: 'CREDITO',
      notes: notes || 'Pagamento avulso'
    }])

  if (error) return { success: false, error: error.message }
  return { success: true }
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
