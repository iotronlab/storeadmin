<template>
  <v-container fluid>
    <v-row no-gutters>Welcome to Artistic Admin</v-row>
  </v-container>
</template>


<script>
export default {
  // middleware({ store, redirect }) {
  //   // If the user is not authenticated
  //   if (!store.state.authenticated) {
  //     return redirect('/auth/login')
  //   }
  // },
  data: () => ({
    show: false,
    text: 'tested',
  }),
}
</script>
