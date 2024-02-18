import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/sessionId'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { HTTP_STATUS_CODE } from '../models/http_status_code'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, diet, date } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        diet,
        user_id: request.user?.id,
        date: date.getTime(),
      })

      return reply.status(HTTP_STATUS_CODE.CREATED).send()
    },
  )

  app.get('/', { preHandler: checkSessionIdExists }, async (request, reply) => {
    const userId = request.user?.id
    const meals = await knex('meals')
      .where({ user_id: userId })
      .orderBy('date', 'desc')

    return reply.send({ meals })
  })

  app.put(
    '/:mealId',
    { preHandler: checkSessionIdExists },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })
      const { mealId } = paramsSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, date, diet } = updateMealBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal)
        return reply
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .send({ error: 'Meal not found' })

      await knex('meals').where({ id: mealId }).update({
        name,
        description,
        diet,
        date: date.getTime(),
      })

      return reply.status(HTTP_STATUS_CODE.NO_CONTENT).send()
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return reply
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .send({ error: 'Meal not found' })
      }

      return reply.send({ meal })
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const meal = await knex('meals').where({ id: mealId }).first()

      if (!meal) {
        return reply
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .send({ error: 'Meal not found' })
      }

      await knex('meals').where({ id: mealId }).delete()

      return reply.status(HTTP_STATUS_CODE.NO_CONTENT).send()
    },
  )
}
