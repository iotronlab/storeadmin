<template>
  <v-container fluid>
    <section v-if="$fetchState.pending"><PageLoader /></section>
    <section v-if="!$fetchState.pending">
      <ValidationObserver ref="observer">
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(group, key) in attributeData.groups"
            :key="key"
          >
            <v-expansion-panel-header>{{
              group.name
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row
                no-gutters
                v-for="(attribute, key) in group.attributes"
                :key="key"
              >
                <v-col
                  v-if="attribute.type == 'text' || attribute.type == 'price'"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                  >
                    <v-text-field
                      v-model="productData[attribute.code]"
                      :label="attribute.name"
                      filled
                      :error-messages="errors"
                      dense
                      @change="updateData(attribute.code)"
                    ></v-text-field
                  ></ValidationProvider>
                </v-col>
                <v-col v-else-if="attribute.type == 'select'">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                  >
                    <v-select
                      v-model="productData.attributes[attribute.code]"
                      :items="attribute.options"
                      item-value="admin_name"
                      item-text="admin_name"
                      :label="attribute.code"
                      :error-messages="errors"
                      filled
                      dense
                      @change="updateData(attribute.code)"
                    ></v-select
                  ></ValidationProvider>
                </v-col>
                <div
                  v-else-if="
                    attribute.type == 'boolean' && attribute.is_visible == true
                  "
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                  >
                    <v-switch
                      :value="product[attribute.code]"
                      :label="attribute.name"
                      input-value="false"
                      :error-messages="errors"
                      @change="updateData(attribute.code)"
                    ></v-switch
                  ></ValidationProvider>
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
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                  >
                    <v-textarea
                      :value="product[attribute.code]"
                      :label="attribute.code"
                      @change="updateData(attribute.code)"
                      no-resize
                      :error-messages="errors"
                      rows="3"
                    ></v-textarea
                  ></ValidationProvider>
                </div>
              </v-row>
              <v-slide-y-transition>
                <v-btn color="success" v-if="editMode" @click="saveData"
                  >Save</v-btn
                ></v-slide-y-transition
              >
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
                      and all it's parent categories. (assign t-shirts and it
                      will be displayed under both t-shirts and clothings)
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
        </v-expansion-panels></ValidationObserver
      >
    </section>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { ValidationObserver } from 'vee-validate'
export default {
  data() {
    return {
      product: Object,
      productData: Object,
      attributeData: Object,
      productCategory: Array,
      formData: {},
      panel: [],
      //page state variables
      editMode: false,
      // updatedField: null,

      // date: new Date().toISOString().substr(0, 10),
    }
  },
  components: {
    ValidationObserver,
  },

  computed: {
    ...mapGetters({
      categories: 'categories',
    }),
  },
  methods: {
    updateData(code) {
      // this.updatedField = code

      if (
        this.productData[code] != undefined &&
        this.productData[code] !== this.product[code]
      ) {
        Object.assign(this.formData, { [code]: this.productData[code] })
        console.log(this.formData)
      } else if (
        this.productData.attributes[code] != undefined &&
        this.productData.attributes[code] !== this.product.attributes[code]
      ) {
        Object.assign(this.formData, {
          [code]: this.productData.attributes[code],
        })

        //this.formData[code] = this.productData.attributes[code]
      } else {
        //this.editMode = false
        delete this.formData[code]
      }
      let form = Object.keys(this.formData)
      if (form.length > 0) {
        this.editMode = true
      } else {
        console.log(form.length)
        this.editMode = false
      }
    },
    async saveData() {
      if (await this.$refs.observer.validate()) {
        console.log(await this.$refs.observer.validate())
        // await this.$axios
        //   .$post('vendor/profile-update', this.formData)
        //   .then((res) => {
        //     this.uploadSuccess(res)
        //   })
        //   .catch((err) => {
        //     this.$toast.error(err.message)
        //   })
      } else {
        let errors = Object.values(this.$refs.observer.errors)

        errors.forEach((err) => {
          //  console.log(val)
          if (err.length > 0) {
            err.forEach((e) => {
              this.$toast.error(e)
            })
          }
        })
      }
    },

    // allowedDates: (val) => parseInt(val.split('-')[2], 10) % 2 === 0,
  },
  async fetch() {
    await this.$axios
      .$get(`products/${this.$route.params.slug}`)
      .then((res) => {
        this.product = res.product
        this.productCategory = res.categories
        //shallow copy only props
        //this.productData = Object.assign({}, this.product)
        //deep copy
        this.productData = JSON.parse(JSON.stringify(res.product))

        let family = res.product.family_id

        this.$axios
          .$get(`families/${family}`)
          .then((res) => {
            this.attributeData = res.data

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
