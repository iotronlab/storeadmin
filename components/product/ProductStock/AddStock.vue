<template>
  <v-container fluid>
    <section v-if="$fetchState.pending">
      <PageLoader :message="'fetching your addresses...'" />
    </section>
    <section v-if="$fetchState.error">
      There was some error fetching your addresses.
    </section>
    <section v-if="!$fetchState.pending">
      <h4 v-if="addresses.length <= 0" class="text-subtitle-2">
        You don't have any saved addresses. Add an address.
      </h4>
      <v-item-group
        v-else
        v-model="selectedAddress.id"
        mandatory
        @change="updateAddress"
      >
        <v-container fluid class="pa-0">
          <v-row no-gutters>
            <v-col v-for="(address, n) in addresses" :key="n" cols="12" md="4">
              <v-item v-slot="{ active, toggle }" :value="address.id">
                <v-card class="nucard" @click="toggle">
                  <v-row no-gutters class="fill-height">
                    <v-col class="ma-4">
                      <v-row no-gutters>
                        <h5 class="text-subtitle-2">
                          {{ address.name }}
                          <v-chip small outlined color="primary">
                            {{ address.type }}</v-chip
                          >
                        </h5>
                        <v-spacer />
                        <v-scroll-y-transition>
                          <v-chip small outlined color="success" v-if="active"
                            ><v-icon small>mdi-map-marker-check</v-icon
                            >selected</v-chip
                          >
                        </v-scroll-y-transition></v-row
                      >
                      <v-divider class="my-1" />

                      <h6 class="text--secondary text-caption">
                        {{ address.contact }}<br />
                        {{ address.address_1 }}
                        {{ address.address_2 || null }}, <br />
                        {{ address.landmark }}<br />
                        {{ address.city }}.<br />
                        Pin {{ address.postal_code }} <br />
                        State {{ address.state }}<br />
                        Country {{ address.country_code }}
                      </h6></v-col
                    >
                  </v-row>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </section>
  </v-container>
</template>

<script>
export default {
  props: {
    address: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      addresses: [],
      selectedAddress: {},
    }
  },
  mounted() {
    this.selectedAddress = Object.assign({}, this.address)
  },
  watch: {
    address(val) {
      this.selectedAddress = Object.assign({}, val)
    },
  },
  computed: {
    // form() {
    //   let form = Object.assign({}, this.stock)
    //   console.log(form == this.stock)
    //   return form
    // },
  },
  async fetch() {
    await this.$axios
      .$get('vendor/address')
      .then((res) => {
        this.addresses = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  },

  methods: {
    updateAddress() {
      this.$emit('update:address', this.selectedAddress)
    },
  },
}
</script>

