const { createClient } = require('@supabase/supabase-js');

async function test() {
  try {
    const supabase = createClient('https://', 'placeholder');
    const { data, error } = await supabase.from('clientes').select('*');
    console.log('Result:', { data, error });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
