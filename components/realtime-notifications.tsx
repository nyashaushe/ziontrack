"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Bell } from "lucide-react"

interface RealtimeNotification {
  id: string
  message: string
  timestamp: Date
  type: 'insert' | 'update' | 'delete'
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    // Subscribe to changes in indicator_entries table
    const channel = supabase
      .channel('indicator_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'indicator_entries'
        },
        (payload) => {
          console.log('Real-time change detected:', payload)
          
          let message = ''
          let type: 'insert' | 'update' | 'delete' = 'insert'
          
          switch (payload.eventType) {
            case 'INSERT':
              message = `New indicator entry added for ${payload.new.indicator_key}`
              type = 'insert'
              break
            case 'UPDATE':
              message = `Indicator entry updated for ${payload.new.indicator_key}`
              type = 'update'
              break
            case 'DELETE':
              message = `Indicator entry deleted for ${payload.old.indicator_key}`
              type = 'delete'
              break
          }

          const notification: RealtimeNotification = {
            id: crypto.randomUUID(),
            message,
            timestamp: new Date(),
            type
          }

          setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10
          
          // Show toast notification
          toast(message, {
            icon: <Bell className="h-4 w-4" />,
            duration: 4000,
          })
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span>Connecting to real-time updates...</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Real-time updates active</span>
      </div>
      
      {notifications.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">Recent Updates</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="text-xs p-2 bg-blue-50 border border-blue-200 rounded text-blue-800"
              >
                <div className="flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>{notification.message}</span>
                </div>
                <div className="text-blue-600 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}