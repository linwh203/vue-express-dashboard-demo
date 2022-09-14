<template>
  <q-page class="q-px-lg q-py-sm">
    <div class="row">
      <div class="flex col shadow-1 row">
        <div class="chart-golden-cham col-8 relative-position q-pa-md">
          <CBar
            v-if="!goldenChamDataLoading"
            :chartData="dataOfGolenChamData"
          />
          <q-inner-loading :showing="goldenChamDataLoading">
            <q-spinner-bars size="50px" color="primary" />
          </q-inner-loading>
        </div>
        <div class="data-golden-cham col-4 relative-position q-py-lg q-pr-md">
          <div v-if="!goldenChamLoading">
            <div class="title text-h5 text-primary text-weight-bold">
              Golden Chamber
            </div>
            <div
              class="title-content text-subtitle1 text-weight-medium q-py-lg"
            >
              {{ dataOfGolenCham["﻿Tool/Chamber"] }}
            </div>
            <div class="section">
              <p class="row">
                <span class="col indigo-14 text-body2">Recipe:</span>
                <span class="col text-subtitle1">{{
                  dataOfGolenCham.Recipe
                }}</span>
              </p>
              <p class="row">
                <span class="col indigo-14 text-body2">From:</span>
                <span class="col text-body2">{{
                  dataOfGolenCham.minDate
                }}</span>
              </p>
              <p class="row">
                <span class="col indigo-14 text-body2">To:</span>
                <span class="col text-body2">{{
                  dataOfGolenCham.maxDate
                }}</span>
              </p>
            </div>
          </div>
          <q-inner-loading :showing="goldenChamLoading">
            <q-spinner-tail size="50px" color="primary" />
          </q-inner-loading>
        </div>
      </div>
      <div class="col shadow-1">
        <div class="row q-pa-lg relative-position shadow-1">
          <div class="col-5">
            <div class="text-h5 text-primary text-weight-bold">
              G2G Performance
            </div>
            <div class="row q-py-lg">
              <div class="col">
                <p class="indigo-14 text-body2">Best(h):</p>
                <p class="text-h6">{{ dataOfG2G["﻿best"] }}</p>
              </div>
              <div class="col">
                <p class="indigo-14 text-body2">Average(h):</p>
                <p class="text-h6">{{ dataOfG2G["avg"] }}</p>
              </div>
              <div class="col">
                <p class="indigo-14 text-body2">Count:</p>
                <p class="text-h6">{{ dataOfG2G["count"] }}</p>
              </div>
            </div>
          </div>
          <div class="col-7 flex flex-center">
            <q-linear-progress
              size="6rem"
              :value="dataOfG2G.ratio ? Number(dataOfG2G.ratio) : 0"
              color="secondary"
              animation-speed="1000"
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="accent"
                  :label="progressLabel"
                />
              </div>
            </q-linear-progress>
          </div>
        </div>
        <div class="row q-pa-lg relative-position">
          <div class="col-5">
            <div class="text-h5 text-primary text-weight-bold">
              Seasoning Available@
            </div>
            <div class="row q-py-lg">
              <div class="col">
                <p class="indigo-14 text-body2">Best(pcs):</p>
                <p class="text-h6">{{ oerBest }}</p>
              </div>
              <div class="col">
                <p class="indigo-14 text-body2">Average(pcs):</p>
                <p class="text-h6">{{ oerAverage }}</p>
              </div>
            </div>
          </div>
          <div class="col flex flex-center">
            <CBarCombineLine v-if="!oerLoading" :chartData="chatDataOER" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-7 shadow-1">
        <div class="q-pa-lg">
          <div class="text-h5 text-primary text-weight-bold">
            Daily OOC Summary
          </div>
          <div>
            chart
          </div>
        </div>
      </div>
      <div class="col"></div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getCssVar, useQuasar } from "quasar";
import CBar from "src/components/CBar.vue";
import CBarCombineLine from "src/components/CBarCombineLine.vue";
import { api } from "src/boot/axios";

const $q = useQuasar();

const goldenChamDataLoading = ref(false);
const goldenChamLoading = ref(false);
const g2gLoading = ref(false);
const oerLoading = ref(false);
const oocLoading = ref(false);
const pmLoading = ref(false);
const seasonLoading = ref(false);

const dataOfGolenChamData = ref([]);
const dataOfGolenCham = ref({});
const dataOfG2G = ref({});
const dataOfOER = ref([]);
const chatDataOER = ref({});
const dataOfOOC = ref([]);
const dataOfPM = ref([]);
const dataOfSeason = ref([]);

const progressLabel = computed(() => {
  return dataOfG2G.value.ratio
    ? Math.round(Number(dataOfG2G.value.ratio) * 10000) / 100 + "%"
    : "-";
});

const oerBest = computed(() => {
  if (dataOfOER.value.length) {
    const arr = dataOfOER.value;
    const bestData = arr.sort((a, b) => a.stable_wafer - b.stable_wafer)[0];
    return bestData.stable_wafer;
  }
  return "-";
});
const oerAverage = computed(() => {
  if (dataOfOER.value.length) {
    const arr = dataOfOER.value;
    let acc = 0;
    arr.reduce((prev, current) => {
      acc += Number(current.stable_wafer);
    }, acc);
    return Math.round(acc / dataOfOER.value.length);
  }
  return "-";
});

