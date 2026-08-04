const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = envLocal.split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    acc[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
  }
  return acc;
}, {});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
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
    .limit(50);

  console.log("Error:", JSON.stringify(error, null, 2));
  console.log("Data length:", data?.length);
}

test();
