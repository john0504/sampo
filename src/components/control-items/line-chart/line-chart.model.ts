export class LineChartModel {

  public valueTextCallback;

  public basicModel = {
    tooltip: {
      trigger: 'axis',
      position: 'top',
      confine: true,
      formatter: (params) => {
        let text = '';
        if (Array.isArray(params)) {
          if (params.length > 0) {
            const p = params[0];
            text += p.name + '<br>';
            params.forEach(p => text += this.marker(p));
          }
          return text;
        }
        text += params.name + '<br>';
        text += this.marker(params);
        return text;
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      containLabel: true
    },
    dataZoom: [
      {
        type: 'inside',
        orient: 'horizontal',
        minSpan: 15,
      }
    ],
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        areaStyle: { normal: {} },
        smooth: true,
        symbolSize: 13,
      },
    ],
    graphic: []
  };

  public marker(params) {
    const v = Array.isArray(params.value) ? params.value[params.seriesIndex + 1] : params.value;
    const pText = this.valueTextCallback ? this.valueTextCallback(v, params.seriesIndex) : v;
    return `${params.marker} ${pText}<br>`;
  }

  public unitTag(avg: string) {
    const averageText = {
      type: 'text',
      left: 'center',
      top: 'center',
      z: 100,
      style: {
        text: avg,
        font: '1.5rem'
      }
    };
    const graph = {
      type: 'group',
      bounding: 'raw',
      left: 25,
      top: 40,
      z: 100,
      children: [averageText]
    };

    return graph;
  }

  public averageTag(avg: string) {
    const averageText = {
      type: 'text',
      left: 'center',
      top: 'center',
      z: 100,
      style: {
        text: 'Average: ' + avg,
        font: '1.5rem'
      }
    };
    const graph = {
      type: 'group',
      bounding: 'raw',
      left: 'center',
      bottom: 30,
      z: 100,
      children: [averageText]
    };

    return graph;
  }
}