<template>
  <v-container fluid class="text-center">
    <v-progress-circular indeterminate></v-progress-circular><br /><br />
    {{ message || 'Loading data...' }}
  </v-container>
</template>

<script>
export default {
  props: {
    message: String,
    required: false,
  },
}
</script>