function fillGoldenChamData(data) {
  const labels = [];
  const datas = [];
  const backgroundColor = [];
  const transferData = data.map((d) => ({
    ...d,
    dataValue: Number(d.MatchRatio.replace(/\%/, "")),
  }));
  transferData
    .sort((a, b) => b.dataValue - a.dataValue)
    .forEach((d, i) => {
      labels.push(`${d.Tool} ${d.Cham}`);
      datas.push(d.dataValue);
      backgroundColor.push(
        i === 0 ? getCssVar("warning") : getCssVar("primary")
      );
    });
  const updatedChartData = {
    labels,
    datasets: [
      {
        label: "",
        backgroundColor,
        data: datas,
        datalabels: {
          align: "end",
          anchor: "end",
          formatter: function (value, context) {
            return `${value}%`;
          },
        },
      },
    ],
  };
  dataOfGolenChamData.value = { ...updatedChartData };
}
function fillOERData(data) {
  const labels = [];
  const datas = [];
  const totals = [];
  let counter = 0;
  data.splice(0, 10).forEach((d, i) => {
    labels.push(d.stable_wafer);
    datas.push(Number(d.stable_wafer));
    counter += Number(d.stable_wafer);
    totals.push(counter);
  });
  const max = totals[totals.length - 1];
  const updatedChartData = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "stable_wafer",
        data: datas,
        backgroundColor: getCssVar("primary"),
        order: 1,
        yAxisID: "y",
        datalabels: {
          color: "white",
        },
      },
      {
        type: "line",
        label: "stable_wafer percentage",
        data: totals.map((t) => ((t / max) * 100).toFixed(0)),
        borderColor: getCssVar("warning"),
        backgroundColor: getCssVar("warning"),
        order: 0,
        yAxisID: "y1",
        datalabels: {
          color: "#666666",
          align: "center",
          anchor: "end",
          font: {
            size: 12,
          },
          formatter: function (value, context) {
            return `${value}%`;
          },
        },
      },
    ],
  };
  chatDataOER.value = { ...updatedChartData };
  oerLoading.value = false;
}

function startLoading() {
  goldenChamDataLoading.value = true;
  goldenChamLoading.value = true;
  g2gLoading.value = true;
  oerLoading.value = true;
  oocLoading.value = true;
  pmLoading.value = true;
  seasonLoading.value = true;
}

async function loadGoldenCham() {
  try {
    const { data } = await api.get("/getGolenChamData");
    // console.log("loadGoldenCham", data.data);
    fillGoldenChamData(data.data);
  } catch (error) {
    showErrorNotify("Fetch goldencham data failed...");
  }
  goldenChamDataLoading.value = false;
}
async function loadGoldenCham2() {
  try {
    const { data } = await api.get("/getGolenCham");
    dataOfGolenCham.value = data.data[0];
  } catch (error) {
    showErrorNotify("Fetch goldencham failed...");
  }
  goldenChamLoading.value = false;
}
async function loadG2G() {
  try {
    const { data } = await api.get("/getG2g");
    dataOfG2G.value = data.data[0];
  } catch (error) {
    showErrorNotify("Fetch G2G failed...");
  }
  g2gLoading.value = false;
}
async function loadOER() {
  try {
    const { data } = await api.get("/getOer");
    dataOfOER.value = data.data;
    console.log("loadOER", data.data);
    fillOERData(data.data);
  } catch (error) {
    showErrorNotify("Fetch OER failed...");
    oerLoading.value = false;
  }
}
async function loadOOC() {
  try {
    const { data } = await api.get("/getOoc");
    dataOfOOC.value = data;
    console.log("loadOOC", data);
  } catch (error) {
    showErrorNotify("Fetch OOC failed...");
  }
  oocLoading.value = false;
}
async function loadPM() {
  try {
    const { data } = await api.get("/getPm");
    dataOfPM.value = data.data;
    console.log("loadPM", data.data);
  } catch (error) {
    showErrorNotify("Fetch PM failed...");
  }
  pmLoading.value = false;
}
async function loadSeason() {
  try {
    const { data } = await api.get("/getSeason");
    dataOfSeason.value = data;
    console.log("loadSeason", data);
  } catch (error) {
    showErrorNotify("Fetch Season failed...");
  }
  seasonLoading.value = false;
}

function showErrorNotify(message = "", position = "top") {
  $q.notify({
    type: "negative",
    position,
    message,
  });
}

onMounted(() => {
  startLoading();
  loadGoldenCham();
  loadGoldenCham2();
  loadG2G();
  loadOER();
  loadOOC();
  loadPM();
  loadSeason();
});
</script>

<style lang="scss" scoped>
.chart-golden-cham {
  // height: 400px;
}
.section {
  display: grid;
  gap: 1rem;
}
.indigo-14 {
  color: $indigo-14;
}
</style>