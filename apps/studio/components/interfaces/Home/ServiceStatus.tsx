import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { useParams } from 'common'
import { useEdgeFunctionServiceStatusQuery } from 'data/service-status/edge-functions-status-query'
import { usePostgresServiceStatusQuery } from 'data/service-status/postgres-service-status-query'
import { useProjectServiceStatusQuery } from 'data/service-status/service-status-query'
import { useIsFeatureEnabled } from 'hooks/misc/useIsFeatureEnabled'
import { useSelectedProject } from 'hooks/misc/useSelectedProject'
import { Button, PopoverContent_Shadcn_, PopoverTrigger_Shadcn_, Popover_Shadcn_ } from 'ui'
import Link from 'next/link'
import dayjs from 'dayjs'

const ServiceStatus = () => {
  const { ref } = useParams()
  const project = useSelectedProject()
  const [open, setOpen] = useState(false)

  const {
    projectAuthAll: authEnabled,
    projectEdgeFunctionAll: edgeFunctionsEnabled,
    realtimeAll: realtimeEnabled,
    projectStorageAll: storageEnabled,
  } = useIsFeatureEnabled([
    'project_auth:all',
    'project_edge_function:all',
    'realtime:all',
    'project_storage:all',
  ])

  const isBranch = project?.parentRef !== project?.ref

  // [Joshen] Need pooler service check eventually
  const { data: status, isLoading } = useProjectServiceStatusQuery({ projectRef: ref })
  const { data: edgeFunctionsStatus } = useEdgeFunctionServiceStatusQuery({ projectRef: ref })
  const { isLoading: isLoadingPostgres, isSuccess: isSuccessPostgres } =
    usePostgresServiceStatusQuery({
      projectRef: ref,
      connectionString: project?.connectionString,
    })

  const authStatus = status?.find((service) => service.name === 'auth')
  const restStatus = status?.find((service) => service.name === 'rest')
  const realtimeStatus = status?.find((service) => service.name === 'realtime')
  const storageStatus = status?.find((service) => service.name === 'storage')

  // [Joshen] Need individual troubleshooting docs for each service eventually for users to self serve
  const services: {
    name: string
    error?: string
    docsUrl?: string
    isLoading: boolean
    isSuccess?: boolean
    logsUrl: string
  }[] = [
    {
      name: 'Database',
      error: undefined,
      docsUrl: undefined,
      isLoading: isLoadingPostgres,
      isSuccess: isSuccessPostgres,
      logsUrl: '/logs/postgres-logs',
    },
    {
      name: 'PostgREST',
      error: restStatus?.error,
      docsUrl: undefined,
      isLoading,
      isSuccess: restStatus?.healthy,
      logsUrl: '/logs/postgrest-logs',
    },
    ...(authEnabled
      ? [
          {
            name: 'Auth',
            error: authStatus?.error,
            docsUrl: undefined,
            isLoading,
            isSuccess: authStatus?.healthy,
            logsUrl: '/logs/auth-logs',
          },
        ]
      : []),
    ...(realtimeEnabled
      ? [
          {
            name: 'Realtime',
            error: realtimeStatus?.error,
            docsUrl: undefined,
            isLoading,
            isSuccess: realtimeStatus?.healthy,
            logsUrl: '/logs/realtime-logs',
          },
        ]
      : []),
    ...(storageEnabled
      ? [
          {
            name: 'Storage',
            error: storageStatus?.error,
            docsUrl: undefined,
            isLoading,
            isSuccess: storageStatus?.healthy,
            logsUrl: '/logs/storage-logs',
          },
        ]
      : []),
    ...(edgeFunctionsEnabled
      ? [
          {
            name: 'Edge Functions',
            error: undefined,
            docsUrl: 'https://supabase.com/docs/guides/functions/troubleshooting',
            isLoading,
            isSuccess: edgeFunctionsStatus?.healthy,
            logsUrl: '/logs/edge-functions-logs',
          },
        ]
      : []),
  ]

  const isLoadingChecks = services.some((service) => service.isLoading)
  const allServicesOperational = services.every((service) => service.isSuccess)

  // If the project is less than 10 minutes old, and status is not operational, then it's likely the service is still starting up
  const isProjectNew = dayjs.utc().diff(dayjs.utc(project?.inserted_at), 'minute') < 10

  const StatusMessage = ({ isLoading, isSuccess }: { isLoading: boolean; isSuccess: boolean }) => {
    if (isLoading) return 'Checking status'
    if (isSuccess) return 'No issues'
    if (isProjectNew) return 'Coming up...'
    return 'Unable to connect'
  }

  const StatusIcon = ({ isLoading, isSuccess }: { isLoading: boolean; isSuccess: boolean }) => {
    if (isLoading) return <Loader2 size={14} className="animate-spin" />
    if (isSuccess) return <CheckCircle2 className="text-brand" size={18} strokeWidth={1.5} />
    if (isProjectNew) return <Loader2 size={14} className="animate-spin" />
    return <AlertTriangle className="text-warning" size={18} strokeWidth={1.5} />
  }

  return (
    <Popover_Shadcn_ modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger_Shadcn_ asChild>
        <Button
          type="default"
          icon={
            isLoadingChecks ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div
                className={`w-2 h-2 rounded-full ${
                  allServicesOperational ? 'bg-brand' : 'bg-warning'
                }`}
              />
            )
          }
        >
          {isBranch ? 'Preview Branch' : 'Project'} Status
        </Button>
      </PopoverTrigger_Shadcn_>
      <PopoverContent_Shadcn_ className="p-0 w-56" side="bottom" align="center">
        {services.map((service) => (
          <div
            key={service.name}
            className="px-4 py-2 text-xs flex items-center border-b last:border-none group relative"
          >
            <div className="flex-1">
              <p>{service.name}</p>
              <p className="text-foreground-light flex items-center gap-1 group-hover:hidden">
                <StatusMessage isLoading={service.isLoading} isSuccess={!!service.isSuccess} />
              </p>

              <Link
                className="hidden group-hover:flex text-foreground-light hover:text-foreground"
                href={`/project/${ref}${service.logsUrl}`}
              >
                Go to Logs
              </Link>
            </div>
            <StatusIcon isLoading={service.isLoading} isSuccess={!!service.isSuccess} />
          </div>
        ))}
      </PopoverContent_Shadcn_>
    </Popover_Shadcn_>
  )
}

export default ServiceStatus
