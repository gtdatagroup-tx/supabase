import { useEffect } from 'react'
import { getTabsStore } from 'state/tabs'
import { Table2 } from 'lucide-react'
import { useParams } from 'common/hooks'
import { TableGridEditor } from 'components/interfaces/TableGridEditor'
import DeleteConfirmationDialogs from 'components/interfaces/TableGridEditor/DeleteConfirmationDialogs'
import { ExplorerLayout } from 'components/layouts/explorer/layout'
import {
  ProjectContextFromParamsProvider,
  useProjectContext,
} from 'components/layouts/ProjectLayout/ProjectContext'
import { useTableEditorQuery } from 'data/table-editor/table-editor-query'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import type { NextPageWithLayout } from 'types'

const TableEditorPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const { id: _id, ref: projectRef } = useParams()
  const id = _id ? Number(_id) : undefined
  const store = getTabsStore('explorer')

  const { project } = useProjectContext()
  const { data: selectedTable, isLoading } = useTableEditorQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
    id,
  })

  useEffect(() => {
    if (selectedTable) {
      const tabId = `table-${selectedTable.schema}-${selectedTable.name}`

      if (!store.tabsMap[tabId]) {
        store.openTabs = [...store.openTabs, tabId]
        store.tabsMap[tabId] = {
          id: tabId,
          type: 'table',
          label: selectedTable.name,
          metadata: {
            schema: selectedTable.schema,
            name: selectedTable.name,
            tableId: id,
          },
        }
      }
      store.activeTab = tabId
    }
  }, [selectedTable, id])

  return (
    <>
      <TableGridEditor
        isLoadingSelectedTable={isLoading}
        selectedTable={selectedTable}
        theme={resolvedTheme?.includes('dark') ? 'dark' : 'light'}
      />
      <DeleteConfirmationDialogs
        selectedTable={selectedTable}
        onAfterDeleteTable={(tables) => {
          // For simplicity for now, we just open the first table within the same schema
          if (tables.length > 0) {
            router.push(`/project/${projectRef}/editor/${tables[0].id}`)
          } else {
            router.push(`/project/${projectRef}/editor`)
          }
        }}
      />
    </>
  )
}

TableEditorPage.getLayout = (page) => (
  <ProjectContextFromParamsProvider>
    <ExplorerLayout>{page}</ExplorerLayout>
  </ProjectContextFromParamsProvider>
)

export default TableEditorPage
