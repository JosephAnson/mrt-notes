import { useWoWClient } from '~/utils/blizzard'

interface Instance {
  id: number
  name: string
}

interface InstanceReturn {
  id: number
  name: string
  encounters: Instance[]
}

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Should provide id',
    })
  }

  const id = Number(event.context.params.id)

  const storageKey = `instance:${id}`
  const instance = await useStorage().getItem<InstanceReturn>(storageKey)
  if (instance) return instance

  const wowClient = await useWoWClient()

  const { data } = await wowClient.journal<InstanceReturn>({
    resource: 'instance',
    id,
  })

  await useStorage().setItem(storageKey, data)

  return data
})
