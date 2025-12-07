import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Seed products (development helper) - idempotent
app.post('/api/seed-products', async (_req, res) => {
  try {
    const products = [
      { id: 1, productName: 'HPlaptop', productDescription: 'This is HP laptop' },
      { id: 2, productName: 'lenovo laptop', productDescription: 'This is lenovo' },
      { id: 3, productName: 'Car', productDescription: 'This is Car' },
      { id: 4, productName: 'Bike', productDescription: 'This is Bike' },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: { productName: p.productName, productDescription: p.productDescription },
        create: { id: p.id, productName: p.productName, productDescription: p.productDescription },
      });
    }

    res.json({ seeded: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get all products
app.get('/api/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Singular aliases to match spec (optional)
app.get('/api/order', async (_req, res) => {
  // redirect to plural endpoint
  return res.redirect('/api/orders');
});

app.get('/api/order/:id', async (req, res) => {
  // forward to /api/orders/:id by calling handler logic directly
  const id = Number(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { products: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({
      id: order.id,
      orderDescription: order.orderDescription,
      createdAt: order.createdAt,
      products: order.products.map((m) => m.product),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get all orders
app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { products: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = orders.map((o) => ({
      id: o.id,
      orderDescription: o.orderDescription,
      createdAt: o.createdAt,
      products: o.products.map((m) => m.product),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get order by id
app.get('/api/orders/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { products: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({
      id: order.id,
      orderDescription: order.orderDescription,
      createdAt: order.createdAt,
      products: order.products.map((m) => m.product),
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  const { orderDescription, productIds } = req.body;
  if (!orderDescription) return res.status(400).json({ error: 'orderDescription is required' });
  try {
    const order = await prisma.order.create({
      data: { orderDescription, products: { create: productIds?.map((pid: number) => ({ product: { connect: { id: pid } } })) ?? [] } },
      include: { products: { include: { product: true } } },
    });
    res.status(201).json({ id: order.id, orderDescription: order.orderDescription, products: order.products.map((m) => m.product) });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Update order
app.put('/api/orders/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { orderDescription, productIds } = req.body;
  try {
    // update description
    const updated = await prisma.order.update({ where: { id }, data: { orderDescription } });
    // replace product mappings
    if (Array.isArray(productIds)) {
      await prisma.orderProductMap.deleteMany({ where: { orderId: id } });
      for (const pid of productIds) {
        await prisma.orderProductMap.create({ data: { orderId: id, productId: pid } });
      }
    }
    const order = await prisma.order.findUnique({ where: { id }, include: { products: { include: { product: true } } } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ id: order.id, orderDescription: order.orderDescription, products: order.products.map((m) => m.product) });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.orderProductMap.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
