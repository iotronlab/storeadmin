<template>
  <v-container fluid>
    <section v-if="$fetchState.pending" class="text-center">
      <PageLoader :message="'fetching your products...'" />
    </section>
    <section v-if="$fetchState.error">
      There was some error fetching products.
    </section>
    <section v-if="!$fetchState.pending">
      <v-row no-gutters align="center">
        <h4 class="text-caption" v-if="products.length < 1">
          There are no products in your inventory at the moment.
        </h4>
        <h4 class="text-caption" v-if="products.length >= 1">
          Products({{ products.length }})
        </h4>
        <v-btn outlined rounded small class="mx-2" to="products/create"
          >Add Product</v-btn
        ></v-row
      >

      <v-item-group>
        <v-container fluid>
          <v-row no-gutters>
            <v-col
              v-for="(product, n) in products"
              :key="n"
              cols="12"
              md="4"
              lg="3"
              class="pa-1 flex-grow-1 flex-shrink-1"
            >
              <v-item v-slot="{ active, toggle }" :value="product">
                <v-card
                  :color="active ? 'grey lighten-1' : ''"
                  @click="toggle"
                  class="pa-1"
                >
                  <Product :product="product" />
                  <v-card-actions>
                    <v-btn
                      :to="{
                        name: 'admin-products-edit-sku',
                        params: { sku: product.sku },
                      }"
                      >edit</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </section>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
export default {
  middleware: ['auth'],
  data: () => ({
    vendor: null,
    products: [],
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  watch: {},

  methods: {},
  async fetch() {
    await this.$axios
      .$get(`/vendors/${this.user.url}`)
      .then((res) => {
        this.vendor = res.data
        this.products = res.data.products
        console.log(res)
      })
      .catch((err) => {})
  },
}
</script>
