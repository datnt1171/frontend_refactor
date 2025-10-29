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
      legend: {
        data: ['Actual Order', 'Order Target'],
        top: 0
      },
      grid: {
        top: '5%',
        left: '10%',
        bottom: '7%',
      },
      xAxis: {
        type: 'value',
        name: 'Quantity',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 30,
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
          name: 'Actual Order',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'right',
            formatter: (params) => Math.abs(params.value as number).toLocaleString(),
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
          name: 'Order Target',
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
    <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
  );
}