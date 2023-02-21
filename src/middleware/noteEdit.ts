function navigateToPreviewOrHome() {
  const route = useRoute()
  return navigateTo(route.params?.id ? `/note/${route.params.id}` : '/')
}

export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const route = useRoute()

  if (!user.value) {
    return navigateToPreviewOrHome()
  }

  const { data: note } = await getNote(getRouterParamsAsString(route.params.id))
  const isUsers = isUsersNote(user.value.id, note?.user_id)

  if (!isUsers) {
    return navigateToPreviewOrHome()
  }
})
