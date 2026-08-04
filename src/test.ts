import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      customers ( name ),
      sale_items (
        quantity,
        unit_price,
        total_price,
        products ( description )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  console.log("Error:", JSON.stringify(error, null, 2))
  console.log("Data length:", data?.length)
}

test()
