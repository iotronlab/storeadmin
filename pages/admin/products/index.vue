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
        <h4 class="text-caption" v-if="products.length >= 1">Products()</h4>
        <v-btn outlined rounded small class="mx-2" to="products/create"
          >Add Product</v-btn
        >
        <h5 class="caption text-center my-2">
          showing ({{ pageData.from }} - {{ pageData.to }}) of
          {{ pageData.total }} result<span v-if="pageData.total > 1">s</span>
        </h5></v-row
      >
      <v-divider class="mt-4" />
      <v-container fluid>
        <!-- <h4 class="subtitle-2">
          {{ date.length }} product<span v-if="date.length > 1">s</span> posted
          on {{ n }}
        </h4> -->
        <v-divider class="mt-2" />
        <v-row no-gutters>
          <v-col
            v-for="(product, n) in products"
            :key="n"
            cols="12"
            md="4"
            lg="3"
            class="pa-1 flex-grow-1 flex-shrink-1"
          >
            <v-card class="pa-0">
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
          </v-col>
        </v-row>
      </v-container>
      <v-row no-gutters align="center" justify="center">
        <v-pagination
          :value="pageData.current_page"
          :length="pageData.last_page"
          @input="fetchPage"
          circle
          class="mb-4"
        />
      </v-row>
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
    pageData: { current_page: 1 },
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  watch: {},

  methods: {
    fetchPage(data) {
      if (data != this.pageData.current_page) {
        this.pageData.current_page = data
        this.$fetch()
      }
    },
  },
  async fetch() {
    await this.$axios
      .$get(`/vendors/${this.user.url}`)
      .then((res) => {
        this.vendor = res.vendor
        this.products = res.data
        this.pageData = res.meta
      })
      .catch((err) => {})
  },
}
</script>
