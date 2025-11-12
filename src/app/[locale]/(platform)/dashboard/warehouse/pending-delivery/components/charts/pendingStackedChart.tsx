'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface MonthCustomerStackedChartProps {
  data: {
    months: string[]
    customers: string[]
    series: { name: string; data: number[] }[]
  }
}

export default function MonthCustomerStackedChart({ data }: MonthCustomerStackedChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data || data.months.length === 0) return

    const chart = chartInstanceRef.current || echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/>`
          let total = 0
          params.forEach((param: any) => {
            if (param.value > 0) {
              result += `${param.marker} ${param.seriesName}: ${param.value.toLocaleString()} kg<br/>`
              total += param.value
            }
          })
          result += `<strong>Total: ${total.toLocaleString()} kg</strong>`
          return result
        }
      },
      legend: {
        top: 30,
        type: 'scroll'
      },
      grid: {
        top: 80,
        left: '5%',
        right: '4%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.months,
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
      series: data.series.map((s, index) => ({
        name: s.name,
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: s.data,
      }))
    }

    chart.setOption(option)

    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })

    resizeObserver.observe(chartRef.current)

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      chart.dispose()
      chartInstanceRef.current = null
    }
  }, [data])

  return <div ref={chartRef} className="w-full h-[500px]" />
}