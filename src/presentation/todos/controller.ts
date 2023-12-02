import { Request, Response } from 'express'

const todos = [
  {
    id: 1,
    text: 'Todo 1',
    completedAt: new Date()
  },
  {
    id: 2,
    text: 'Todo 2',
    completedAt: null
  },
  {
    id: 3,
    text: 'Todo 3',
    completedAt: new Date()
  }
]

export class TodosController {
  public getTodos(req: Request, res: Response) {
    return res.json(todos)
  }

  public getTodoById(req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' })

    const todo = todos.find((elm) => elm.id === id)
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `Todo with id ${id} not found` })
  }

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body

    if (!text)
      return res.status(400).json({ error: 'Title property is required' }) // changed the error message accordingly
    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: null
    }
    todos.push(newTodo)
    res.json(newTodo)
  }

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id
    console.log(id)
    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' })
    const todo = todos.find((el) => el.id === id)
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` })
    console.log(req.body)
    const { text, completedAt } = req.body

    todo.text = text || todo.text
    completedAt === null
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt))

    return res.json(todo)
  }

  public deleteTodo(req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id))
      return res.status(400).json({ error: 'ID argument is not a number' })

    const todo = todos.find((elm) => elm.id === id)
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` })

    const index = todos.indexOf(todo)
    todos.splice(index, 1)
    return res.json(todo)
  }
}
