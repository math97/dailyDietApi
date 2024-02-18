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
      })

      const { name, description, diet } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        diet,
      })

      return reply.status(HTTP_STATUS_CODE.CREATED).send()
    },
  )
}
