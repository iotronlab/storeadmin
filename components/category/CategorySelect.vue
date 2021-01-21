<template>
  <v-container fluid class="px-0">
    <v-row justify="center">
      <v-col>
        <v-sheet elevation="10" rounded="xl">
          <v-sheet class="pa-3 primary text-right" dark rounded="t-xl">
            <v-row no-gutters v-if="disableAdd == false">
              <p>
                No category has been added yet. Select category from the list
                below.
              </p></v-row
            >
            <v-row no-gutters v-if="disableAdd == true">
              <v-chip-group v-model="selectedCategory" column>
                <v-chip
                  v-for="item in productCategory"
                  :key="item.id"
                  :value="item"
                >
                  {{ item.name }}
                </v-chip>
              </v-chip-group></v-row
            >
            <v-slide-x-transition>
              <v-btn small text v-if="stack.length > 1" @click="back">
                <v-icon> mdi-chevron-left </v-icon> back
              </v-btn>
            </v-slide-x-transition>

            <v-btn
              small
              outlined
              :disabled="!selectedCategory"
              @click="removeCategory"
              >del<v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn
              small
              @click="addCategory"
              :disabled="disableAdd == true"
              color="success"
              outlined
              >Save<v-icon>mdi-check-bold</v-icon></v-btn
            >
          </v-sheet>

          <v-row no-gutters style="flex-wrap: nowrap"
            ><v-col cols="4" class="flex-grow-0 flex-shrink-1"> </v-col>

            <v-col cols="8" class="flex-grow-1 flex-shrink-0"> </v-col
          ></v-row>

          <v-list shaped dense nav>
            <v-list-item
              v-for="category in stack[stack.length - 1]"
              :key="category.id"
              @click="clickedItem(category)"
            >
              <!-- <v-list-item-avatar>
          <v-img src="/icon.png"></v-img>
        </v-list-item-avatar> -->

              <v-list-item-title
                >{{ category.name }} &nbsp;<v-icon
                  color="success"
                  v-if="selectedItem == category"
                  >mdi-sticker-check-outline</v-icon
                ></v-list-item-title
              >
            </v-list-item>
            <v-divider />
          </v-list>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    categories: { required: true, type: Array },
    product: { required: true, type: Object },
    productCategory: { required: true, type: Array },
  },
  data() {
    return {
      selectedCategory: null,
      selectedItem: null,
      stack: [this.categories],
    }
  },
  computed: {
    disableAdd() {
      if (this.productCategory.length < 1) {
        return false
      } else {
        return true
      }
    },
  },
  methods: {
    async clickedItem(item) {
      if (!item.children || !item.children.length > 0) {
        this.selectedItem = item
      } else {
        this.stack.push(item.children)
      }
    },
    back() {
      this.stack.pop()
      this.selectedItem = null
    },
    async addCategory() {
      await this.$axios
        .$post(`/products-category/add/${this.product.sku}`, {
          category_id: this.selectedItem.id,
        })
        .then((res) => {
          this.productCategory.push(this.selectedItem)
        })
        .catch((err) => {})
    },
    async removeCategory() {
      await this.$axios
        .$post(`/products-category/del/${this.product.sku}`, {
          category_id: this.selectedCategory.id,
        })
        .then((res) => {
          this.productCategory.pop(this.selectedCategory)
        })
        .catch((err) => {})
    },
  },
}
</script>
