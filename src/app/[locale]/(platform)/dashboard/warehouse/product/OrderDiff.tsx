'use client'

import React from 'react';
import * as echarts from 'echarts';
import type { ProductOrderRangeDiff } from '@/types';

interface Props {
  data: ProductOrderRangeDiff[];
}

export default function OrderDiffChart({ data }: Props) {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const chartInstance = React.useRef<echarts.ECharts | null>(null);

  React.useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      // legend: {
      //   data: ['Diff'],
      //   top: 0
      // },
      grid: {
        top: '5%',
        left: '10%',
        bottom: '7%',
      },
      xAxis: {
        type: 'value',
        name: 'Diff',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: (value) => {
            return value.toLocaleString();
          },
        },
        axisLine: {
          lineStyle: {
            color: '#999',
          },
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: data.map((item) => item.product_name),
        axisLabel: {
          fontSize: 11,
        },
        offset: 30,
      },
      series: [
        {
          name: 'Diff',
          type: 'bar',
          data: data.map((item) => {
            const { quantity_diff: value } = item;
            const isPositive = value >= 0;
            return {
              value,
              itemStyle: {
                color: isPositive ? '#10b981' : '#ef4444',
              },
              label: {
                show: true,
                position: isPositive ? 'right' : 'left',
                formatter: value.toLocaleString(),
              },
            };
          }),
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