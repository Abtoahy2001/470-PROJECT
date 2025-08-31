"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface OrderStatusSelectProps {
  currentStatus: string
  onStatusChange: (status: string) => void
  isLoading: boolean
  statuses?: string[]
}

export function OrderStatusSelect({ 
  currentStatus, 
  onStatusChange,
  isLoading,
  statuses
}: OrderStatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [hasChanged, setHasChanged] = useState(false)

  const handleChange = (value: string) => {
    setSelectedStatus(value)
    setHasChanged(value !== currentStatus)
  }

  const handleUpdate = () => {
    onStatusChange(selectedStatus)
    setHasChanged(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={handleChange} disabled={isLoading}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
            {statuses?.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      
      {hasChanged && (
        <Button 
          size="sm" 
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Update"
          )}
        </Button>
      )}
    </div>
  )
}