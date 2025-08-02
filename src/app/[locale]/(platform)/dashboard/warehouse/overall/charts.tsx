'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function StackedChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      xAxis: { type: 'category', data: [1, 2, 3] },
      yAxis: [
        { type: 'value' },
        { type: 'value', max: 1 }
      ],
      tooltip: { trigger: 'axis' },
      legend: {},
      series: [
        { type: 'bar', stack: 'sales', name: 'Sales', data: [10, 20, 30] },
        { type: 'bar', stack: 'sales', name: 'Timber Sales', data: [1, 5, 10] },
        { type: 'bar', stack: 'orders', name: 'Orders', data: [15, 25, 35] },
        { type: 'bar', stack: 'orders', name: 'Timber Orders', data: [20, 30, 40] },
        { type: 'line', yAxisIndex: 1, name: 'Order %', data: [0.1, 0.3, 0.4] },
        { type: 'line', yAxisIndex: 1, name: 'Sales %', data: [0.2, -0.5, 0.6] }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />;
}
