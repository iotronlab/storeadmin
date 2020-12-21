<template>
  <v-card>
    <v-container fluid>
      <v-row
        align="center"
        v-for="attribute in attributes.data"
        :key="attribute.id"
      >
        <v-col cols="12" sm="6">
          <v-select
            v-model="values[attribute.code]"
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
      {{ values }}
      <v-btn @click="save"> Save </v-btn>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    attributes: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    values: {},
    data: {},
  }),
  methods: {
    async save() {
      this.data.type = 'configurable'
      this.data.sku = this.attributes.sku
      this.data.attribute_family_id = this.attributes.family
      this.data.super_attributes = this.values
      this.data.vendor_id = 1

      console.log(this.data)
      await this.$axios
        .$post(
          `products?type=configurable&sku=${this.attributes.sku}&family=${this.attributes.family}`,
          this.data
        )
        .then((res) => {
          this.$router.push({
            path: `edit/${this.slug}`,
            query: { data: res.data },
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    test(val) {
      console.log(val)
    },
  },
}
</script>
