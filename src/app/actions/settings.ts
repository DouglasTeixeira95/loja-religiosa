'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

const LOGO_CUSTOMER_NAME = '[SYSTEM_LOGO]'

export async function getCustomLogo(): Promise<string | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('address')
    .eq('name', LOGO_CUSTOMER_NAME)
    .single()

  if (error || !data || !data.address) {
    return null
  }
  
  return data.address // Retorna a string Base64 da logo
}

export async function setCustomLogo(base64Image: string) {
  // Verifica se já existe
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('name', LOGO_CUSTOMER_NAME)
    .single()

  if (existing) {
    // Atualiza
    const { error } = await supabase
      .from('customers')
      .update({ address: base64Image })
      .eq('id', existing.id)
      
    if (error) return { success: false, error: error.message }
  } else {
    // Cria
    const { error } = await supabase
      .from('customers')
      .insert([{ 
        name: LOGO_CUSTOMER_NAME, 
        address: base64Image,
        cpf: '000.000.000-00', // CPF fake para não dar conflito se for unique nulo
        phone: 'SYSTEM'
      }])
      
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout') // Revalida tudo para a logo atualizar em todas as telas
  return { success: true }
}
