"use client";
import React from "react"
import { Sun, Cloud, CloudRain, Snowflake, CloudFog, Wind, Tornado } from "lucide-react"

interface WeatherIconProps {
  type: "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "snowy" | "stormy" | "foggy" | "windy"
  size?: number
  className?: string
}

const iconMap: Record<WeatherIconProps["type"], { Icon: React.ElementType; color: string }> = {
  sunny: { Icon: Sun, color: "text-yellow-400" },
  "partly-cloudy": { Icon: Cloud, color: "text-gray-300" },
  cloudy: { Icon: Cloud, color: "text-gray-400" },
  rainy: { Icon: CloudRain, color: "text-blue-400" },
   snowy: { Icon: Snowflake, color: "text-white" },
   stormy: { Icon: Tornado, color: "text-gray-500" },
  foggy: { Icon: CloudFog, color: "text-gray-600" },
  windy: { Icon: Wind, color: "text-gray-700"}
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  type,
  size = 24,
  className = "",
}) => {
  const { Icon, color } = iconMap[type] ?? iconMap.sunny

  return <Icon size={size} className={`${color} ${className}`} />
}

export default WeatherIcon
