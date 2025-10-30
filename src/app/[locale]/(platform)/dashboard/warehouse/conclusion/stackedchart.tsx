'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { IsSameMonth } from '@/types'

interface SalesOrderChartProps {
  data: IsSameMonth[]
}

export default function SalesOrderChart({ data }: SalesOrderChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // Prepare data
    const months = data.map(item => `${item.month}/${item.year}`)
    const sameMonthSales = data.map(item => item.same_month_sales)
    const diffMonthSales = data.map(item => item.diff_month_sales)
    const totalSales = data.map(item => item.total_sales)
    const totalOrder = data.map(item => item.total_order)

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: [
          '總銷售額 - Tổng SL Giao Hàng',
          '總訂單 - Tổng SL ĐĐH',
          '下單一個月內出貨 -SL giao theo ĐĐH trong tháng',
          '本月內依訂單出貨 - SL giao theo ĐĐH cũ',
        ],
        orient: 'vertical',
        right: '0%',
        top: '15%',
      },
      grid: {
        left: '5%',
        right: 320,
        bottom: '7%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        name: '月 - Tháng',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 30,
        data: months,
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: {
        type: 'value',
        name: '數量 - Số lượng (kg)',
        position: 'left',
        nameLocation: 'middle',
        nameGap: 70,
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: '本月內依訂單出貨 - SL giao theo ĐĐH cũ',
          type: 'bar',
          stack: 'sales',
          data: diffMonthSales,
          itemStyle: {
            color: '#FFCC99'
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => Math.round(params.value).toLocaleString()
          }
        },
        {
          name: '下單一個月內出貨 -SL giao theo ĐĐH trong tháng',
          type: 'bar',
          stack: 'sales',
          data: sameMonthSales,
          itemStyle: {
            color: '#FFB9B9'
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => Math.round(params.value).toLocaleString()
          }
        },
        {
          name: '總銷售額 - Tổng SL Giao Hàng',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
            color: 'green'
          },
          itemStyle: {
            color: 'green'
          },
          symbol: 'circle',
          symbolSize: 5,
          data: totalSales.map((value: number, index: number) => ({
            value,
            label: {
              show: true,
              position: index === 0 ? 'top' : 'right',
              color: 'green',
              fontSize: 14,
              formatter: Math.round(value).toLocaleString()
            }
          }))
        },
        {
          name: '總訂單 - Tổng SL ĐĐH',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
            color: 'blue'
          },
          itemStyle: {
            color: 'blue'
          },
          symbol: 'diamond',
          symbolSize: 5,
          data: totalOrder.map((value: number, index: number) => ({
            value,
            label: {
              show: true,
              position: index === 0 ? 'left' : 'right',
              color: 'blue',
              fontSize: 14,
              formatter: Math.round(value).toLocaleString()
            }
          }))
        }
      ]
    }

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
    <div ref={chartRef} className="w-full h-[400px]" />
  );
}