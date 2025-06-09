
"use client"

import { useEffect, useState } from "react"
import { Clock, User2, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useFetchData } from "@/hooks/useApi"
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-muted bg-muted/30 p-4 shadow-sm flex flex-col gap-2">
    {children}
  </div>
)

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: string
}) => {
  const variantClass =
    variant === "destructive"
      ? "bg-red-100 text-red-800"
      : variant === "outline"
      ? "border border-gray-300 text-gray-800"
      : "bg-gray-200 text-gray-800"
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${variantClass}`}>
      {children}
    </span>
  )
}

type AuditLogItem = {
  _id: string
  action: "create" | "update" | "delete"
  performedBy: {
    _id: string
    name: string
  }
  model: string
  modelId: string
  timestamp: string
}
interface FetchResponse<T> {
    message: string;
    data: T;
    success: boolean;
  }
  

export default function AuditLogPage() {
  const { data, isLoading, error } = useFetchData<FetchResponse<AuditLogItem[]>>('/api/auditlog/getAuditLogs', 'getAuditLogs');
    const auditLogs = Array.isArray(data?.data?.data) ? data.data.data : [];
  
  

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Audit Log</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {auditLogs.map((log) => (
          <Card key={log._id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{log.performedBy.name}</span>
              </div>
              <Badge
                variant={
                  log.action === "update"
                    ? "outline"
                    : log.action === "delete"
                    ? "destructive"
                    : log.action === "create"
                    ? "success"
                    : "default"
                }
              >
                {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tooltip>

<TooltipTrigger>
              <FileText className="h-4 w-4" />
</TooltipTrigger>
              <TooltipContent>
    <p>Model</p>
  </TooltipContent>
              </Tooltip>
              <span>
                {log.model} 
                {/* <code className="bg-muted text-foreground px-1 rounded text-xs">
                  {log.modelId.slice(0, 6)}...
                </code> */}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
