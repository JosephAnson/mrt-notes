function navigateToPreviewOrHome() {
  const route = useRoute('note-id')
  return navigateTo(`/note/${route.params.id}`)
}

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  if (!user.value || !user.value.id || !(to.params as { id?: string })?.id)
    return navigateToPreviewOrHome()

  const note = await getNote(getRouterParamsAsString((to.params as { id: string }).id))
  const isUsers = isUsersNote(user.value.id, note?.user_id)

  if (!isUsers)
    return navigateToPreviewOrHome()
})
