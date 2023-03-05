import { useWoWClient } from '~/utils/blizzard'

interface Instance {
  id: number
  name: string
}

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = Number(event.context.params.id)

  const wowClient = await useWoWClient()

  const { data } = await wowClient.journal<{
    id: number
    name: string
    encounters: Instance[]
  }>({
    resource: 'instance',
    id,
  })

  return data
})
