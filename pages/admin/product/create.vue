<template>
  <v-container >
    <v-row align="start">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
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
      <PAC :attributes="familyData"/>
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
      add () {
        // this.$router.push(`edit/${this.slug}`);
        if(this.selectedType == "configurable"){
          this.show = true
          this.getFamilyData()
        } else {
          this.show = false
        }
      },
      reset () {
        this.show = false
        this.$refs.form.reset()
      },
      async getFamilyData(){
        await this.$axios.$get(`http://localhost:8000/api/products/create?family=${this.selectedFamily.id}`)
        .then((res) => {
          this.familyData = res.data
          console.log(this.familyData)
        })
        .catch((err) => {
          console.log(err)
        })
      }
    },
    async asyncData({params, app}){
      let families
      await app.$axios.$get(`http://localhost:8000/api/families`)
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
