'use client'

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface Props {
  data: { name: string; value: number }[];
}

export default function FactoryBarChart({ data }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.name),
        axisLabel: {
          rotate: 45,
          fontSize: 11,
        },
        axisLine: {
          lineStyle: { color: '#999' },
        },
      },
      yAxis: {
        type: 'value',
        // name: 'Count',
        // position: 'left',
        // nameLocation: 'middle',
        // nameGap: 70,
        axisLabel: {
          formatter: (value: number) => value.toLocaleString(),
        },
        splitLine: {
          lineStyle: { type: 'dashed' },
        },
      },
      series: [
        {
          name: 'Tasks',
          type: 'bar',
          data: data.map((item) => ({
            value: item.value,
            itemStyle: { color: '#3b82f6' },
          })),
          label: {
            show: true,
            position: 'top',
            formatter: (params: { value: any }) => params.value.toLocaleString(),
          },
        },
      ],
    };

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [data]);

  return <div ref={chartRef} className="w-full h-[400px]" />;
}