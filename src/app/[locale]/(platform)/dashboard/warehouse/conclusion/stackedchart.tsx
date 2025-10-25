'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { IsSameMonth } from '@/types'

interface SalesOrderChartProps {
  data: IsSameMonth[]
}

export default function SalesOrderChart({ data }: SalesOrderChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    const chart = echarts.init(chartRef.current)

    // Prepare data
    const months = data.map(item => `${item.year}/${item.month}`)
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
        data: ['Same Month Sales', 'Diff Month Sales', 'Total Sales', 'Total Order'],
        orient: 'vertical',
        right: '0%',
        top: '0%'
      },
      grid: {
        left: '3%',
        right: '20%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Amount',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Same Month Sales',
          type: 'bar',
          stack: 'sales',
          data: sameMonthSales,
          itemStyle: {
            color: '#5470c6'
          }
        },
        {
          name: 'Diff Month Sales',
          type: 'bar',
          stack: 'sales',
          data: diffMonthSales,
          itemStyle: {
            color: '#91cc75'
          }
        },
        {
          name: 'Total Sales',
          type: 'line',
          data: totalSales,
          smooth: true,
          itemStyle: {
            color: '#ee6666'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 8
        },
        {
          name: 'Total Order',
          type: 'line',
          data: totalOrder,
          smooth: true,
          itemStyle: {
            color: '#fac858'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'diamond',
          symbolSize: 8
        }
      ]
    }

    chart.setOption(option)

    // Handle resize
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [data])

  return <div ref={chartRef} style={{ width: '600px', height: '350px' }} />
}