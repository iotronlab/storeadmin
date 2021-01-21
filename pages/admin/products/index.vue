<template>
  <v-container fluid>
    <section v-if="$fetchState.pending"><PageLoader /></section>
    <section v-if="$fetchState.error">
      There was some error loading data.
    </section>
    <section v-if="!$fetchState.pending">
      <v-btn to="products/create">Add Product</v-btn>
      <v-row no-gutters v-if="products.length < 1">
        <p>There are no products in your inventory at the moment.</p>
      </v-row>
      <v-item-group>
        <v-container fluid>
          <v-row no-gutters>
            <v-col
              v-for="(product, n) in products"
              :key="n"
              cols="12"
              md="4"
              class="pa-1"
            >
              <v-item v-slot="{ active, toggle }" :value="product">
                <v-card
                  :color="active ? 'primary' : ''"
                  class="d-flex align-center"
                  dark
                  height="200"
                  @click="toggle"
                  >{{ product.name }}
                  <v-scroll-y-transition>
                    <div v-if="active" class="flex-grow-1 text-center">
                      <v-btn
                        :to="{
                          name: 'admin-products-edit-slug',
                          params: { slug: product.sku },
                        }"
                        >edit</v-btn
                      >
                    </div>
                  </v-scroll-y-transition>
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
      .$get(`/vendors/${this.user.slug}`)
      .then((res) => {
        this.vendor = res.data
        this.products = res.data.products
        console.log(res)
      })
      .catch((err) => {})
  },
}
</script>
