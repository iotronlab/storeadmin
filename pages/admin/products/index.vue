<template>
  <v-container fluid>
    <v-row no-gutters>{{ vendor }}</v-row>
    <v-item-group>
      <v-container>
        <v-row>
          <v-col v-for="(product, n) in products" :key="n" cols="12" md="4">
            <v-item v-slot="{ active, toggle }" :value="product">
              <v-card
                :color="active ? 'primary' : ''"
                class="d-flex align-center"
                dark
                height="200"
                @click="toggle"
                >{{ product }}
                <v-scroll-y-transition>
                  <div v-if="active" class="display-3 flex-grow-1 text-center">
                    Active
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
    <v-btn to="products/create">Add Product</v-btn>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
export default {
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

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      await this.$axios
        .$get(`/vendors/${this.user.slug}`)
        .then((res) => {
          this.vendor = res.data
          this.products = res.data.products
          console.log(res)
        })
        .catch((err) => {})
    },
  },
}
</script>
