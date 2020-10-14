<template>
  <v-card>
    <v-container fluid>
        <v-row
            align="center"
            v-for="attribute in attributes"
            :key="attribute.id"
        >
            <v-col
            cols="12"
            sm="6"
            >
            <v-select
                v-model="value"
                :items="attribute.options"
                item-value="id"
                item-text="admin_name"
                attach
                chips
                :label="attribute.code"
                multiple
            ></v-select>
            </v-col>
        </v-row>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    props:{
      attributes: {
        required: true,
        type: Array,
      },
    },
    data: () => ({
      value: null,
    }),
  }
</script>