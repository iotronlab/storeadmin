<template>
  <v-container >
    <!-- <v-row align="start">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-select
          v-model="select_type"
          :items="types"
          :rules="[v => !!v || 'Item is required']"
          label="Product Type"
          required
        ></v-select>
        <v-select
          v-model="select_attribute"
          :items="attributes"
          :rules="[v => !!v || 'Item is required']"
          label="Attribute Family"
          required
        ></v-select>
        <v-text-field
          v-model="slug"
          :rules="[v => !!v || 'Name is required']"
          label="SKU"
          required
        ></v-text-field>
        <v-btn
          :disabled="!valid"
          color="primary"
          class="mr-4"
          @click="add"
        >
          ADD
        </v-btn>

        <v-btn
          color="error"
          class="mr-4"
          @click="reset"
        >
          Reset
        </v-btn>

      </v-form>
    </v-row> -->
    <h1>This is slug page</h1>
  </v-container>
</template>
<script>
  export default {
    data(){
      return {
        valid: true,
        select_type: null,
        types: [
          "Simple",
          "Configurable",
          "Bundle",
        ],
        select_attribute: null,
        attributes: [],
        slug: '',
      }
    },
//     methods: {
//       add () {
        
//       },
//       reset () {
//         this.$refs.form.reset()
//       },
//     },
//   }
  }
</script>