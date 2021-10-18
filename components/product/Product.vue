<template>
  <v-container fluid>
    <v-img :src="product.base_image" max-height="200" contain>
      <v-row no-gutters>
        <v-badge
          color="deep-purple accent-4"
          content="Featured"
          :value="product.featured"
          offset-y="30"
          offset-x="70"
        >
        </v-badge>
      </v-row>
    </v-img>

    <v-row no-gutters class="mt-2" style="flex-wrap: nowrap">
      <v-col class="flex-grow-1 flex-shrink-0">
        <h4 class="text-subtitle-2">{{ product.sku }}</h4>
        <h4 class="text-subtitle-2">{{ product.name }}</h4>

        <h4 class="text-subtitle-2" v-if="product.special_price > 0">
          <span class="text-decoration-line-through text-caption">
            {{ product.formatted_price }}</span
          >
          {{ product.formatted_special_price }}
        </h4>
        <h4 class="text-subtitle-2" v-else>
          {{ product.formatted_price }}
        </h4></v-col
      ><v-col class="flex-grow-0 flex-shrink-1" align="end">
        <v-chip
          small
          :color="product.in_stock ? 'success' : ''"
          class="mb-2 caption"
          >{{ product.in_stock ? 'in stock' : 'sold' }}</v-chip
        >
      </v-col></v-row
    >
    <!-- <v-row no-gutters>
      <v-btn small outlined
        >Add to cart<v-icon right small>mdi-cart-plus</v-icon></v-btn
      ></v-row
    > -->
  </v-container>
</template>

<script>
export default {
  props: {
    product: {
      required: true,
      type: Object,
    },
  },

  computed: {
    // link() {
    //   let slug = this.product.sku
    //   // let slug =
    //   //   this.product.variants.length > 0
    //   //     ? this.product.variants[0].sku
    //   //     : this.product.sku
    //   // console.log(slug)
    //   // console.log('slug above')
    //   // return '#'
    //   return {
    //     name: 'products-slug',
    //     params: {
    //       slug: slug,
    //     },
    //   }
    // },
    // vendorLink() {
    //   let url = this.product.vendor.url
    //   // let slug =
    //   //   this.product.variants.length > 0
    //   //     ? this.product.variants[0].sku
    //   //     : this.product.sku
    //   // console.log(slug)
    //   // console.log('slug above')
    //   // return '#'
    //   return {
    //     name: 'artists-url',
    //     params: {
    //       url: url,
    //     },
    //   }
    // },
  },
}
</script>
