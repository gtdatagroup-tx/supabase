import { PermissionAction } from '@supabase/shared-types/out/constants'
import NoPermission from 'components/ui/NoPermission'
import { useCheckPermissions, usePermissionsLoaded } from 'hooks/misc/useCheckPermissions'
import { PropsWithChildren, useMemo, useState } from 'react'
import { ProjectLayoutWithAuth } from '../ProjectLayout/ProjectLayout'
import { SQLEditorMenu } from '../SQLEditorLayout/SQLEditorMenu'
import TableEditorMenu from './TableEditorMenu'
import { OngoingQueriesPanel } from 'components/interfaces/SQLEditor/OngoingQueriesPanel'
import { Separator } from 'ui'

const TableEditorLayout = ({ children }: PropsWithChildren<{}>) => {
  const [showOngoingQueries, setShowOngoingQueries] = useState(false)
  const isPermissionsLoaded = usePermissionsLoaded()
  const canReadTables = useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_READ, 'tables')

  const tableEditorMenu = useMemo(() => {
    return (
      <>
        <TableEditorMenu />
        <Separator />
        <SQLEditorMenu
          key="sql-editor-menu"
          onViewOngoingQueries={() => setShowOngoingQueries(true)}
        />
      </>
    )
  }, [])

  if (isPermissionsLoaded && !canReadTables) {
    return (
      <ProjectLayoutWithAuth isBlocking={false}>
        <NoPermission isFullPage resourceText="view tables from this project" />
      </ProjectLayoutWithAuth>
    )
  }

  return (
    <ProjectLayoutWithAuth
      product="Table Editor"
      productMenu={tableEditorMenu}
      isBlocking={false}
      resizableSidebar
    >
      {children}
      <OngoingQueriesPanel
        visible={showOngoingQueries}
        onClose={() => setShowOngoingQueries(false)}
      />
    </ProjectLayoutWithAuth>
  )
}

export default TableEditorLayout
