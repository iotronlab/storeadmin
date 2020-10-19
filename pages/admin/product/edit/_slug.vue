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
                :label="attribute.code"
                hide-details="auto"
              ></v-text-field>
            </div>
            <div v-else-if="attribute.type == 'select'">
              <v-select
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
                v-model="state"
                :label="attribute.code"
                input-value="false"
              ></v-switch>
            </div>
            <div v-else-if="attribute.type == 'date'">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Picker in menu"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
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
          >0</v-text-field>
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
    </v-expansion-panels>
  </v-container>
</template>
<script>
  export default {
    data(){
      return {
        state: null,
        text: null,
        panel: [0, 1],
        panel: [],
        valid: true,
        select_type: null,
        data: [],
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
    async asyncData({params, app}){
      let data = null;
      await app.$axios.$get('groups?family=1')
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        console.log(err)
      })
      return {
        data: data
      }
    }
  }
</script>