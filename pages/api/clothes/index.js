import { supabase } from '@/lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { search = '', category = '' } = req.query;

      // Base query
      let query = supabase.from('clothes').select('*');

      if (category) query = query.eq('category', category);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { name, category, size, color, price, quantity } = req.body;

      const { error } = await supabase
        .from('clothes')
        .insert([{ name, category, size, color, price, quantity }]);

      if (error) throw error;
      return res.status(201).json({ message: 'Added successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('API error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
