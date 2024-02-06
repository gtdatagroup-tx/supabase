import type { PostgresTable } from '@supabase/postgres-meta'
import { isEmpty, isUndefined, noop } from 'lodash'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Checkbox, IconBookOpen, Input, Modal, SidePanel } from 'ui'

import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import ConfirmationModal from 'components/ui/ConfirmationModal'
import { useDatabasePublicationsQuery } from 'data/database-publications/database-publications-query'
import { useForeignKeyConstraintsQuery } from 'data/database/foreign-key-constraints-query'
import { usePostgresTypesQuery } from 'data/database/types-query'
import { useIsFeatureEnabled, useStore } from 'hooks'
import { EXCLUDED_SCHEMAS_WITHOUT_EXTENSIONS } from 'lib/constants/schemas'
import { useTableEditorStateSnapshot } from 'state/table-editor'
import { SpreadsheetImport } from '../'
import ActionBar from '../ActionBar'
import { ColumnField } from '../SidePanelEditor.types'
import ColumnManagement from './ColumnManagement'
import { ForeignKeysManagement } from './ForeignKeysManagement/ForeignKeysManagement'
import HeaderTitle from './HeaderTitle'
import RLSDisableModalContent from './RLSDisableModal'
import { DEFAULT_COLUMNS } from './TableEditor.constants'
import { ImportContent, TableField } from './TableEditor.types'
import {
  formatImportedContentToColumnFields,
  generateTableField,
  generateTableFieldFromPostgresTable,
  validateFields,
} from './TableEditor.utils'
import { ForeignKey } from '../ForeignKeySelectorV2/ForeignKeySelector.types'

export interface TableEditorProps {
  table?: PostgresTable
  isDuplicating: boolean
  visible: boolean
  closePanel: () => void
  saveChanges: (
    payload: {
      name: string
      schema: string
      comment?: string | undefined
    },
    columns: ColumnField[],
    foreignKeyRelations: ForeignKey[],
    isNewRecord: boolean,
    configuration: {
      tableId?: number
      importContent?: ImportContent
      isRLSEnabled: boolean
      isRealtimeEnabled: boolean
      isDuplicateRows: boolean
    },
    resolve: any
  ) => void
  updateEditorDirty: () => void
}

