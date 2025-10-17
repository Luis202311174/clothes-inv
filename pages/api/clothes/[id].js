import { supabase } from '@/lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('clothes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const { name, category, size, color, price, quantity } = req.body;

      const { error } = await supabase
        .from('clothes')
        .update({ name, category, size, color, price, quantity })
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('clothes').delete().eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('API error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}