<template>
  <v-container fluid>
    <v-row no-gutters justify="center">
      <v-col lg="5">
        <v-card>
          <v-container fluid>
            <v-row no-gutters>
              <v-col class="d-flex justify-center align-center">
                <v-form @submit.prevent="login" id="login-form" method="post">
                  <v-img
                    src="/logo.png"
                    contain
                    alt="artistic logo"
                    height="120"
                    width="120"
                    max-width="120"
                    class="mx-auto"
                  />
                  <p class="overline text-center">Creator Panel</p>
                  <v-text-field
                    prepend-icon="mdi-email"
                    label="Email ID"
                    name="email"
                    type="email"
                    v-model="email"
                    autocomplete="off"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    v-model="password"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPass ? 'text' : 'password'"
                    label="Password"
                    name="password"
                    hint="At least 8 characters"
                    autocomplete="off"
                    @click:append="showPass = !showPass"
                  ></v-text-field>

                  <div class="d-flex justify-center">
                    <v-btn
                      color="primary"
                      rounded
                      outlined
                      type="submit"
                      class="mt-4"
                      >LogIn</v-btn
                    >
                  </div>
                </v-form>
              </v-col>
            </v-row>

            <br />
            <hr />
            <br />
            <v-row no-gutters class="my-2" justify="space-around">
              <v-btn
                text
                x-small
                :to="{ path: '/verify/reset' }"
                @click="dialog = false"
                >Forgot password</v-btn
              >
            </v-row>
          </v-container>
        </v-card></v-col
      ></v-row
    >
  </v-container>
</template>
<script>
export default {
  middleware: ['auth-user'],
  data() {
    return {
      email: '',
      password: '',
      showPass: false,
      rules: {
        required: (v) => !!v || 'Required.',
        min: (v) => v.length >= 8 || 'Min 8 characters',
        emailValid: (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      },

      message: '',
    }
  },
  methods: {
    async login() {
      await this.$auth
        .loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
          this.$toast.error(err.message)
        })
      this.checkLogin()
    },

    checkLogin() {
      console.log(this.$auth.user)
      if (this.$auth.loggedIn) {
        this.dialog = false
      } else {
        this.message = 'Invalid email or password'
      }
    },
  },
}
</script>
