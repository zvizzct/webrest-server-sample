import { Request, Response } from 'express'
import { prisma } from '../../data/postgres'
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos'

export class TodosController {
  public async getTodos(req: Request, res: Response) {
    const todos = await prisma.todo.findMany()
    res.json(todos)
  }

  public async getTodoById(req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' })

    const todo = await prisma.todo.findUnique({
      where: {
        id: id
      }
    })
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `Todo with id ${id} not found` })
  }

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body)
    if (error) return res.status(400).json({ error })
    const todo = await prisma.todo.create({
      data: createTodoDto!
    })

    res.json(todo)
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id
    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id
    })
    if (error) return res.status(404).json({ error })

    const todo = await prisma.todo.findUnique({
      where: {
        id: id
      }
    })
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` })

    const newTodo = await prisma.todo.update({
      where: {
        id: id
      },
      data: updateTodoDto!.values
    })
    return res.json(newTodo)
  }

  public async deleteTodo(req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' })
    try {
      const todo = await prisma.todo.delete({
        where: {
          id: id
        }
      })
      return res.json(todo)
    } catch (err) {
      return res.status(400).json({ error: 'ID argument is not a number' })
    }
  }
}
