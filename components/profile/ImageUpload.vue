<template>
  <v-dialog v-model="openModal" persistent>
    <v-card>
      <v-card-title class="text-overline">
        upload {{ imageType }} image
      </v-card-title>

      <v-container fluid>
        <v-form v-model="formValid">
          <v-file-input
            v-model="image"
            :rules="rules"
            accept="image/png, image/jpeg"
            prepend-icon="mdi-camera"
            label="upload image"
            :show-size="true"
            ><template v-slot:selection="{ text, file }">
              <v-chip
                small
                label
                :color="file.size < 1024 * 1024 ? 'primary' : 'error'"
              >
                {{ text }}
              </v-chip>
            </template></v-file-input
          >
          <v-img v-if="url" contain :src="url"></v-img></v-form
      ></v-container>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="cancelUpload" color="warning"> cancel </v-btn>

        <v-btn
          @click="upload"
          :loading="progress > 1"
          :disabled="!formValid"
          color="success"
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
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    openModal: {
      type: Boolean,
      default: false,
      required: false,
    },
    imageType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formValid: true,
      image: null,
      progress: 0,
      rules: [
        (value) =>
          !value ||
          value.size < 1024 * 1024 ||
          'Image size should be less than 1 MB!',
      ],
    }
  },
  computed: {
    /*The FormData : Here We Make A Form With Images Data To Submit.*/
    form() {
      let form = new FormData()
      if (this.imageType == 'profile') {
        form.append('profile', this.image)
      } else if (this.imageType == 'cover') {
        form.append('cover', this.image)
      }

      return form
    },
    url() {
      if (this.image) {
        return URL.createObjectURL(this.image)
      } else {
        return null
      }
    },
  },
  methods: {
    async upload() {
      const config = {
        onUploadProgress: (progressEvent) =>
          (this.progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )),
      }

      await this.$axios
        .$post('vendor/upload-image', this.form)
        .then((res) => {
          this.progress = 0

          this.$emit('upload:success', res)
        })
        .catch((err) => {
          console.log(err),
            (this.progress = 0),
            this.$toast.error(err.message),
            this.$emit('cancel:upload')
        })
    },
    cancelUpload() {
      this.image = null
      this.$emit('cancel:upload')
    },
  },
}
</script>

