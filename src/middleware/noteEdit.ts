function navigateToPreviewOrHome() {
  const route = useRoute('note-id')
  return navigateTo(`/note/${route.params.id}`)
}

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateToPreviewOrHome()
  }

  const note = await getNote(getRouterParamsAsString(to.params.id))
  const isUsers = isUsersNote(user.value.id, note?.user_id)

  if (!isUsers) {
    return navigateToPreviewOrHome()
  }
})
