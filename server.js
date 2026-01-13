import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors()) //necessario colocar o endereço 

app.post('/usuarios', async (req, res) => {
  try {
    const { name, email } = req.body
    const age = Number(req.body.age)

    if (!name || !email || Number.isNaN(age)) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        age
      }
    })

    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/usuarios', async (req, res) => {
  try {
    const filters = {}

    if (req.query.name) {
      filters.name = req.query.name
    }

    if (req.query.email) {
      filters.email = req.query.email
    }

    if (req.query.age) {
      const age = Number(req.query.age)
      if (Number.isNaN(age)) {
        return res.status(400).json({ error: 'Idade inválida' })
      }
      filters.age = age
    }

    const users = await prisma.user.findMany({
      where: filters
    })

    res.status(200).json(users)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, age } = req.body || {}

  const ageNumber = Number(age)

  if (!name || !email || Number.isNaN(ageNumber)) {
    return res.status(400).json({ error: 'Dados inválidos' })
  }

  const user = await prisma.user.update({
    where: { id },
    data: { name, email, age: ageNumber }
  })

  res.json(user)
})

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    })

    res.status(200).json({ message: 'Usuário deletado!' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})

// username: danieloliveira459cdo_db_user
//password: userdbdaniel