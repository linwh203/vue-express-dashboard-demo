<template>
  <q-page class="full-width full-height">
    <div class="q-pa-md full-width full-height">
      <q-table
        title="Login Audit"
        :rows="rows"
        :columns="columns"
        row-key="time"
        :loading="loading"
        :rows-per-page-options="[20, 40]"
        :filter="filter"
        :table-class="`myTable`"
      >
        <template v-slot:top>
          <div class="flex full-width justify-between items-center">
            <div class="text-h5 text-primary text-weight-bold q-pb-md">
              Login Audit
            </div>
            <div class="flex q-gutter-lg">
              <q-btn color="primary" label="Select Date">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="toggleDatePicker"
                >
                  <q-date v-model="dateRange" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="dark" flat />
                      <q-btn
                        @click="resetDate"
                        label="Reset"
                        color="secondary"
                        flat
                      />
                      <q-btn
                        @click="loadDataByDate"
                        label="OK"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
              <q-btn
                color="secondary"
                :disable="loading"
                label="Export CSV"
                @click="exportCSV"
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
    </div>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, computed, onMounted } from "vue";
import { useQuasar, date, exportFile } from "quasar";

const columns = [
  {
    name: "time",
    label: "Login Time",
    align: "left",
    field: (row) => row.time,
    format: (val) => date.formatDate(val, "YYYY-MM-DD HH:mm:ss"),
    sortable: true,
  },
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
    name: "type",
    label: "User Action",
    align: "left",
    field: (row) => row.type,
    sortable: false,
  },
];

const $q = useQuasar();
const rows = ref([]);
const loading = ref(false);
const toggleDatePicker = ref(false);

let buildStartTime = date.buildDate({ hours: 0, minutes: 0, seconds: 0 });
buildStartTime = date.subtractFromDate(buildStartTime, { days: 7 });
let buildEndTime = date.buildDate({ hours: 23, minutes: 59, seconds: 59 });
const startTime = ref(buildStartTime.getTime());
const endTime = ref(buildEndTime.getTime());
const dateRange = ref({
  from: date.formatDate(buildStartTime, "YYYY/MM/DD"),
  to: date.formatDate(buildEndTime, "YYYY/MM/DD"),
});

const filter = ref("");

const filtedData = computed(() => {
  const ret = rows.value.filter((row) => {
    return row.username
      .toLowerCase()
      .includes(filter.value.trim().toLowerCase());
  });
  console.log(ret);
  return ret;
});

async function exportCSV() {
  if (filtedData.value.length) {
    const content = [columns.map((col) => wrapCsvValue(col.label))]
      .concat(
        filtedData.value.map((row) =>
          columns
            .map((col) =>
              wrapCsvValue(
                typeof col.field === "function"
                  ? col.field(row)
                  : row[col.field === void 0 ? col.name : col.field],
                col.format,
                row
              )
            )
            .join(",")
        )
      )
      .join("\r\n");

    const status = exportFile(
      `login-audit_${date.formatDate(
        buildStartTime,
        "YYYY-MM-DD"
      )}-${date.formatDate(buildEndTime, "YYYY-MM-DD")}.csv`,
      content,
      "text/csv"
    );

    if (status !== true) {
      $q.notify({
        message: "Browser denied file download...",
        color: "negative",
        icon: "warning",
      });
    }
  } else {
    $q.notify({
      type: "negative",
      message: "no data available for export...",
      position: "top",
    });
  }
  function wrapCsvValue(val, formatFn, row) {
    let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

    formatted =
      formatted === void 0 || formatted === null ? "" : String(formatted);

    formatted = formatted.split('"').join('""');
    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split('\n').join('\\n')
    // .split('\r').join('\\r')

    return `"${formatted}"`;
  }
}

function loadDataByDate() {
  console.log(dateRange.value);
  const { from, to } = dateRange.value;
  if (from && to) {
    startTime.value = new Date(`${from} 00:00:00`).getTime();
    endTime.value = new Date(`${to} 23:59:59`).getTime();
  } else {
    startTime.value = new Date(`${dateRange.value} 00:00:00`).getTime();
    endTime.value = new Date(`${dateRange.value} 23:59:59`).getTime();
  }

  toggleDatePicker.value = false;
  loading.value = true;
  loadAuditLog();
}

function resetDate() {
  startTime.value = buildStartTime.getTime();
  endTime.value = buildEndTime.getTime();
  dateRange.value = Object.assign(
    {
      from: date.formatDate(buildStartTime, "YYYY/MM/DD"),
      to: date.formatDate(buildEndTime, "YYYY/MM/DD"),
    },
    {}
  );
  toggleDatePicker.value = false;
  loading.value = true;
  loadAuditLog();
}

async function loadAuditLog() {
  const { data } = await api.post("/getAuditLog", {
    startTime: startTime.value,
    endTime: endTime.value,
  });
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
    loadAuditLog();
  }, 500);
});
</script>
<style lang="scss">
.myTable {
  min-height: 72vh;
}
</style>