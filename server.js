const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

const corsOptions = { origin: 'http://localhost:8081' };

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (_req, res) => {
  res.json({ message: 'alive' });
});

app.get('/explorers', async (_req, res) => {
  const allExplorers = await prisma.explorer.findMany({});
  res.json(allExplorers);
});

app.get('/explorers/:id', async (req, res) => {
  const id = req.params.id;
  const explorer = await prisma.explorer.findUnique({
    where: { id: parseInt(id) },
  });
  res.json(explorer);
});

app.post('/explorers', async (req, res) => {
  const explorer = {
    name: req.body.name,
    username: req.body.username,
    mission: req.body.mission,
  };
  const message = 'Explorer creado.';
  await prisma.explorer.create({ data: explorer });
  return res.json({ message });
});

app.put('/explorers/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.explorer.update({
    where: {
      id: id,
    },
    data: {
      mission: req.body.mission,
    },
  });

  return res.json({ message: 'Actualizado correctamente' });
});

app.delete('/explorers/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.explorer.delete({ where: { id: id } });
  return res.json({ message: 'Eliminado correctamente' });
});

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
