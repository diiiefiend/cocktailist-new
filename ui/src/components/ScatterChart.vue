<script setup lang="ts">
import { nextTick } from 'vue';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { type ChartData } from '../models';

const props = withDefaults(
  defineProps<{
    xValues: number[];
    yValues: number[];
    xLabel: string;
    yLabel: string;
    label?: string;
    showLabel?: boolean;
    isDrinkStats?: boolean;
  }>(),
  {
    showLabel: false,
    isDrinkStats: false,
  },
);

// $emerald color
const tickColor = '#154C38';
// $navy color
const tooltipLabelColor = '#03242f';

const sharedScaleOptions = {
  min: 0,
  max: 10,
  grid: {
    display: true,
    drawTicks: false,
  },
  ticks: {
    stepSize: 1,
    maxRotation: 0,
    display: false,
  },
  border: {
    display: true,
    width: 2,
    color: tickColor,
  },
};

const drinkAnnotationLabels = {
  type: 'label',
  font: {
    family: 'LibreBaskerville, serif',
    size: 10,
    color: tickColor,
  },
};

const drinkAnnotations = {
  // a bit counterintuitive, but these are annotations for the y-axis
  traditionalLabel: {
    ...drinkAnnotationLabels,
    content: 'traditional',
    yScaleId: 'y',
    xAdjust: -35,
    yAdjust: +80,
  },
  innovativeLabel: {
    ...drinkAnnotationLabels,
    content: 'innovative',
    yScaleId: 'y',
    xAdjust: -35,
    yAdjust: -80,
  },

  // ... and these are the annotations for the x-axis
  refreshingLabel: {
    ...drinkAnnotationLabels,
    content: 'refreshing',
    xScaleId: 'x',
    xAdjust: -60,
    yAdjust: +10,
  },
  spiritedLabel: {
    ...drinkAnnotationLabels,
    content: 'spirited',
    xScaleId: 'x',
    xAdjust: +60,
    yAdjust: +10,
  },
};

const renderChart = (
  data: ChartData,
  dataLabel?: string,
  xLabel?: string,
  yLabel?: string,
  isDrinkStats = false,
) => {
  // chart.js stuff
  Chart.register(annotationPlugin);

  const scatterChart = new Chart(
    document.getElementById('scatter-chart-container') as HTMLCanvasElement,
    {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: dataLabel,
            data,
            borderColor: tickColor,
            pointStyle: 'crossRot',
          },
        ],
      },
      options: {
        animation: false,
        layout: {
          padding: {
            top: 10,
            left: 5,
            right: 10,
            bottom: 5,
          },
        },
        elements: {
          point: {
            radius: 10,
            hoverRadius: 10,
          },
        },
        scales: {
          x: {
            ...sharedScaleOptions,
            title: {
              display: !!xLabel && !isDrinkStats,
              text: xLabel,
            },
            // have to define explicitly here vs in "sharedScaleOptions" to make the enum type happy
            position: 'center',
          },
          y: {
            ...sharedScaleOptions,
            title: {
              display: !!yLabel && !isDrinkStats,
              text: yLabel,
            },
            // have to define explicitly here vs in "sharedScaleOptions" to make the enum type happy
            position: 'center',
          },
        },
        plugins: {
          legend: {
            display: !!dataLabel,
          },
          // @ts-ignore
          annotation: isDrinkStats ? { annotations: drinkAnnotations } : {},
          tooltip: {
            displayColors: false,
            yAlign: 'bottom',
            backgroundColor: tooltipLabelColor,
            bodyFont: {
              family: 'LibreBaskerville, serif',
              size: 10,
            },
            callbacks: {
              label: (context) => {
                return `${xLabel}: ${context.parsed.x}, ${yLabel}: ${context.parsed.y}`;
              },
            },
          },
        },
      },
    },
  );
};

nextTick().then(() => {
  // Code that will run only after the entire view has been rendered
  const chartData: ChartData = [];
  props.xValues.forEach((val, i) => {
    chartData.push({
      x: val,
      y: props.yValues[i],
    });
  });

  const label = props.showLabel ? props.label : undefined;

  renderChart(chartData, label, props.xLabel, props.yLabel, props.isDrinkStats);
});
</script>

<template>
  <canvas id="scatter-chart-container" height="200" width="200"></canvas>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/scatter-chart.scss';
</style>
