import { ChevronDown, Edit2, Plus, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'

import { CreateReportModal } from 'components/interfaces/Reports/Reports.CreateReportModal'
import { UpdateCustomReportModal } from 'components/interfaces/Reports/Reports.UpdateModal'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { useContentDeleteMutation } from 'data/content/content-delete-mutation'
import { useContentInsertMutation } from 'data/content/content-insert-mutation'
import { Content, useContentQuery } from 'data/content/content-query'
import { useContentUpsertMutation } from 'data/content/content-upsert-mutation'
import { useIsFeatureEnabled, useSelectedProject } from 'hooks'
import {
  AlertDescription_Shadcn_,
  AlertTitle_Shadcn_,
  Alert_Shadcn_,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Menu,
  cn,
} from 'ui'
import ConfirmationModal from 'ui-patterns/Dialogs/ConfirmationModal'

const ReportsMenu = () => {
  const router = useRouter()
  const { id } = router.query
  const project = useSelectedProject()
  const insertReport = useContentInsertMutation()
  const deleteReport = useContentDeleteMutation()
  const updateReport = useContentUpsertMutation()
  const storageEnabled = useIsFeatureEnabled('project_storage:all')

  const pageKey = (id || router.pathname.split('/')[4]) as string
  const ref = project?.ref ?? 'default'

  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [showNewReportModal, setShowNewReportModal] = React.useState(false)
  const [showUpdateReportModal, setShowUpdateReportModal] = React.useState(false)
  const [selectedReport, setSelectedReport] = React.useState<Content>()

  const { data: content, isLoading } = useContentQuery(ref)

  function getReportMenuItems() {
    if (!content) return []

    const reports = content?.content.filter((c) => c.type === 'report')

    const sortedReports = reports?.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })

    const reportMenuItems = sortedReports.map((r, idx) => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      key: r.id || idx + '-report',
      url: `/project/${ref}/reports/${r.id}`,
      hasDropdownActions: true,
      report: r,
    }))

    return reportMenuItems
  }

  const reportMenuItems = getReportMenuItems()

  const menuItems = [
    {
      title: 'Built-in reports',
      key: 'builtin-reports',
      items: [
        {
          name: 'API',
          key: 'api-overview',
          url: `/project/${ref}/reports/api-overview`,
        },
        ...(storageEnabled
          ? [
              {
                name: 'Storage',
                key: 'storage',
                url: `/project/${ref}/reports/storage`,
              },
            ]
          : []),

        {
          name: 'Database',
          key: 'database',
          url: `/project/${ref}/reports/database`,
        },
      ],
    },
  ]

  return (
    <Menu type="pills" className="mt-6">
      {isLoading ? (
        <div className="px-5 my-4 space-y-2">
          <ShimmeringLoader />
          <ShimmeringLoader className="w-3/4" />
          <ShimmeringLoader className="w-1/2" />
        </div>
      ) : (
        <div className="flex flex-col px-2 gap-y-6">
          <div className="flex px-2">
            <Button
              type="default"
              className="justify-start flex-grow"
              onClick={() => {
                setShowNewReportModal(true)
              }}
              icon={<Plus size={12} />}
            >
              New custom report
            </Button>
          </div>

          {reportMenuItems.length > 0 ? (
            <div>
              <Menu.Group title={'Your custom reports'} />
              {reportMenuItems.map((item, idx) => (
                <Link
                  className={cn(
                    'pr-2 h-7 pl-3 mt-1 text-foreground-light group-hover:text-foreground/80 text-sm',
                    'flex items-center justify-between rounded-md group relative',
                    item.key === pageKey ? 'bg-surface-300 text-foreground' : 'hover:bg-surface-200'
                  )}
                  key={item.key + '-menukey'}
                  href={item.url}
                >
                  <div>{item.name}</div>

                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        type="text"
                        className="px-1 opacity-50 hover:opacity-100"
                        icon={<ChevronDown size={12} strokeWidth={2} />}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52 *:space-x-2">
                      <DropdownMenuItem
                        onClick={() => {
                          if (!item.id) return
                          setSelectedReport(item.report)
                          setShowUpdateReportModal(true)
                        }}
                      >
                        <Edit2 size={12} />
                        <div>Rename</div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          if (!item.id) return
                          setSelectedReport(item.report)
                          setDeleteModalOpen(true)
                        }}
                      >
                        <Trash size={12} />
                        <div>Delete</div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Link>
              ))}
            </div>
          ) : null}

          {menuItems.map((item) => (
            <div key={item.key + '-menu-group'}>
              {item.items ? (
                <>
                  <Menu.Group title={item.title} />
                  <div key={item.key} className="flex flex-col">
                    {item.items.map((subItem) => (
                      <li
                        key={subItem.key}
                        className={cn(
                          'pr-2 mt-1 text-foreground-light group-hover:text-foreground/80 text-sm',
                          'flex items-center justify-between rounded-md group relative',
                          subItem.key === pageKey
                            ? 'bg-surface-300 text-foreground'
                            : 'hover:bg-surface-200'
                        )}
                      >
                        <Link href={subItem.url} className="flex-grow h-7 flex items-center pl-3">
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          ))}

          <Alert_Shadcn_>
            <AlertTitle_Shadcn_ className="text-sm">
              Query Performance and Project Linter reports have been shifted
            </AlertTitle_Shadcn_>
            <AlertDescription_Shadcn_ className="text-xs">
              <p className="mb-2">They can now be found in the menu under the database section.</p>
              <Button type="default" size="tiny" onClick={() => {}}>
                Head over to Database
              </Button>
            </AlertDescription_Shadcn_>
          </Alert_Shadcn_>

          <UpdateCustomReportModal
            onSubmit={async (newVals) => {
              try {
                if (!selectedReport) return
                if (!selectedReport.id) return
                if (!selectedReport.project_id) return

                await updateReport.mutateAsync({
                  projectRef: ref,
                  payload: {
                    ...selectedReport,
                    project_id: selectedReport.project_id,
                    id: selectedReport.id,
                    name: newVals.name,
                    description: newVals.description || '',
                  },
                })
                toast.success('Report updated')
                setShowUpdateReportModal(false)
              } catch (error) {
                toast.error(`Failed to update report. Check console for more details.`)
                console.error(error)
              }
            }}
            onCancel={() => setShowUpdateReportModal(false)}
            visible={showUpdateReportModal}
            initialValues={{
              name: selectedReport?.name || '',
              description: selectedReport?.description || '',
            }}
          />

          <ConfirmationModal
            title="Delete custom report"
            confirmLabel="Delete report"
            confirmLabelLoading="Deleting report"
            size="medium"
            loading={deleteReport.isLoading}
            visible={deleteModalOpen}
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={async () => {
              if (selectedReport) {
                if (!selectedReport.id) return
                await deleteReport.mutateAsync({
                  projectRef: ref,
                  ids: [selectedReport.id],
                })
                toast.success('Report deleted')
                router.push(`/project/${ref}/reports`)
              }
              setDeleteModalOpen(false)
            }}
          >
            <div className="text-sm text-foreground-light grid gap-4">
              <div className="grid gap-1">
                <p>Are you sure you want to delete '{selectedReport?.name}'?</p>
              </div>
            </div>
          </ConfirmationModal>

          <CreateReportModal
            visible={showNewReportModal}
            onCancel={() => {
              setShowNewReportModal(false)
            }}
            afterSubmit={() => {
              setShowNewReportModal(false)
            }}
          />
        </div>
      )}
    </Menu>
  )
}

export default ReportsMenu
