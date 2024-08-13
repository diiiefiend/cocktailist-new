<script setup lang="ts">
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { type ChartData } from '../models';
import { nextTick } from 'vue';

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

const tickColor = '#154C38';

const labelFontOptions = {
  fontFamily: 'LibreBaskerville, serif',
  fontSize: 10,
  fontColor: tickColor,
};

const sharedScaleOptions = {
  suggestedMin: 1,
  suggestedMax: 10,
  display: !props.isDrinkStats,
};

const drinkAnnotationLabels = {
  enabled: true,
  backgroundColor: 'rgba(0, 0, 0, 0)',
  ...labelFontOptions,
};

const drinkAnnotations = {
  // a bit counterintuitive, but these are annotations for the y-axis
  traditionalToInnovative: {
    drawTime: 'afterDatasetsDraw',
    type: 'line',
    mode: 'vertical',
    scaleID: 'xAxis',
    value: 5,
    borderColor: tickColor,
    borderWidth: 2,
  },
  traditionalLabel: {
    type: 'label',
    ...drinkAnnotationLabels,
    content: 'traditional',
    yScaleId: 'yAxis',
    xAdjust: -35,
    yAdjust: +70,
  },
  innovativeLabel: {
    type: 'label',
    ...drinkAnnotationLabels,
    content: 'innovative',
    yScaleId: 'yAxis',
    xAdjust: -35,
    yAdjust: -70,
  },

  // ... and these are the annotations for the x-axis
  refreshingToSpirited: {
    drawTime: 'afterDatasetsDraw',
    type: 'line',
    mode: 'horizontal',
    scaleID: 'yAxis',
    value: 5,
    borderColor: tickColor,
    borderWidth: 2,
  },
  refreshingLabel: {
    type: 'label',
    ...drinkAnnotationLabels,
    content: 'refreshing',
    xScaleId: 'xAxis',
    xAdjust: -45,
    yAdjust: 0,
  },
  spiritedLabel: {
    type: 'label',
    ...drinkAnnotationLabels,
    content: 'spirited',
    xScaleId: 'xAxis',
    xAdjust: +50,
    yAdjust: 0,
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
          xAxis: {
            ...sharedScaleOptions,
            position: 'bottom',
            title: {
              ...labelFontOptions,
              display: !!xLabel && !isDrinkStats,
              text: xLabel,
            },
            grid: {
              display: true,
            },
          },
          yAxis: {
            ...sharedScaleOptions,
            position: 'left',
            title: {
              ...labelFontOptions,
              display: !!yLabel && !isDrinkStats,
              text: yLabel,
            },
          },
        },
        plugins: {
          legend: {
            display: !!dataLabel,
          },
          annotation: isDrinkStats ? { annotations: drinkAnnotations } : {},
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

  console.log(props.isDrinkStats);

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
