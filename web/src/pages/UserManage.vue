<template>
  <q-page class="full-width full-height">
    <div class="q-pa-md full-width full-height">
      <q-table
        title="User Management"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :selected-rows-label="getSelectedString"
        selection="multiple"
        v-model:selected="selected"
        :loading="loading"
        :rows-per-page-options="[10, 20]"
        :filter="filter"
        :table-class="`myTable`"
      >
        <template v-slot:top>
          <div class="flex full-width justify-between items-center">
            <div class="text-h5 text-primary text-weight-bold q-pb-md">
              User Management
            </div>
            <div class="flex q-gutter-lg">
              <q-btn
                color="secondary"
                :disable="loading"
                label="Add User"
                @click="addUser"
              />
              <q-btn
                class="q-ml-sm"
                color="negative"
                :disable="loading"
                label="Delete User"
                @click="deleteUser"
              />
              <q-space />
              <q-input
                dense
                placeholder="Search user name"
                debounce="300"
                color="primary"
                v-model="filter"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>

      <div class="q-mt-md">
        Selected User:
        {{ selected.length ? selected.map((s) => s.username).join(", ") : "" }}
      </div>
    </div>
    <q-dialog
      v-model="addform"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-secondary text-white" style="width: 500px">
        <q-card-section>
          <div class="text-h6">ADD USER</div>
        </q-card-section>
        <form @submit.prevent.stop="onSubmit" class="q-gutter-md q-pa-lg">
          <q-input
            dark
            v-model="addUsername"
            filled
            required
            type="text"
            hint="Username"
          />
          <q-input
            dark
            v-model="addUserpsw"
            filled
            type="password"
            hint="Password"
          >
          </q-input>
          <div class="flex items-center q-gutter-lg q-px-lg q-pt-md">
            <span>Role: </span>
            <q-radio
              v-model="addUserrole"
              val="admin"
              label="admin"
              dark
              color="dark"
            />
            <q-radio
              v-model="addUserrole"
              val="user"
              label="user"
              dark
              color="dark"
            />
          </div>
          <div class="text-right q-gutter-lg q-pt-lg">
            <q-btn label="Add" type="submit" color="secondary" />
            <q-btn
              flat
              label="CANCEL"
              color="white"
              @click="cancelAddform"
              v-close-popup
            />
          </div>
        </form>
        <q-card-section class="q-pt-none"> </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="persistent"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white" style="width: 500px">
        <q-card-section>
          <div class="text-h6">DELETE USER!</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>Are you sure to delete user:</p>
          <p>
            {{
              selected.length ? selected.map((s) => s.username).join(", ") : ""
            }}
          </p>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            label="DELETE"
            color="negative"
            @click="confirmDelete"
            v-close-popup
          />

          <q-btn flat label="CANCEL" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const selected = ref([]);
const columns = [
  {
    name: "id",
    label: "User ID",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "username",
    label: "User Name",
    align: "left",
    field: (row) => row.username,
    sortable: true,
  },
  {
    name: "password",
    label: "Password",
    align: "left",
    field: (row) => row.password,
    sortable: false,
  },
  {
    name: "role",
    label: "User Role",
    align: "left",
    field: "role",
  },
];
const rows = ref([]);
const loading = ref(false);
const filter = ref("");
const persistent = ref(false);
const addform = ref(false);
const addUsername = ref("");
const addUserpsw = ref("");
const addUserrole = ref("user");

function addUser() {
  addform.value = true;
}

function deleteUser() {
  if (selected.value.length) {
    persistent.value = true;
  }
}

function cancelAddform() {
  addUsername.value = "";
  addUserpsw.value = "";
}

async function onSubmit() {
  loading.value = true;
  try {
    addform.value = false;
    const { data } = await api.post("/addUser", {
      username: addUsername.value,
      password: addUserpsw.value,
      role: addUserrole.value,
    });
    if (data.code !== 0) {
      $q.notify({
        type: "negative",
        message: "add user failed: " + data.msg,
        position: "center",
      });
    } else {
      $q.notify({
        type: "positive",
        message: "add user success",
        position: "center",
        timeout: 2000,
      });
      addUsername.value = "";
      addUserpsw.value = "";
      loadUserList();
    }
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "add user failed: " + error,
      position: "center",
    });
    loading.value = false;
  }
}

async function confirmDelete() {
  if (selected.value.some((item) => item.role == "admin")) {
    $q.notify({
      type: "negative",
      message: "can not delete admin user",
      position: "center",
      timeout: 2000,
    });
    return;
  }
  try {
    const { data } = await api.post("/deleteUser", {
      id: selected.value.map((item) => item.id),
    });
    if (data.code !== 0) {
      $q.notify({
        type: "negative",
        message: "delete user failed: " + data.msg,
        position: "center",
      });
    } else {
      $q.notify({
        type: "positive",
        message: "delete user success",
        position: "center",
        timeout: 2000,
      });
      loadUserList();
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "delete user failed: " + error,
      position: "center",
    });
  }
}

function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${
        selected.value.length > 1 ? "s" : ""
      } selected of ${rows.value.length}`;
}

async function loadUserList() {
  const { data } = await api.get("/getUserList");
  if (data.code != 0) {
    $q.notify({
      type: "negative",
      position: "top",
      message: data.msg,
    });
  } else {
    rows.value = data.data;
  }
  loading.value = false;
}
onMounted(() => {
  loading.value = true;
  setTimeout(() => {
    loadUserList();
  }, 500);
  // loadUserList();
});
</script>
<style lang="scss">
.myTable {
  min-height: 72vh;
}
</style>