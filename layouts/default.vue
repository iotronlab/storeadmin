<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" temporary fixed app>
      <v-list nav dense shaped>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <nuxt-link :to="{ name: 'index' }">
        <v-img src="/logo.png" alt="artistic logo" width="80" />
      </nuxt-link>
      <v-container fluid px-0>
        <v-row no-gutters>
          <v-col class="d-flex justify-end align-center">
            <v-btn rounded to="/auth/login">Sign in</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      drawer: false,

      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Catalog',
          to: '/admin/products',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Addresses',
          to: '/admin/addresses',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Orders',
          to: '/orders',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Custom Art',
          to: '/orders/custom',
        },
      ],

      title: 'Vuetify.js',
    }
  },

  mounted() {
    this.initialize()
  },
  computed: {
    ...mapGetters({
      categories: 'categories',
      //cartProducts: "cart/products",
      // cartCount: "cart/cartCount"
      // authenticated: "user/getAuthentication"
    }),
  },

  methods: {
    ...mapActions(['updateNavMenu']),
    async initialize() {
      await this.updateNavMenu()
    },
  },
}
</script>
