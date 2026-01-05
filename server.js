import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const app = express();

app.use(express.json());

app.post('/usuarios/:id', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    })

    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/usuarios', async (req, res) => {
    let users = []

    if (req.query) {
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query.age
            }
        })
    } else {
        users = await prisma.user.findMany()
    }

    res.status(200).json(users)
})

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, age } = req.body || {}

  if (!name || !email || age === undefined) {
    return res.status(400).json({ error: 'Dados obrigatórios' })
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        age: Number(age)
      }
    })

    return res.json(user)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})


app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json({ message: 'Usuario deletado!' })
  } catch (error) {
  }
})

app.listen(3000, () => {
});
// username: danieloliveira459cdo_db_user
//password: userdbdaniel
