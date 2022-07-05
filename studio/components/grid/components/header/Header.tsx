import { FC, useState, ReactNode } from 'react'
import { Button, IconDownload, IconPlus, IconX, IconTrash } from '@supabase/ui'
import { saveAs } from 'file-saver'

import FilterDropdown from './filter'
import SortPopover from './sort'
import StatusLabel from './StatusLabel'
import RefreshButton from './RefreshButton'
import { confirmAlert } from 'components/to-be-cleaned/ModalsDeprecated/ConfirmModal'
import { Sort, Filter } from 'components/grid/types'
import { exportRowsToCsv } from 'components/grid/utils'
import { useDispatch, useTrackedState } from 'components/grid/store'

interface HeaderProps {
  sorts: Sort[]
  filters: Filter[]
  onAddColumn?: () => void
  onAddRow?: () => void
  headerActions?: ReactNode
}

const Header: FC<HeaderProps> = ({ sorts, filters, onAddColumn, onAddRow, headerActions }) => {
  const state = useTrackedState()
  const { selectedRows } = state

  return (
    <div className="bg-scale-100 dark:bg-scale-300 flex h-10 items-center justify-between px-5">
      {selectedRows.size > 0 ? (
        <RowHeader sorts={sorts} filters={filters} />
      ) : (
        <DefaultHeader onAddColumn={onAddColumn} onAddRow={onAddRow} />
      )}
      <div className="sb-grid-header__inner">
        {headerActions}
        <StatusLabel />
      </div>
    </div>
  )
}
export default Header

interface DefaultHeaderProps {
  onAddColumn?: () => void
  onAddRow?: () => void
}
const DefaultHeader: FC<DefaultHeaderProps> = ({ onAddColumn, onAddRow }) => {
  const renderNewColumn = (onAddColumn?: () => void) => {
    if (!onAddColumn) return null
    return (
      <Button type="text" onClick={onAddColumn}>
        New Column
      </Button>
    )
  }

  const renderAddRow = (onAddRow?: () => void) => {
    if (!onAddRow) return null
    return (
      <Button size="tiny" icon={<IconPlus size={14} strokeWidth={2} />} onClick={onAddRow}>
        Insert row
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <RefreshButton />
        <FilterDropdown />
        <SortPopover />
      </div>
      <div className="bg-scale-600 h-[50%] w-px"></div>
      <div className="flex items-center gap-2">
        {renderNewColumn(onAddColumn)}
        {renderAddRow(onAddRow)}
      </div>
    </div>
  )
}

interface RowHeaderProps {
  sorts: Sort[]
  filters: Filter[]
}
const RowHeader: FC<RowHeaderProps> = ({ sorts, filters }) => {
  const state = useTrackedState()
  const dispatch = useDispatch()

  const [isExporting, setIsExporting] = useState(false)

  const { selectedRows, rows: allRows, editable, allRowsSelected, totalRows } = state

  const onSelectAllRows = () => {
    dispatch({
      type: 'SELECT_ALL_ROWS',
      payload: { selectedRows: new Set(allRows.map((row) => row.idx)) },
    })
  }

  const onRowsDelete = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete the selected rows? This action cannot be undone.',
      onAsyncConfirm: async () => {
        if (allRowsSelected) {
          const { error } = await state.rowService!.deleteAll(filters)
          if (error) {
            if (state.onError) state.onError(error)
          } else {
            dispatch({ type: 'REMOVE_ALL_ROWS' })
            dispatch({
              type: 'SELECTED_ROWS_CHANGE',
              payload: { selectedRows: new Set() },
            })
          }
        } else {
          const rowIdxs = Array.from(selectedRows) as number[]
          const rows = allRows.filter((x) => rowIdxs.includes(x.idx))
          const { error } = state.rowService!.delete(rows)
          if (error) {
            if (state.onError) state.onError(error)
          } else {
            dispatch({ type: 'REMOVE_ROWS', payload: { rowIdxs } })
            dispatch({
              type: 'SELECTED_ROWS_CHANGE',
              payload: { selectedRows: new Set() },
            })
          }
        }
      },
    })
  }

  async function onRowsExportCsv() {
    setIsExporting(true)
    const rows = allRowsSelected
      ? await state.rowService!.fetchAllData(filters, sorts)
      : allRows.filter((x) => selectedRows.has(x.idx))

    const csv = exportRowsToCsv(state.table!.columns, rows)
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(csvData, `${state.table!.name}_rows.csv`)
    setIsExporting(false)
  }

  function deselectRows() {
    dispatch({
      type: 'SELECTED_ROWS_CHANGE',
      payload: { selectedRows: new Set() },
    })
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <Button
          type="default"
          style={{ padding: '3px' }}
          icon={<IconX size="tiny" strokeWidth={2} />}
          onClick={deselectRows}
        />
        <span className="text-scale-1200 text-xs">
          {allRowsSelected
            ? `${totalRows} rows selected`
            : selectedRows.size > 1
            ? `${selectedRows.size} rows selected`
            : `${selectedRows.size} row selected`}
        </span>
        {!allRowsSelected && (
          <Button type="link" onClick={() => onSelectAllRows()}>
            Select all {totalRows} rows
          </Button>
        )}
      </div>
      <div className="h-[20px] border-r border-gray-700" />
      <div className="flex items-center gap-2">
        <Button
          type="primary"
          size="tiny"
          icon={<IconDownload />}
          loading={isExporting}
          disabled={isExporting}
          onClick={onRowsExportCsv}
        >
          Export to CSV
        </Button>
        {editable && (
          <Button
            type="default"
            size="tiny"
            icon={<IconTrash size="tiny" />}
            onClick={onRowsDelete}
          >
            {allRowsSelected
              ? `Delete ${totalRows} rows`
              : selectedRows.size > 1
              ? `Delete ${selectedRows.size} rows`
              : `Delete ${selectedRows.size} row`}
          </Button>
        )}
      </div>
    </div>
  )
}
