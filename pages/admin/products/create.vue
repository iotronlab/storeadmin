<template>
  <v-container fluid>
      <h4 class="title">Product Creation</h4>
    <v-row no-gutters>

      <v-col>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit="add"
          method="post"
        ><p><ul><li>simple product is unique and has no variants.</li>
        <li>configurable product has variants. eg, same product in multiple colors, sizes.</li>
        <li>bundle products consist of other products.</li></ul></p>
          <v-select
            v-model="selectedType"
            :items="types"
            :rules="[(v) => !!v || 'product type needs to be selected']"
            label="Product Type"
            filled
            dense
            required
          ></v-select><p><ul><li>attributes family adds a group of attributes to your product. (eg. color, size, material, medium)</li>
        <li>choose the family according to your product type.</li>
    </ul></p>
          <v-select
            return-object
            v-model="selectedFamily"
            :items="families"
            item-value="id"
            item-text="name"
            :rules="[(v) => !!v || 'attribute family needs to be selected']"
            label="Attribute Family"
            filled
            dense
            required
          ></v-select><p><ul><li>stock keeping unit (sku) is the unique id that will be assigned to your product.</li>
        <li>the sku value will be the unique url of your product at urartistic.com/product/sku.</li>
    </ul></p>
          <v-text-field
              v-model="slug"
            :rules="[(v) => !!v || 'unique sku name is required']"
            label="SKU"
            filled
            dense
            required
          ></v-text-field>
          <v-btn :disabled="!valid" color="primary" class="mr-4" @click="add">
            ADD
          </v-btn>
          <v-btn color="error" class="mr-4" @click="reset"> Reset </v-btn>
        </v-form></v-col
      >
    </v-row>
    <div v-if="showConfig && selectedType == 'configurable'">
      <PAC
        :attributes="{
          data: familyData,
          sku: this.slug,
          family: this.selectedFamily.id,
        }"
      />
    </div>
  </v-container>
</template>
<script>
import PAC from '@/components/Product/ProductAttributeComponent.vue'
export default {
  components: {
    PAC,
  },
  data() {
    return {
      valid: true,
      selectedType: null,
      showConfig: false,
      types: ['simple', 'configurable', 'bundle'],
      selectedFamily: null,
      slug: '',
      familyData: null,
    }
  },
  methods: {
    async add() {
      if (this.selectedType == 'configurable') {
        this.showConfig = true
        this.getFamilyData()
      } else if (this.selectedType == 'simple') {
        await this.$axios
          .$post('products', {
            type: 'simple',
            attribute_family_id: this.selectedFamily.id,
            sku: this.slug,
          })
          .then((res) => {
            this.$router.push({
              path: `edit/${this.slug}`,
              // query: { data: res.data },
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.showConfig = false
      this.$refs.form.reset()
    },
    async getFamilyData() {
      await this.$axios
        .$get(`http://localhost:8000/api/family/${this.selectedFamily.id}`)
        .then((res) => {
          this.familyData = res.data
          // console.log(this.familyData)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  mounted() {
    // console.log("axios below")
    // console.log(this.$app)
  },
  async asyncData({ params, app }) {
    let families
    await app.$axios
      .$get(`families`)
      .then((res) => {
        families = res.data
      })
      .catch((err) => {
        console.log(err)
      })
    return { families: families }
  },
}
</script>
