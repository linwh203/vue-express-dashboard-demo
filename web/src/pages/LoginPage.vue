<template>
  <div class="fullscreen loginPage flex flex-center">
    <div class="formBox q-pa-lg shadow-12 rounded-borders">
      <form
        @submit.prevent.stop="onSubmit"
        @reset.prevent.stop="onReset"
        class="q-gutter-md"
      >
        <div class="text-h5 text-weight-bold text-white text-center">LOGIN</div>
        <q-input
          dark
          v-model="username"
          ref="nameRef"
          filled
          type="text"
          hint="Username"
          lazy-rules
          :rules="nameRules"
        />
        <q-input
          dark
          ref="passwordRef"
          v-model="password"
          filled
          :type="isPwd ? 'password' : 'text'"
          hint="Password"
          lazy-rules
          :rules="passwordRules"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div class="text-center">
          <q-btn label="Login" type="submit" color="secondary" />
          <q-btn
            label="Reset"
            type="reset"
            color="white"
            flat
            class="q-ml-sm"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "src/stores/userStore";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const store = useUserStore();

const username = ref("");
const password = ref("");
const isPwd = ref(true);
const nameRef = ref(null);
const passwordRef = ref(null);
const nameRules = [(val) => (val && val.length > 0) || "Please type username"];
const passwordRules = [
  (val) => (val && val.length > 0) || "Please type password",
];

const onSubmit = async () => {
  nameRef.value.validate();
  passwordRef.value.validate();

  if (nameRef.value.hasError || passwordRef.value.hasError) {
    // form has error
    return;
  }

  const { data } = await api.post("/login", {
    username: username.value,
    password: password.value,
  });
  console.log(data);
  if (data.code != 0) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Login failed! " + data.msg,
    });
  } else {
    store.setUser(data.data);
    $q.notify({
      type: "positive",
      position: "top",
      message: "Login Success!",
    });
    const toPath = route.query.next ? route.query.next : "/dashboard";
    setTimeout(() => {
      router.replace(toPath);
    }, 1000);
  }
};

const onReset = () => {
  username.value = "";
  password.value = "";
  nameRef.value.resetValidation();
  passwordRef.value.resetValidation();
};

onMounted(() => {});
</script>
<style lang="scss">
.loginPage {
  background-color: $blue-grey-10;
}
.formBox {
  width: 50%;
  min-width: 300px;
  max-width: 500px;
  background-color: $blue-grey-5;
}
</style>