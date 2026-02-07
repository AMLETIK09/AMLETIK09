import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids : [];
    if (!ids.length) return NextResponse.json({ products: [] });

    await dbConnect();
    const products = await Product.find({ _id: { $in: ids } }).populate('seller', 'name email');

    // return as map of id -> product for convenience
    const map: Record<string, any> = {};
    for (const p of products) map[p._id.toString()] = p;

    return NextResponse.json({ products: map });
  } catch (err) {
    return NextResponse.json({ products: {} });
  }
}
