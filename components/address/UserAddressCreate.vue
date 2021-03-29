<template>
  <v-container fluid>
    <ValidationObserver ref="observer">
      <form action="#" @submit.prevent="store">
        <v-app-bar fixed dense>
          <v-btn @click="reset" text width="30%">
            <v-icon left>mdi-close</v-icon>Cancel
          </v-btn>
          <v-btn color="secondary" type="submit" width="70%">
            {{ edit ? 'Update Address' : 'Add Address' }}</v-btn
          >
        </v-app-bar>
        <ValidationProvider
          v-slot="{ errors }"
          name="Name"
          rules="required|max:20"
        >
          <v-text-field
            label="Name"
            filled
            dense
            :counter="20"
            :error-messages="errors"
            v-model="address.name"
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="Contact"
          rules="required|digits:10"
        >
          <v-text-field
            label="Contact"
            v-model="address.contact"
            :counter="10"
            filled
            dense
            :error-messages="errors"
          ></v-text-field
        ></ValidationProvider>

        <v-radio-group mandatory row v-model="address.type">
          <v-radio
            v-for="type in addressType"
            :key="type"
            :label="type"
            :value="type"
          ></v-radio>
        </v-radio-group>
        <ValidationProvider
          v-slot="{ errors }"
          name="Address"
          rules="required|max:120"
        >
          <v-textarea
            label="Address"
            placeholder="Building and Street Number"
            filled
            dense
            rows="3"
            row-height="10"
            no-resize
            :error-messages="errors"
            v-model="address.address_1"
          ></v-textarea
        ></ValidationProvider>
        <v-textarea
          label="Address (optional)"
          filled
          dense
          rows="3"
          row-height="10"
          no-resize
          v-model="address.address_2"
        ></v-textarea>

        <v-text-field
          label="Landmark (optional)"
          filled
          dense
          v-model="address.landmark"
        ></v-text-field>
        <ValidationProvider
          v-slot="{ errors }"
          name="City"
          rules="required|max:100"
        >
          <v-text-field
            label="City"
            filled
            dense
            :error-messages="errors"
            v-model="address.city"
          ></v-text-field
        ></ValidationProvider>

        <ValidationProvider
          v-slot="{ errors }"
          name="Pin code"
          rules="required|digits:6"
        >
          <v-text-field
            label="Pin Code"
            :counter="6"
            filled
            dense
            :error-messages="errors"
            v-model="address.postal_code"
          ></v-text-field
        ></ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="State"
          rules="required|max:100"
        >
          <v-text-field
            label="State"
            filled
            dense
            :error-messages="errors"
            v-model="address.state"
          ></v-text-field
        ></ValidationProvider>
        <ValidationProvider v-slot="{ errors }" name="Country" rules="required">
          <v-select
            label="Country"
            :items="countries"
            item-text="name"
            item-value="id"
            filled
            dense
            :error-messages="errors"
            v-model="address.country_id"
            @change="updateCountry"
          ></v-select
        ></ValidationProvider>

        <v-switch
          class="mt-0"
          v-model="address.default"
          label="Set as Default"
        ></v-switch>
        <v-btn class="" color="secondary" type="submit">
          {{ edit ? 'Update Address' : 'Add Address' }}</v-btn
        >
        <!-- <v-btn class="mb-1 ml-1" color="red" dark @click.prevent="$emit('cancel')"
        >cancel</v-btn
      > -->
      </form></ValidationObserver
    >
  </v-container>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
export default {
  props: {
    addressData: {
      type: Object,
      required: false,
      // default: function () {
      //   return {
      //     name: '',
      //     contact: '',
      //     type: 'Home',
      //     address_1: '',
      //     address_2: '',
      //     landmark: '',
      //     city: '',
      //     postal_code: '',
      //     state: '',
      //     country_code: '',
      //     default: true,
      //   }
      // },
    },
    edit: { type: Boolean, required: true },
  },
  components: {
    ValidationObserver,
  },
  data() {
    return {
      addressType: ['Home', 'Work', 'Other'],
      countries: [],
      defaultAddress: {
        name: '',
        contact: '',
        type: 'Home',
        address_1: '',
        address_2: '',
        landmark: '',
        city: '',
        postal_code: '',
        state: '',
        country_id: '',
        country_code: '',
        default: false,
      },
    }
  },
  computed: {
    address: {
      get() {
        let address = new Object()
        if (this.edit == false) {
          Object.assign(address, this.defaultAddress)
        } else if (this.addressData && this.edit == true) {
          Object.assign(address, this.addressData)
        }
        return address
      },
      set(value) {
        //this.address = value
        Object.assign(this.address, value)
        // return address
      },
    },
  },

  async fetch() {
    await this.$axios
      .$get('countries')
      .then((res) => {
        this.countries = res
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    formUpdated() {
      const addressKeys = Object.keys(this.addressData)
      let formUpdated = false
      for (let key of addressKeys) {
        //comparing both object and building the form

        if (this.address[key] != this.addressData[key]) {
          formUpdated = true
        }
      }
      if (formUpdated == false) {
        this.$toast.error("Address hasn't been updated.")
      }
      return formUpdated
    },
    async store() {
      if (this.edit == false) {
        if (await this.$refs.observer.validate()) {
          await this.$axios
            .$post('vendor/address', this.address)
            .then((res) => {
              this.updateData(res.data)
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.showFormErrors()
        }
      } else if (await this.formUpdated()) {
        if (await this.$refs.observer.validate()) {
          await this.$axios
            .$put(`vendor/address/${this.address.id}`, this.address)
            .then((res) => {
              this.updateData(res.data)
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.showFormErrors()
        }
      }
      // this.$emit('created', response.data)
    },
    showFormErrors() {
      let errors = Object.values(this.$refs.observer.errors)

      errors.forEach((err) => {
        //  console.log(val)
        if (err.length > 0) {
          err.forEach((e) => {
            this.$toast.error(e)
          })
        }
      })
    },
    updateData(data) {
      this.$refs.observer.reset()
      this.address = this.defaultAddress
      this.$emit('update:address', data)
    },
    reset() {
      this.$refs.observer.reset()
      this.address = this.defaultAddress
      this.$emit('reset:address')
    },
    updateCountry() {
      let country = this.countries.find(
        (el) => el.id == this.address.country_id
      )

      console.log(country)
      this.address.country_code = country.iso_code_2
    },
  },
}
</script>
