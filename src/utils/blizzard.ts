import { wow } from 'blizzard.js'

export const wowClient = await wow.createInstance({
  key: process.env.BLIZZARD_CLIENT_ID as string,
  secret: process.env.BLIZZARD_CLIENT_SECRET as string,
})
