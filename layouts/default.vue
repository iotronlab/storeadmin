<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" temporary fixed app>
      <v-list>
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
      {{categories}}
      <v-toolbar-title v-text="title" />
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
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Category',
          to: '/categories',
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
