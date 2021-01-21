<template>
  <v-container>
    <v-row no-gutters justify="center">
      <v-col>
        <v-toolbar flat rounded>
          <v-toolbar-title class="text-body-2"
            >Welcome {{ user.display_name }}</v-toolbar-title
          >

          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider />

        <!-- nuxt-child routes here -->
        <v-card flat>
          <v-img
            :src="
              userData.coverimg
                ? userData.coverimg
                : require('@/assets/img/default-dp.png')
            "
            :aspect-ratio="16 / 5"
          />
          <v-row no-gutters class="mt-n10"
            ><v-card
              :img="
                userData.avatarimg
                  ? userData.avatarimg
                  : require('@/assets/img/default-dp.png')
              "
              width="200"
              height="200"
              color="accent"
              class="ml-6"
            ></v-card>
            <v-btn small class="ma-1" @click="uploadImageData('profile')"
              ><v-icon left>mdi-image-edit-outline</v-icon>display
              picture</v-btn
            >
            <v-btn small class="ma-1" @click="uploadImageData('cover')"
              ><v-icon left>mdi-image-edit-outline</v-icon>cover picture</v-btn
            ></v-row
          ><ImageUpload
            :openModal="uploadImage"
            :imageType="imageType"
            @cancel:upload="cancelUpload"
            @upload:success="uploadSuccess"
          />

          <v-container fluid>
            <ValidationObserver ref="observer">
              <v-card-actions>
                <v-btn>Change password</v-btn>
                <v-slide-y-transition>
                  <v-btn
                    class="mx-2"
                    color="success"
                    v-if="dataUpdated == true"
                    @click.prevent="updateUserData"
                    >Save</v-btn
                  >
                </v-slide-y-transition></v-card-actions
              >
              <ValidationProvider
                v-slot="{ errors }"
                name="Display Name"
                rules="required|max:40"
              >
                <v-text-field
                  v-model="userData.display_name"
                  label="Display Name"
                  placeholder="Name displayed on the profile"
                  :color="!editMode ? 'primary' : 'success'"
                  filled
                  dense
                  type="text"
                  :readonly="!editMode"
                  :error-messages="errors"
                  append-icon="mdi-account-edit-outline"
                  @click:append="editMode = !editMode"
                />
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Contact Name"
                rules="required|max:40"
              >
                <v-text-field
                  v-model="userData.contact_name"
                  label="Contact Name"
                  placeholder="Name displayed on the parcel"
                  :color="!editMode ? 'primary' : 'success'"
                  filled
                  dense
                  type="text"
                  :readonly="!editMode"
                  :error-messages="errors"
                  append-icon="mdi-account-edit-outline"
                  @click:append="editMode = !editMode"
              /></ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Email"
                rules="required|email"
              >
                <v-text-field
                  v-model="userData.email"
                  label="Email"
                  placeholder="Your registered mail address"
                  :color="!editMode ? 'primary' : 'success'"
                  filled
                  dense
                  type="text"
                  :readonly="!editMode"
                  :error-messages="errors"
                  append-icon="mdi-account-edit-outline"
                  @click:append="editMode = !editMode"
              /></ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Profile url"
                rules="required|max:40"
              >
                <v-text-field
                  v-model="userData.slug"
                  label="Profile Url"
                  placeholder="profile url on artistic"
                  :color="!editMode ? 'primary' : 'success'"
                  filled
                  dense
                  type="text"
                  :readonly="!editMode"
                  :error-messages="errors"
                  hint="urartistic.com/artists/profile-url"
                  append-icon="mdi-account-edit-outline"
                  @click:append="editMode = !editMode"
              /></ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Name"
                rules="required|digits:10"
              >
                <v-text-field
                  v-model="userData.contact"
                  label="Contact Number"
                  placeholder="Your Contact number"
                  :color="!editMode ? 'primary' : 'success'"
                  filled
                  dense
                  type="text"
                  :readonly="!editMode"
                  :error-messages="errors"
                  append-icon="mdi-account-edit-outline"
                  @click:append="editMode = !editMode"
              /></ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Bio"
                rules="required|min:60|max:240"
              >
                <v-textarea
                  v-model="userData.description"
                  label="Profile Bio"
                  placeholder="Bio displayed on your profile"
                  :color="!editMode ? 'primary' : 'success'"
                  filled
                  dense
                  type="text"
                  :readonly="!editMode"
                  :error-messages="errors"
                  append-icon="mdi-account-edit-outline"
                  @click:append="editMode = !editMode"
              /></ValidationProvider>
            </ValidationObserver>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { ValidationObserver } from 'vee-validate'
export default {
  middleware: ['auth'],
  data() {
    return {
      editMode: false,
      formData: {},

      userData: {},
      uploadImage: false,
      imageType: '',
    }
  },
  components: {
    ValidationObserver,
  },

  mounted() {
    if (this.user) {
      //copying logged in userdata to local data
      this.userData = Object.assign({}, this.user)
    }
  },
  watch: {
    user() {
      //copying logged in userdata to local data on update
      this.userData = Object.assign({}, this.user)
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    dataUpdated() {
      const userKeys = Object.keys(this.user)
      let dataUpdated = new Boolean()
      for (let key of userKeys) {
        //comparing both object and building the form
        if (this.user[key] !== this.userData[key]) {
          Object.assign(this.formData, { [key]: this.userData[key] })
          dataUpdated = true
        } else {
          delete this.formData[key]
        }
      }
      return dataUpdated
    },
  },
  methods: {
    // setLocalUser(value) {
    //   //  this.userData = Object.assign({}, value)
    //   // this.modifiedData = true
    // },
    edit() {
      this.editMode = true
    },
    uploadImageData(img) {
      this.imageType = img
      this.uploadImage = true
    },
    uploadSuccess(res) {
      this.$toast.success(res.message)
      this.$auth.setUser(res.data.vendor)

      this.uploadImage = false
    },
    async updateUserData() {
      if (await this.$refs.observer.validate()) {
        await this.$axios
          .$post('vendor/profile-update', this.formData)
          .then((res) => {
            this.uploadSuccess(res)
          })
          .catch((err) => {
            this.$toast.error(err.message)
          })
      } else {
        let errors = Object.values(this.$refs.observer.errors)

        errors.forEach((err) => {
          //  console.log(val)
          if (err.length > 0) {
            err.forEach((e) => {
              this.$toast.error(e)
            })
          }
        })
      }
    },
    cancelUpload() {
      this.uploadImage = false
    },
  },
}
</script>
