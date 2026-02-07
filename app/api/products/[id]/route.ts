import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const product = await Product.findById(id).populate('seller', 'name email');
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Mock reviews/specs for demo (replace with real collections later)
  const reviews = [
    { id: 'r1', author: 'Паша', rating: 5, text: 'Отличный товар, всё как в описании.' },
    { id: 'r2', author: 'Ольга', rating: 4, text: 'Хорошее качество, быстро доставили.' },
  ];

  const specs = {
    weight: '1kg',
    origin: 'Россия',
  };

  return NextResponse.json({ product, reviews, specs });
}
