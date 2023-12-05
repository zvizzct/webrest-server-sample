import { Request, Response } from 'express'
import { prisma } from '../../data/postgres'
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos'
import { TodoRepository } from '../../domain'

export class TodosController {
  constructor(private readonly todoRepository: TodoRepository) {}

  public async getTodos(req: Request, res: Response) {
    const todos = await this.todoRepository.getAll()
    console.log(todos)
    return res.json(todos)
  }

  public async getTodoById(req: Request, res: Response) {
    const id = +req.params.id
    try {
      const todo = await this.todoRepository.findById(id)
      res.json(todo)
    } catch (error) {
      res.status(400).json({ error })
    }
  }

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body)
    if (error) return res.status(400).json({ error })
    const todo = await this.todoRepository.create(createTodoDto!)

    res.json(todo)
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id
    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id
    })
    if (error) return res.status(404).json({ error })

    const newTodo = this.todoRepository.updateById(updateTodoDto!)
    return res.json(newTodo)
  }

  public async deleteTodo(req: Request, res: Response) {
    const id = +req.params.id

    try {
      const todo = await this.todoRepository.deleteById(id)
      res.json(todo)
    } catch (error) {
      return res.status(404).json(error)
    }
  }
}
