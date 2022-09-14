<template>
  <canvas id="myChart" width="600" height="200"></canvas>
</template>

<script setup>
import { defineProps, onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartId: {
    type: String,
    default: "bar-chart",
  },
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
  cssClasses: {
    default: "",
    type: String,
  },
  styles: {
    type: Object,
    default: () => {},
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          max: 50,
          color: "#ffffff",
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          grace: "5%",
          max: 100,
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          ticks: {
            callback: function (value, index, ticks) {
              return value + "%";
            },
          },
        },
      },
      plugins: {
        legend: {
          // display: false,
        },
      },
    }),
  },
  plugins: {
    type: Array,
    default: () => [],
  },
});

onMounted(() => {
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: props.chartData,
    options: props.chartOptions,
  });
});
</script>

<style lang="scss" scoped></style>
