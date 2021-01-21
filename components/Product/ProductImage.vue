<template>
  <v-container fluid>
    <v-row no-gutters v-if="product.images.length < 1"
      >No images uploaded yet.</v-row
    >
    <v-item-group>
      <v-container>
        <v-row>
          {{ product.images }}
          <v-col v-for="(image, i) in product.images" :key="i" cols="12" md="4">
            <v-item v-slot="{ active, toggle }">
              <v-card
                :color="active ? 'primary' : ''"
                class="d-flex align-center"
                dark
                height="200"
                @click="toggle"
                :img="image.url"
              >
                <v-scroll-y-transition>
                  <div v-if="active" class="flex-grow-1 text-center">
                    <v-btn small outlined @click="removeImage(image)"
                      >del<v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>

    <v-row no-gutters v-if="disableUpload == false">
      <v-file-input
        v-model="files"
        :rules="rules"
        accept="image/png, image/jpeg"
        placeholder="Select upto 4 images"
        prepend-icon="mdi-camera"
        label="Upload images"
        multiple
        :show-size="true"
        counter
        ><template v-slot:selection="{ text, file }">
          <v-chip
            small
            label
            :color="file.size < 1024 * 1024 ? 'primary' : 'error'"
          >
            {{ text }}
          </v-chip>
        </template></v-file-input
      ><v-btn large @click="upload" :loading="progress > 1"
        >upload <v-icon right> mdi-cloud-upload </v-icon>
        <template v-slot:loader>
          <span class="custom-loader">
            <v-progress-circular
              size="50"
              :rotate="-90"
              :value="progress"
              color="primary"
            >
              {{ progress }}
            </v-progress-circular>
          </span>
        </template></v-btn
      ></v-row
    >
  </v-container>
</template>
<script>
export default {
  props: {
    product: Object,
    required: true,
  },
  data() {
    return {
      files: [],
      progress: 0,
      rules: [
        (files) => !files || files.length < 5 || 'Max 4 images can be uploaded',
        (files) =>
          !files ||
          !files.some((file) => file.size > 1024 * 1024) ||
          'Image size should be less than 1 MB!',
      ],
    }
  },
  computed: {
    /*The FormData : Here We Make A Form With Images Data To Submit.*/
    form() {
      let form = new FormData()

      this.files.forEach((file, index) => {
        form.append('product[' + index + ']', file)
      })

      return form
    },
    disableUpload() {
      if (this.product.images.length < 5) {
        return false
      } else {
        return true
      }
    },
  },
  methods: {
    removeFile(key) {
      this.files.splice(key, 1)
    },
    remove(item) {
      const index = this.files.indexOf(item.name)
      if (index >= 0) this.files.splice(index, 1)
    },
    async upload() {
      const config = {
        onUploadProgress: (progressEvent) =>
          (this.progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )),
      }

      await this.$axios
        .post(`products/upload-image/${this.product.sku}`, this.form)
        .then((res) => {
          this.progress = 0
          this.files = []
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err), this.$toast.error(err.message), (this.progress = 0)
        })
    },
    async removeImage(image) {
      await this.$axios
        .post(`products/delete-image/${image.id}`)
        .then((res) => {
          this.product.images.pop(image)
          console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
