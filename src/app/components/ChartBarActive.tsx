"use client"

import { Bar, Rectangle } from "recharts"

interface ChartBarActiveProps {
  dataKey: string
  strokeWidth?: number
  radius?: number
}

export default function ChartBarActive({
  dataKey,
  strokeWidth = 2,
  radius = 8,
}: ChartBarActiveProps) {
  return (
    <Bar
      dataKey={dataKey}
      strokeWidth={strokeWidth}
      radius={radius}
      // On force le typage ici pour éviter l'erreur TS
      shape={((props: any) => (
        <Rectangle
          {...props}
          fill={props.fill}
          fillOpacity={0.9}
          stroke={props.fill}
        />
      )) as any}
    />
  )
}
