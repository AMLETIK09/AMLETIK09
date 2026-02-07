import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.trim() ?? '';
  const category = url.searchParams.get('category')?.trim() ?? '';

  const query: any = {};

  if (category) query.category = category;

  if (search) {
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { title: { $regex: re } },
      { description: { $regex: re } },
    ];
  }

  const products = await Product.find(query).populate('seller', 'name email');
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  await dbConnect();

  const user = getUserFromToken(request);
  if (!user || user.role !== 'seller') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, price, image, category } = await request.json();

  if (!title || !description || !price || !image || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const product = new Product({
    title,
    description,
    price,
    image,
    category,
    seller: user.userId,
  });

  await product.save();

  return NextResponse.json(product, { status: 201 });
}