'use client'

import React from 'react';
import * as echarts from 'echarts';
import type { ProductOrderRangeDiff } from '@/types';

interface Props {
  data: ProductOrderRangeDiff[];
}

export default function OrderVsTargetChart({ data }: Props) {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartInstance = React.useRef<echarts.ECharts | null>(null);

  React.useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      grid: {
        left: '5%'
      },
      legend: {
        data: ['Actual Sales', 'Sales Target'],
        top: 0
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => {
            return Math.abs(value).toLocaleString();
          },
        },
      },
      yAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: data.map((item) => item.product_name),
        axisLabel: {
          fontSize: 11,
        },
        offset: 30,
      },
      series: [
        {
          name: 'Actual Sales',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'right',
          },
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#3b82f6',
          },
          data: data.map((item) => item.order_quantity),
        },
        {
          name: 'Sales Target',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'left',
            formatter: (params) => Math.abs(params.value as number).toLocaleString(),
          },
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#ef4444',
          },
          data: data.map((item) => -item.order_quantity_target),
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '600px' }} />
  );
}