'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface MonthlyData {
  month: string
  total: number
}

interface MonthlyLineChartProps {
  data: MonthlyData[]
}

export default function MonthlyLineChart({ data }: MonthlyLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    const chart = chartInstanceRef.current || echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    const months = data.map(item => item.month)
    const totals = data.map(item => item.total)

    const option = {
      grid: {
        top: '2%',
        left: '5%',
        right: '4%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        name: '月 - Tháng',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 30,
      },
      yAxis: {
        type: 'value',
        name: 'SL chưa giao (kg)',
        axisLabel: {
          formatter: (value: number) => value.toLocaleString()
        },
        position: 'left',
        nameLocation: 'middle',
        nameGap: 70,
      },
      series: [
        {
          name: 'SL chưa giao (kg)',
          type: 'line',
          data: totals,
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params: any) => params.value.toLocaleString()
          }
        }
      ]
    }

    chart.setOption(option)

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
    <div ref={chartRef} className="w-full h-[400px]" />
  );
}