'use server'

import { supabase } from '@/lib/supabase'

// Tabela simples para usuário admin: admin_users (id, username, password)
export async function checkLogin(username: string, pass: string) {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !data) {
    // Fallback provisório caso a tabela não exista ainda
    if (username === 'admin' && pass === '123456') {
      return { success: true }
    }
    return { success: false, error: 'Credenciais inválidas' }
  }

  if (data.password === pass) {
    return { success: true }
  }

  return { success: false, error: 'Senha incorreta' }
}

export async function changePassword(newPassword: string) {
  // Verifica se o usuário admin já existe na tabela
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('username', 'admin')
    .single()

  if (existing) {
    // Atualiza
    const { error } = await supabase
      .from('admin_users')
      .update({ password: newPassword })
      .eq('username', 'admin')
      
    if (error) return { success: false, error: error.message }
  } else {
    // Cria
    const { error } = await supabase
      .from('admin_users')
      .insert([{ username: 'admin', password: newPassword }])
      
    if (error) return { success: false, error: error.message }
  }

  return { success: true }
}
