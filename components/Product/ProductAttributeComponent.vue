<template>
  <v-card>
    <v-container fluid>
        <v-row
            align="center"
            v-for="attribute in attributes[0]"
            :key="attribute.id"
        >
            <v-col
            cols="12"
            sm="6"
            >
            <v-select
                v-model="values[attribute.code]"
                :items="attribute.options"
                item-value="id"
                item-text="admin_name"
                attach
                chips
                :label="attribute.code"
                multiple
                return-object
            ></v-select>
            </v-col>
        </v-row>
        {{values}}
        <v-btn @click='save'>
          Save
        </v-btn>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    props:{
      attributes: {
        required: true,
        type: Array,
      },
    },
    data: () => ({
      values: {},
      data: {},
    }),
    methods: {
      async save(){
        this.data['type'] = 'configurable'
        this.data['sku'] = this.attributes[1]
        this.data['attribute_family_id'] = this.attributes[2]
        for (const [key, vals] of Object.entries(this.values)){
          for (let i = 0; i < vals.length; i++){
            this.data[`super_attributes[${key}][${i}]`] = vals[i].id
          }
        };
        console.log(this.data)
        await this.$axios.$post(`products?type=configurable&sku=${this.attributes[1]}&family=${this.attributes[2]}`, this.data)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      },
      test(val){
        console.log(val)
      }
    }
  }
</script>