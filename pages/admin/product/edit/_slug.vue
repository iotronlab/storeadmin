<template>
  <v-container >
    <v-expansion-panels
    v-model="panel"
    >
      <v-expansion-panel 
        v-for="group in data.groups"
        :key="group[id]"
      >
        <v-expansion-panel-header>{{group.name}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-for="attribute in group.attributes"
            :key="attribute.id"
          >
            <div v-if="attribute.type == 'text' || attribute.type == 'price'">
              <v-text-field
                v-model="values[attribute.code]"
                :label="attribute.code"
                hide-details="auto"
              ></v-text-field>
            </div>
            <div v-else-if="attribute.type == 'select'">
              <v-select
                v-model="values[attribute.code]"
                :items="attribute.options"
                item-value="id"
                item-text="admin_name"
                :label="attribute.code"
                dense
                outlined
              ></v-select>
            </div>
            <div v-else-if="attribute.type == 'boolean'">
              <v-switch
                v-model="values[attribute.code]"
                :label="attribute.code"
                input-value="false"
              ></v-switch>
            </div>
            <div v-else-if="attribute.type == 'date'">
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
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </div>
            <div v-else-if="attribute.type == 'textarea'">
              <v-textarea
                v-model="values[attribute.code]"
                :label="attribute.code"
                no-resize
                rows="3"
                :value="text"
              ></v-textarea>
            </div>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Inventories</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            label="Default"
            hide-details="auto"
          ></v-text-field>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Images</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn primary>Add Image</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Categories</v-expansion-panel-header>
        <v-expansion-panel-content></v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-if="response.type == 'configurable'">
        <v-expansion-panel-header>variant</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-for="variant in response.variants"
            :key="variant.product_id"
          >
            <v-col>
              <v-text-field
                v-model="variant.sku"
                label="SKU"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Name"
                hide-details="auto"
              ></v-text-field>
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
              <v-select
                label="Qty"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                v-model="variant.price"
                label="Price"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="SKU"
                hide-details="auto"
              ></v-text-field>
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
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
  export default {
    data(){
      return {
        values: {},
        state: null,
        text: null,
        panel: [0, 1],
        panel: [],
        valid: true,
        select_type: null,
        data: [],
        response: {},
        select_attribute: null,
        attributes: [],
        slug: '',
        date: new Date().toISOString().substr(0, 10),
        menu: false,
        modal: false,
        menu2: false,
      }
    },
    methods: {
      allowedDates: val => parseInt(val.split('-')[2], 10) % 2 === 0,
    },
    async asyncData({params, app, query}){
      let data = null;
      await app.$axios.$get('groups?family=1')
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        console.log(err)
      })
      return {
        data: data,
        response: query.data
      }
    }
  }
</script>