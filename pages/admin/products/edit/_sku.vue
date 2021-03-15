<template>
  <v-container fluid>
    <section v-if="$fetchState.pending"><PageLoader /></section>
    <section v-if="!$fetchState.pending">
      <ValidationObserver ref="observer" v-slot="{}">
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(group, key) in attributeData.groups"
            :key="key"
          >
            <v-expansion-panel-header>{{
              group.name
            }}</v-expansion-panel-header>
            <v-expansion-panel-content eager>
              <v-row
                no-gutters
                v-for="(attribute, key) in group.attributes"
                :key="key"
              >
                <v-col v-if="attribute.type == 'text'">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                  >
                    <v-text-field
                      v-model="productData[attribute.code]"
                      :label="attribute.name"
                      :error-messages="errors"
                      dense
                      filled
                      @change="updateData(attribute.code)"
                    ></v-text-field
                  ></ValidationProvider>
                </v-col>
                <v-col v-if="attribute.type == 'price'">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${
                      attribute.required == 1 ? 'required|integer' : ''
                    }`"
                  >
                    <v-text-field
                      v-model="productData[attribute.code]"
                      :label="attribute.name"
                      :error-messages="errors"
                      dense
                      filled
                      @change="updateData(attribute.code)"
                    ></v-text-field
                  ></ValidationProvider>
                </v-col>
                <v-col
                  v-if="
                    attribute.type == 'select' &&
                    attribute.code == 'tax_category_id'
                  "
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                  >
                    <v-select
                      v-model="productData.attributes[attribute.code]"
                      :items="taxCategories"
                      item-value="id"
                      item-text="name"
                      :label="attribute.code"
                      :error-messages="errors"
                      filled
                      dense
                      @change="updateData(attribute.code, attribute.options)"
                    ></v-select
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
                      @change="updateData(attribute.code, attribute.options)"
                    ></v-select
                  ></ValidationProvider>
                </v-col>

                <!-- <v-col
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
                </v-col> -->
                <v-col v-if="attribute.type == 'textarea'">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                  >
                    <v-textarea
                      v-model="productData[attribute.code]"
                      :label="attribute.name"
                      :error-messages="errors"
                      @change="updateData(attribute.code)"
                      no-resize
                    ></v-textarea
                  ></ValidationProvider>
                </v-col>
                <v-col v-if="attribute.type == 'autocomplete'">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="attribute.name"
                    :rules="`${attribute.required == 1 ? 'required' : ''}`"
                    >{{ attribute }}
                    <v-combobox
                      v-model="productData[attribute.code]"
                      :items="product[attribute.code]"
                      :search-input.sync="search"
                      hide-selected
                      hint="create or searck existing tags"
                      :label="attribute.name"
                      multiple
                      persistent-hint
                      small-chips
                      :error-messages="errors"
                      @change="updateData(attribute.code)"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              No results matching "<strong>{{ search }}</strong
                              >". Press <kbd>enter</kbd> to create a new one
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-combobox></ValidationProvider
                  >
                </v-col>
              </v-row>
              <v-btn class="mr-4" @click="saveData">
                submit
              </v-btn></v-expansion-panel-content
            ></v-expansion-panel
          >
          <v-expansion-panel>
            <v-expansion-panel-header>Inventories</v-expansion-panel-header>
            <v-expansion-panel-content>
              <ProductStockTable :product="product" />
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
          </v-expansion-panel> </v-expansion-panels
      ></ValidationObserver>
    </section>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { ValidationObserver } from 'vee-validate'
export default {
  async fetch() {
    await this.$axios
      .$get(`products/${this.$route.params.sku}`)
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
    await this.$axios
      .$get(`tax`)
      .then((res) => {
        this.taxCategories = res
      })
      .catch((err) => {
        console.log(err)
      })
    // return {
    //   // response: query.data,
    // }
  },
  data() {
    return {
      product: {},
      productData: null,
      attributeData: {},
      productCategory: [],
      formData: {},
      search: null,
      //page state variables
      editMode: false,
      taxCategories: [],
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
    async updateData(code, options) {
      // this.updatedField = code

      if (
        //error behaves when value is null and empty string
        this.productData[code] &&
        this.productData[code] != this.product[code]
      ) {
        console.log(this.productData[code], this.product[code])
        Object.assign(this.formData, { [code]: this.productData[code] })
        //  console.log(this.formData)
      } else if (
        this.productData.attributes[code] &&
        this.productData.attributes[code] != this.product.attributes[code]
      ) {
        let selectedOption = options.find(
          ({ admin_name }) => admin_name === this.productData.attributes[code]
        )
        // console.log(selectedOption)
        Object.assign(this.formData, {
          [code]: selectedOption.id,
        })

        //this.formData[code] = this.productData.attributes[code]
      } else {
        //this.editMode = false
        delete this.formData[code]
      }
      console.log(this.formData)
      let form = Object.keys(this.formData)
      if (form.length > 0) {
        this.editMode = true
      } else {
        this.editMode = false
      }
    },
    async saveData() {
      if (await this.$refs.observer.validate()) {
        console.log(await this.$refs.observer.validate())
        await this.$axios
          .$put(`products/${this.product.sku}`, this.formData)
          .then((res) => {
            this.$toast.success(res.message)
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error(err.message)
          })
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
}
</script>

