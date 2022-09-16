<template>
  <q-page class="q-px-lg q-py-sm flex flex-center" :style-fn="myTweak">
    <div class="container">
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
              <div class="row q-py-lg relative-position">
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
                <q-inner-loading :showing="g2gLoading">
                  <q-spinner-tail size="50px" color="primary" />
                </q-inner-loading>
              </div>
            </div>
            <div class="col-7 flex flex-center relative-position">
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
              <q-inner-loading :showing="g2gLoading">
                <q-spinner-bars size="50px" color="primary" />
              </q-inner-loading>
            </div>
          </div>
          <div class="row q-pa-lg relative-position">
            <div class="col-5">
              <div class="text-h5 text-primary text-weight-bold">
                Seasoning Available@
              </div>
              <div class="row q-py-lg relative-position">
                <div class="col">
                  <p class="indigo-14 text-body2">Best(pcs):</p>
                  <p class="text-h6">{{ oerBest }}</p>
                </div>
                <div class="col">
                  <p class="indigo-14 text-body2">Average(pcs):</p>
                  <p class="text-h6">{{ oerAverage }}</p>
                </div>
                <q-inner-loading :showing="oerLoading">
                  <q-spinner-tail size="50px" color="primary" />
                </q-inner-loading>
              </div>
            </div>
            <div class="col flex flex-center relative-position">
              <CBarCombineLine v-if="!oerLoading" :chartData="chatDataOER" />
              <q-inner-loading :showing="oerLoading">
                <q-spinner-bars size="50px" color="primary" />
              </q-inner-loading>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-7 shadow-1">
          <div class="q-pa-lg relative-position">
            <div class="text-h5 text-primary text-weight-bold q-pb-md">
              Daily OOC Summary
            </div>
            <CLine v-if="!oocLoading" :chartData="dataOfOOC" :height="160" />
            <q-inner-loading :showing="oocLoading">
              <q-spinner-bars size="50px" color="primary" />
            </q-inner-loading>
          </div>
        </div>
        <div class="col shadow-1">
          <div class="q-pa-lg">
            <div class="text-h5 text-primary text-weight-bold">
              Prediction by Virtual Metrology
            </div>
            <div class="relative-position">
              <div class="text-body2 text-secondary text-weight-medium q-pl-sm">
                Chambers request PM within 2days
              </div>
              <CPolar
                v-if="!pmLoading"
                :chartData="chatDataPM"
                :chartOptions="chatOptionPM"
              />
              <q-inner-loading :showing="pmLoading">
                <q-spinner-bars size="50px" color="primary" />
              </q-inner-loading>
            </div>
            <div class="relative-position">
              <div class="text-body2 text-secondary text-weight-medium q-pl-sm">
                Chambers present Lower ER risk within 2 days
              </div>
              <CLine
                v-if="!seasonLoading"
                :chartData="dataOfSeason"
                :chartOptions="chatOptionSeason"
                :height="140"
              />
              <q-inner-loading :showing="seasonLoading">
                <q-spinner-bars size="50px" color="primary" />
              </q-inner-loading>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getCssVar, useQuasar } from "quasar";
