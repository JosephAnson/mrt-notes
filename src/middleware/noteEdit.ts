function navigateToPreviewOrHome() {
  const route = useRoute()
  return navigateTo(route.params?.id ? `/note/${route.params.id}` : '/')
}

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateToPreviewOrHome()
  }

  const note = await getNote(getRouterParamsAsString(to.params.id))
  const isUsers = isUsersNote(user.value.id, note?.user?.id)

  if (!isUsers) {
    return navigateToPreviewOrHome()
  }
})
