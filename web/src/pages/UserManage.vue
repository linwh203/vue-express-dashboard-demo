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

      <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
    </div>
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
    name: "role",
    label: "User Role",
    align: "left",
    field: "role",
  },
];
const rows = ref([]);
const loading = ref(false);
const filter = ref("");

function addUser() {

}

function deleteUser() {
  
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
  }, 1000);
  // loadUserList();
});
</script>