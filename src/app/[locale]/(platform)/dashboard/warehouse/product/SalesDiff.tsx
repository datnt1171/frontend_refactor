'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ProductSalesRangeDiff } from '@/types';

interface Props {
  data: ProductSalesRangeDiff[];
}

export default function SalesDiffChart({ data }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

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
        name: 'Chênh lệch - 差異',
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

    chart.setOption(option);

    // ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    // Fallback for window resize
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [data]);

  return (
    <div ref={chartRef} className="w-full h-[500px]" />
  );
}