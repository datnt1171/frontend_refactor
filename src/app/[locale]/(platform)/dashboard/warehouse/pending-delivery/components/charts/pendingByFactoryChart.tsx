'use client'

import { useEffect, useRef, useMemo } from 'react'
import * as echarts from 'echarts'

interface CustomerData {
  customer: string
  total: number
}

interface CustomerBarChartProps {
  data: CustomerData[]
}

export default function CustomerBarChart({ data }: CustomerBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  // Calculate dynamic height based on number of customers
  const chartHeight = useMemo(() => {
    const minHeight = 400
    const barHeight = 30 // Height per bar/customer
    const calculatedHeight = data.length * barHeight
    
    // Return minimum 400px or calculated height, whichever is larger
    return Math.max(minHeight, calculatedHeight)
  }, [data.length])

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    const chart = chartInstanceRef.current || echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    const customers = data.map(item => item.customer)
    const totals = data.map(item => item.total)

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const param = params[0]
          return `${param.name}<br/>SL chưa giao: ${param.value.toLocaleString()} kg`
        }
      },
      grid: {
        top: '2%',
        left: '5%',
        right: '4%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'SL chưa giao (kg)',
        axisLabel: {
          formatter: (value: number) => value.toLocaleString()
        },
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 30,
      },
      yAxis: {
        type: 'category',
        data: customers,
        axisLabel: {
          width: 150,
          overflow: 'truncate'
        }
      },
      series: [
        {
          name: 'SL chưa giao',
          type: 'bar',
          data: totals,
          itemStyle: {
            color: '#10b981'
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: '#059669'
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => params.value.toLocaleString()
          }
        }
      ]
    }

    chart.setOption(option)

    // ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })

    resizeObserver.observe(chartRef.current)

    // Fallback for window resize
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      chart.dispose()
      chartInstanceRef.current = null
    }
  }, [data])

  return (
    <div 
      ref={chartRef} 
      className="w-full" 
      style={{ height: `${chartHeight}px` }}
    />
  )
}