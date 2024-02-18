import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { HTTP_STATUS_CODE } from '../models/http_status_code'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId)
    return reply
      .status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .send({ error: 'Unauthorized' })

  const user = await knex('users').where({ session_id: sessionId }).first()

  if (!user)
    return reply
      .status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .send({ error: 'Unauthorized' })

  request.user = user
}
