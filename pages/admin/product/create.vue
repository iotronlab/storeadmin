<template>
  <v-container >
    <v-row align="start">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit="add" method="post"
      >
        <v-select
          v-model="selectedType"
          :items="types"
          :rules="[v => !!v || 'Item is required']"
          label="Product Type"
          required
        ></v-select>
        <v-select
          return-object
          v-model="selectedFamily"
          :items="families"
          item-value="id"
          item-text="name"
          :rules="[v => !!v || 'Item is required']"
          label="Attribute Family"
          required
        ></v-select>
        <v-text-field
          v-model="slug"
          :rules="[v => !!v || 'Name is required']"
          label="SKU"
          required
        ></v-text-field>
        <v-btn
          :disabled="!valid"
          color="primary"
          class="mr-4"
          @click="add"
        >
          ADD
        </v-btn>
        <v-btn
          color="error"
          class="mr-4"
          @click="reset"
        >
          Reset
        </v-btn>
      </v-form>
    </v-row>
    <div v-if="show && selectedType == 'configurable'">
      <PAC :attributes="{data: familyData, sku: this.slug, family: this.selectedFamily.id}"/>
    </div>
  </v-container>
</template>
<script>
import PAC from '@/components/Product/ProductAttributeComponent.vue'
  export default {
    components: {
      PAC
    },
    data(){
      return {
        valid: true,
        selectedType: null,
        show: false,
        types: [
          "simple",
          "configurable",
          "bundle",
        ],
        selectedFamily: null,
        slug: '',
        familyData: null,
      }
    },
    methods: {
      async add () {
        if(this.selectedType == "configurable"){
          this.show = true
          this.getFamilyData()
        } else if(this.selectedType == 'simple') {
            await this.$axios.$post('products', {
                type: 'simple',
                attribute_family_id: this.selectedFamily.id,
                sku: this.slug
            })
            .then((res) => {
              this.$router.push({path: `edit/${this.slug}`, query: {data: res.data}});
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.show = false
        this.$refs.form.reset()
      },
      async getFamilyData(){
        await this.$axios.$get(`http://localhost:8000/api/products/create?family=${this.selectedFamily.id}`)
        .then((res) => {
          this.familyData = res.data
          // console.log(this.familyData)
        })
        .catch((err) => {
          console.log(err)
        })
      }
    },
    mounted() {
      // console.log("axios below")
      // console.log(this.$app)
    },
    async asyncData({params, app}){
      let families
      await app.$axios.$get(`families`)
      .then((res) => {
        families = res.data
      })
      .catch ((err) => {
        console.log(err)
      })
      return {families: families}
    },
  }
</script>
