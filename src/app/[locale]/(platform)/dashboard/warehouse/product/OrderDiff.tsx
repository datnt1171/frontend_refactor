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
      grid: {
        left: '5%',
        right: '15%', // Add right margin for labels
      },
      xAxis: {
        type: 'value',
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
    <div ref={chartRef} style={{ width: '100%', height: '600px' }} />
  );
}