const TableEditor = ({
  table,
  isDuplicating,
  visible = false,
  closePanel = noop,
  saveChanges = noop,
  updateEditorDirty = noop,
}: TableEditorProps) => {
  const snap = useTableEditorStateSnapshot()
  const { ui } = useStore()
  const { project } = useProjectContext()
  const isNewRecord = isUndefined(table)
  const realtimeEnabled = useIsFeatureEnabled('realtime:all')

  const { data: types } = usePostgresTypesQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const enumTypes = (types ?? []).filter(
    (type) => !EXCLUDED_SCHEMAS_WITHOUT_EXTENSIONS.includes(type.schema)
  )

  const { data: publications } = useDatabasePublicationsQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const realtimePublication = (publications ?? []).find(
    (publication) => publication.name === 'supabase_realtime'
  )
  const realtimeEnabledTables = realtimePublication?.tables ?? []
  const isRealtimeEnabled = isNewRecord
    ? false
    : realtimeEnabledTables.some((t: any) => t.id === table?.id)

  const [errors, setErrors] = useState<any>({})
  const [tableFields, setTableFields] = useState<TableField>()
  const [fkRelations, setFkRelations] = useState<ForeignKey[]>([])

  const [isDuplicateRows, setIsDuplicateRows] = useState<boolean>(false)
  const [importContent, setImportContent] = useState<ImportContent>()
  const [isImportingSpreadsheet, setIsImportingSpreadsheet] = useState<boolean>(false)
  const [rlsConfirmVisible, setRlsConfirmVisible] = useState<boolean>(false)

  const { data: foreignKeyMeta } = useForeignKeyConstraintsQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
    schema: table?.schema,
  })

  useEffect(() => {
    if (visible) {
      setErrors({})
      setImportContent(undefined)
      setIsDuplicateRows(false)
      if (isNewRecord) {
        const tableFields = generateTableField()
        setTableFields(tableFields)
        setFkRelations([])
      } else {
        const tableFields = generateTableFieldFromPostgresTable(
          table!,
          foreignKeyMeta || [],
          isDuplicating,
          isRealtimeEnabled
        )
        setTableFields(tableFields)

        const foreignKeys = (foreignKeyMeta ?? []).filter((fk) => fk.source_table === table?.name)
        setFkRelations(
          foreignKeys.map((x) => {
            return {
              id: x.id,
              schema: x.target_schema,
              table: x.target_table,
              columns: x.source_columns.map((y, i) => ({ source: y, target: x.target_columns[i] })),
              deletionAction: x.deletion_action,
              updateAction: x.update_action,
            }
          })
        )
      }
    }
  }, [visible])

  useEffect(() => {
    if (importContent && !isEmpty(importContent)) {
      const importedColumns = formatImportedContentToColumnFields(importContent)
      onUpdateField({ columns: importedColumns })
    }
  }, [importContent])

  const onUpdateField = (changes: Partial<TableField>) => {
    const updatedTableFields = { ...tableFields, ...changes } as TableField
    setTableFields(updatedTableFields)
    updateEditorDirty()

    const updatedErrors = { ...errors }
    for (const key of Object.keys(changes)) {
      delete updatedErrors[key]
    }
    setErrors(updatedErrors)
  }

  const onSaveChanges = (resolve: any) => {
    if (tableFields) {
      const errors: any = validateFields(tableFields)
      if (errors.columns) {
        ui.setNotification({ category: 'error', message: errors.columns, duration: 4000 })
      }
      setErrors(errors)

      if (isEmpty(errors)) {
        const payload = {
          name: tableFields.name,
          schema: snap.selectedSchemaName,
          comment: tableFields.comment,
          ...(!isNewRecord && { rls_enabled: tableFields.isRLSEnabled }),
        }
        const configuration = {
          tableId: table?.id,
          importContent,
          isRLSEnabled: tableFields.isRLSEnabled,
          isRealtimeEnabled: tableFields.isRealtimeEnabled,
          isDuplicateRows: isDuplicateRows,
        }

        saveChanges(payload, tableFields.columns, fkRelations, isNewRecord, configuration, resolve)
      } else {
        resolve()
      }
    }
  }

  if (!tableFields) return null

  return (
    <SidePanel
      size="large"
      key="TableEditor"
      visible={visible}
      header={
        <HeaderTitle schema={snap.selectedSchemaName} table={table} isDuplicating={isDuplicating} />
      }
      className={`transition-all duration-100 ease-in ${isImportingSpreadsheet ? ' mr-32' : ''}`}
      onCancel={closePanel}
      onConfirm={() => (resolve: () => void) => onSaveChanges(resolve)}
      customFooter={
        <ActionBar
          backButtonLabel="Cancel"
          applyButtonLabel="Save"
          closePanel={closePanel}
          applyFunction={(resolve: () => void) => onSaveChanges(resolve)}
        />
      }
    >
      <SidePanel.Content className="space-y-10 py-6">
        <Input
          label="Name"
          layout="horizontal"
          type="text"
          error={errors.name}
          value={tableFields?.name}
          onChange={(event: any) => onUpdateField({ name: event.target.value })}
        />
        <Input
          label="Description"
          placeholder="Optional"
          layout="horizontal"
          type="text"
          value={tableFields?.comment ?? ''}
          onChange={(event: any) => onUpdateField({ comment: event.target.value })}
        />
      </SidePanel.Content>
      <SidePanel.Separator />
      <SidePanel.Content className="space-y-10 py-6">
        <Checkbox
          id="enable-rls"
          // @ts-ignore
          label={
            <div className="flex items-center space-x-2">
              <span>Enable Row Level Security (RLS)</span>
              <Badge color="gray">Recommended</Badge>
            </div>
          }
          // @ts-ignore
          description={
            <>
              <p>Restrict access to your table by enabling RLS and writing Postgres policies.</p>
            </>
          }
          checked={tableFields.isRLSEnabled}
          onChange={() => {
            // if isEnabled, show confirm modal to turn off
            // if not enabled, allow turning on without modal confirmation
            tableFields.isRLSEnabled
              ? setRlsConfirmVisible(true)
              : onUpdateField({ isRLSEnabled: !tableFields.isRLSEnabled })
          }}
          size="medium"
        />
        {tableFields.isRLSEnabled ? (
          <Alert
            withIcon
            variant="info"
            className="!px-4 !py-3 mt-3"
            title="Policies are required to query data"
          >
            <p>
              You need to write an access policy before you can query data from this table. Without
              a policy, querying this table will result in an <u>empty array</u> of results.
            </p>
            {isNewRecord && (
              <p className="mt-3">You can create policies after you create this table.</p>
            )}
            <p className="mt-4">
              <Button asChild type="default" icon={<IconBookOpen strokeWidth={1.5} />}>
                <Link
                  href="https://supabase.com/docs/guides/auth/row-level-security"
                  target="_blank"
                  rel="noreferrer"
                >
                  RLS Documentation
                </Link>
              </Button>
            </p>
          </Alert>
        ) : (
          <Alert
            withIcon
            variant="warning"
            className="!px-4 !py-3 mt-3"
            title="You are allowing anonymous access to your table"
          >
            <p>
              {tableFields.name ? `The table ${tableFields.name}` : 'Your table'} will be publicly
              writable and readable
            </p>
            <p className="mt-4">
              <Button asChild type="default" icon={<IconBookOpen strokeWidth={1.5} />}>
                <Link
                  href="https://supabase.com/docs/guides/auth/row-level-security"
                  target="_blank"
                  rel="noreferrer"
                >
                  RLS Documentation
                </Link>
              </Button>
            </p>
          </Alert>
        )}
        {realtimeEnabled && (
          <Checkbox
            id="enable-realtime"
            label="Enable Realtime"
            description="Broadcast changes on this table to authorized subscribers"
            checked={tableFields.isRealtimeEnabled}
            onChange={() => onUpdateField({ isRealtimeEnabled: !tableFields.isRealtimeEnabled })}
            size="medium"
          />
        )}
      </SidePanel.Content>
      <SidePanel.Separator />
      <SidePanel.Content className="space-y-10 py-6">
        {!isDuplicating && (
          <ColumnManagement
            table={{ name: tableFields.name, schema: snap.selectedSchemaName }}
            columns={tableFields?.columns}
            enumTypes={enumTypes}
            isNewRecord={isNewRecord}
            importContent={importContent}
            onColumnsUpdated={(columns) => onUpdateField({ columns })}
            onSelectImportData={() => setIsImportingSpreadsheet(true)}
            onClearImportContent={() => {
              onUpdateField({ columns: DEFAULT_COLUMNS })
              setImportContent(undefined)
            }}
          />
        )}
        {isDuplicating && (
          <>
            <Checkbox
              id="duplicate-rows"
              label="Duplicate table entries"
              description="This will copy all the data in the table into the new table"
              checked={isDuplicateRows}
              onChange={() => setIsDuplicateRows(!isDuplicateRows)}
              size="medium"
            />
          </>
        )}

        <SpreadsheetImport
          visible={isImportingSpreadsheet}
          headers={importContent?.headers}
          rows={importContent?.rows}
          saveContent={(prefillData: ImportContent) => {
            setImportContent(prefillData)
            setIsImportingSpreadsheet(false)
          }}
          closePanel={() => setIsImportingSpreadsheet(false)}
        />

        <ConfirmationModal
          visible={rlsConfirmVisible}
          header="Turn off Row Level Security"
          buttonLabel="Confirm"
          size="medium"
          onSelectCancel={() => setRlsConfirmVisible(false)}
          onSelectConfirm={() => {
            onUpdateField({ isRLSEnabled: !tableFields.isRLSEnabled })
            setRlsConfirmVisible(false)
          }}
        >
          <Modal.Content>
            <RLSDisableModalContent />
          </Modal.Content>
        </ConfirmationModal>
      </SidePanel.Content>

      <SidePanel.Separator />

      <SidePanel.Content className="py-6">
        <ForeignKeysManagement
          table={tableFields}
          relations={fkRelations}
          closePanel={closePanel}
          onUpdateFkRelations={setFkRelations}
        />
      </SidePanel.Content>
    </SidePanel>
  )
}

export default TableEditor
