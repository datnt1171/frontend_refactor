'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ProductSalesRangeDiff } from '@/types';

interface Props {
  data: ProductSalesRangeDiff[];
}

export default function SalesVsTargetChart({ data }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const option: echarts.EChartsOption = {
      legend: {
        data: ['目標銷售 - Giao hàng mục tiêu', '實際銷售額 - Giao hàng thực tế'],
        top: 0
      },
      grid: {
        top: '5%',
        left: '10%',
        bottom: '7%',
      },
      xAxis: {
        type: 'value',
        name: '數量 - Số lượng (kg)',
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
        offset: 30,
        data: data.map((item) => item.product_name),
        axisLabel: {
          fontSize: 11,
        },
      },
      series: [
        {
          name: '實際銷售額 - Giao hàng thực tế',
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
          data: data.map((item) => item.sales_quantity),
        },
        {
          name: '目標銷售 - Giao hàng mục tiêu',
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
          data: data.map((item) => -item.sales_quantity_target),
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