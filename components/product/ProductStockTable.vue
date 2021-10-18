<template>
  <v-container fluid>
    <v-row no-gutters align="center">
      <h4 class="text-caption" v-if="stocks.length < 1">
        There are no stocks in your inventory at the moment.
      </h4>
      <h4 class="text-caption" v-if="stocks.length >= 1">
        Product Stocks({{ stocks.length }}) | Total Quantity
      </h4> </v-row
    ><v-divider class="my-2" />
    <v-data-table
      :headers="headers"
      :items="stocks"
      show-expand
      single-expand
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat dense>
          <v-toolbar-title>Inventory</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Add Stock
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-body-1">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <p class="text-subtitle-2">Stock Quantity</p>
                <v-text-field
                  filled
                  dense
                  label="quantity"
                  v-model="editedItem.quantity"
                />
                <p class="text-subtitle-2">Stock Location</p>
                <AddStock
                  :address="editedItem.address"
                  @update:address="updateAddress"
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :disabled="!hasAddress"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="overline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">More info about {{ item.address }}</td>
      </template>

      <template v-slot:no-data>
        <h6 class="text-caption text-center">
          There are no stocks in your inventory.
        </h6>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  async fetch() {
    await this.$axios
      .$get(`products/${this.product.sku}/stocks`)
      .then((res) => {
        this.stocks = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    stocks: [],
    headers: [
      { text: 'quantity', value: 'quantity' },
      { text: 'created', value: 'created_at' },
      { text: 'updated', value: 'updated_at' },

      { text: 'Actions', value: 'actions', sortable: false },
      { text: 'Location', value: 'data-table-expand' },
    ],

    editedIndex: -1,
    editedItem: { quantity: 1, address: { id: null } },
    defaultItem: { quantity: 1, address: { id: null } },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Stock' : 'Edit Stock'
    },
    hasAddress() {
      if (this.editedItem.address.id) {
        return true
      } else {
        return false
      }
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  // created() {},

  methods: {
    editItem(item) {
      this.editedIndex = this.stocks.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.stocks.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      await this.$axios
        .$delete(`stocks/${this.editedItem.id}`)
        .then((res) => {
          this.stocks.splice(this.editedIndex, 1)
          this.$toast.success(res.message)
        })
        .catch((err) => {
          console.log(err)
        })

      this.closeDelete()
    },

    close() {
      this.dialog = false

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    updateAddress(value) {
      this.editedItem.address = value
    },

    async save() {
      if (this.editedIndex > -1) {
        console.log(this.editedItem)
        await this.$axios
          .$patch(`stocks/${this.editedItem.id}`, {
            quantity: this.editedItem.quantity,
            address_id: this.editedItem.address.id,
          })
          .then((res) => {
            Object.assign(this.stocks[this.editedIndex], res.data)
            this.$toast.success(res.message)
          })
          .catch((err) => {
            console.log(err)
          })
        // Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        await this.$axios
          .$post(`products/${this.product.sku}/stocks`, {
            quantity: this.editedItem.quantity,
            address_id: this.editedItem.address.id,
          })
          .then((res) => {
            this.stocks.push(res.data)
            this.$toast.success(res.message)
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.close()
    },
  },
}
</script>