import CBar from "src/components/CBar.vue";
import CBarCombineLine from "src/components/CBarCombineLine.vue";
import CLine from "../components/CLine.vue";
import { api } from "src/boot/axios";
import { CHART_COLORS_ARR, CHART_POINTS_ARR } from "src/utils/color";
import CPolar from "../components/CPolar.vue";

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
const dataOfOOC = ref({});
const dataOfPM = ref([]);
const chatDataPM = ref({});
const chatOptionPM = ref({});
const dataOfSeason = ref([]);
const chatOptionSeason = ref([]);

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
function fillOOCData(data) {
  const validData = data
    .filter((d) => d.OOC && d.OOC !== "")
    .map((d) => {
      const formatDate = d.lastDate
        .split("/")
        .map((f) => (Number(f) < 10 ? `0${f}` : f));
      return {
        ...d,
        lastDate: formatDate[1] + "-" + formatDate[0],
      };
    })
    .sort((a, b) => {
      const aTime = new Date(a.lastDate).getTime();
      const bTime = new Date(b.lastDate).getTime();
      return aTime - bTime;
    });
  const sets = {};
  validData.forEach((d) => {
    if (sets[d["﻿Tool/Chamber"]]) {
      sets[d["﻿Tool/Chamber"]].push(d);
    } else {
      sets[d["﻿Tool/Chamber"]] = [d];
    }
  });
  const dataSetslabels = Object.keys(sets);
  let labels = [];
  for (let k in sets) {
    sets[k].forEach((s) => {
      labels.push(s.lastDate);
    });
    // console.log(k, sets[k]);
  }
  labels = Array.from(new Set(labels));

  const updatedChartData = {
    labels,
    datasets: dataSetslabels.map((d, i) => ({
      label: d,
      data: sets[d].map((d) => Number(d.OOC)),
      borderColor: CHART_COLORS_ARR[i],
      backgroundColor: CHART_POINTS_ARR[i],
      fill: true,
      datalabels: {
        display: false,
      },
    })),
  };
  // console.log(updatedChartData);
  dataOfOOC.value = { ...updatedChartData };
}
function fillPM(data) {
  const labels = [];
  const datas = [];
  data.forEach((d) => {
    labels.push(d["﻿Tool/Chamber"]);
    datas.push(Number(d.alarmChamber));
  });
  const updatedChartData = {
    labels,
    datasets: [
      {
        label: "",
        data: datas,
        backgroundColor: datas.map((d, i) => CHART_POINTS_ARR[i]),
        datalabels: {
          display: false,
        },
      },
    ],
  };
  chatDataPM.value = { ...updatedChartData };
  chatOptionPM.value = { ...makeOptions() };
  function makeOptions() {
    const afterTitle = (tooltipItems) => {
      const idx = tooltipItems[0].dataIndex;
      return "Level: " + dataOfPM.value[idx].Level;
    };
    const footer = (tooltipItems) => {
      const idx = tooltipItems[0].dataIndex;
      return "Message: " + dataOfPM.value[idx].Message;
    };
    const beforeFooter = (tooltipItems) => {
      const idx = tooltipItems[0].dataIndex;
      return "RFTime: " + dataOfPM.value[idx].RFTime;
    };
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          pointLabels: {
            display: true,
            centerPointLabels: true,
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        // title: {
        //   display: true,
        //   text: "Chambers request PM within 2days",
        // },
        legend: {
          display: true,
          position: "left",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 10,
            },
          },
        },
        tooltip: {
          callbacks: {
            afterTitle: afterTitle,
            beforeFooter: beforeFooter,
            footer: footer,
          },
        },
      },
    };
  }
}
function fillSeason(data) {
  const arr = data
    .map((d) => {
      const [chamber, date] = d["﻿Tool/Chamber/Date"].split(" ");
      return {
        chamber,
        date,
        er: Number(d.stable_wafer),
      };
    })
    .sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return aTime - bTime;
    });
  const sets = {};
  let labels = [];
  arr.forEach((a) => {
    if (sets[a.chamber]) {
      sets[a.chamber].push({
        date: a.date,
        er: a.er,
      });
    } else {
      sets[a.chamber] = [
        {
          date: a.date,
          er: a.er,
        },
      ];
    }
    labels.push(a.date);
  });
  const dataSetslabels = Object.keys(sets).sort((a, b) => {
    const x = a.split("-")[1];
    const y = b.split("-")[1];
    return x - y;
  });
  labels = Array.from(new Set(labels));
  const datasets = dataSetslabels.map((d, i) => ({
    label: d,
    data: labels.map((l) => fillDataByDate(l, sets[d])),
    borderColor: CHART_COLORS_ARR[i],
    backgroundColor: CHART_POINTS_ARR[i],
    fill: true,
    datalabels: {
      display: false,
    },
  }));
  const updatedChartData = {
    labels,
    datasets,
  };
  dataOfSeason.value = { ...updatedChartData };
  chatOptionSeason.value = { ...makeOptions() };
  // console.log(datasets);
  function fillDataByDate(date, arr) {
    const ret = arr.filter((a) => a.date === date);
    return ret.length ? ret[0].er : 0;
  }
  function makeOptions() {
    return {
      responsive: true,
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          stacked: false,
          title: {
            display: true,
            text: "Stable Wafer",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "left",
          align: "start",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 10,
            },
          },
        },
      },
    };
  }
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
    fillOERData(data.data);
  } catch (error) {
    showErrorNotify("Fetch OER failed...");
    oerLoading.value = false;
  }
}
async function loadOOC() {
  try {
    const { data } = await api.get("/getOoc");
    fillOOCData(data.data);
  } catch (error) {
    showErrorNotify("Fetch OOC failed...");
  }
  oocLoading.value = false;
}
async function loadPM() {
  try {
    const { data } = await api.get("/getPm");
    dataOfPM.value = data.data;
    fillPM(data.data);
  } catch (error) {
    showErrorNotify("Fetch PM failed...");
  }
  pmLoading.value = false;
}
async function loadSeason() {
  try {
    const { data } = await api.get("/getSeason");
    // console.log("loadSeason", data.data);
    fillSeason(data.data);
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

const myTweak = (offset) => {
  // "offset" is a Number (pixels) that refers to the total
  // height of header + footer that occupies on screen,
  // based on the QLayout "view" prop configuration
  // this is actually what the default style-fn does in Quasar
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
};

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
.container {
  width: 100%;
  height: 100%;
}
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