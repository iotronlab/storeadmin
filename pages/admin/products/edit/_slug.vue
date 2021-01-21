<template>
  <v-container fluid>
    <section v-if="$fetchState.pending"><PageLoader /></section>
    <section v-if="!$fetchState.pending">
      <v-expansion-panels v-model="panel">
        <v-expansion-panel v-for="(group, key) in data.groups" :key="key">
          <v-expansion-panel-header>{{ group.name }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ productData }}
            <v-row
              no-gutters
              v-for="(attribute, key) in group.attributes"
              :key="key"
            >
              <v-col
                v-if="attribute.type == 'text' || attribute.type == 'price'"
              >
                <v-text-field
                  v-model="productData[attribute.code]"
                  :label="attribute.name"
                  full-width
                  filled
                  dense
                ></v-text-field>
              </v-col>
              <v-col v-else-if="attribute.type == 'select'">
                <v-select
                  v-model="productData.attributes[attribute.code]"
                  :items="attribute.options"
                  item-value="admin_name"
                  item-text="admin_name"
                  :label="attribute.code"
                  dense
                  outlined
                  return-object
                ></v-select>
              </v-col>
              <div v-else-if="attribute.type == 'boolean'">
                <v-switch
                  :value="product[attribute.code]"
                  :label="attribute.code"
                  input-value="false"
                ></v-switch>
              </div>
              <!-- <div v-else-if="attribute.type == 'date'">
                <v-menu
                  ref="menu"
                  v-model="values[attribute.code]"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="values[attribute.code]"
                      label="Picker in menu"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="values[attribute.code]"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div> -->
              <div v-else-if="attribute.type == 'textarea'">
                <v-textarea
                  :value="product[attribute.code]"
                  :label="attribute.code"
                  no-resize
                  rows="3"
                ></v-textarea>
              </div>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Inventories</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-text-field label="Default" hide-details="auto"></v-text-field>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Images</v-expansion-panel-header>
          <v-expansion-panel-content>
            <!-- <v-btn primary>Add Image</v-btn> -->
            <ProductImage :product="product" />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Categories</v-expansion-panel-header>
          <v-expansion-panel-content
            ><v-row no-gutters justify="space-between"
              ><v-col lg="3" cols="12"
                ><ul>
                  <li>
                    A product can be added to only one child category.
                    (categories at the end of the list)
                  </li>
                  <li>
                    A product will displayed under the child category selected
                    and all it's parent categories. (assign t-shirts and it will
                    be displayed under both t-shirts and clothings)
                  </li>
                  <li>
                    The previous category has to be removed to
                    <em>re-assign</em> category to the product.
                  </li>
                </ul></v-col
              ><v-col lg="8" cols="12"
                ><CategorySelect
                  :categories="categories"
                  :product="product"
                  :productCategory="productCategory" /></v-col></v-row
          ></v-expansion-panel-content>
        </v-expansion-panel>
        <!-- <v-expansion-panel v-if="response.type == 'configurable'">
        <v-expansion-panel-header>variant</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row v-for="variant in response.variants" :key="variant.product_id">
            <v-col>
              <v-text-field
                v-model="variant.sku"
                label="SKU"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Name" hide-details="auto"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="variant.color_label"
                label="Colour"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="variant.size_label"
                label="Size"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select label="Qty" dense outlined></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="variant.price"
                label="Price"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="SKU" hide-details="auto"></v-text-field>
            </v-col>
            <v-col>
              <v-select
                :items="['Enabled', 'Disabled']"
                label="Status"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel> -->
      </v-expansion-panels>
    </section>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      product: {},
      productData: {},
      values: {},
      productCategory: [],
      state: null,
      text: null,
      panel: [0, 1],
      panel: [],
      valid: true,
      select_type: null,
      data: [],
      product: {},
      select_attribute: null,
      attributes: [],
      slug: '',
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories',
      //cartProducts: "cart/products",
      // cartCount: "cart/cartCount"
      // authenticated: "user/getAuthentication"
    }),
  },
  //   mounted() {
  //   if (this.user) {
  //     //copying logged in userdata to local data
  //     this.userData = Object.assign({}, this.user)
  //   }
  // },
  // watch: {
  //   user() {
  //     //copying logged in userdata to local data on update
  //     this.userData = Object.assign({}, this.user)
  //   },
  // },
  methods: {
    upvalues(code, val) {
      this.values[code] = val
    },
    allowedDates: (val) => parseInt(val.split('-')[2], 10) % 2 === 0,
  },
  async fetch() {
    let data = null

    await this.$axios
      .$get(`products/${this.$route.params.slug}`)
      .then((res) => {
        this.product = res.product
        this.productData = res.product
        let attribute = this.product.attributes['color']
        this.productCategory = res.categories
        console.log(attribute)
        let family = res.product.family_id
        console.log(family)
        this.$axios
          .$get(`families/${family}`)
          .then((res) => {
            this.data = res.data
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
    // return {
    //   // response: query.data,
    // }
  },
}
</script>
