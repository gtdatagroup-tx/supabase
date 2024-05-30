import {
  AlignLeft,
  Check,
  ChevronDown,
  Command,
  CornerDownLeft,
  Keyboard,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { RoleImpersonationPopover } from 'components/interfaces/RoleImpersonationSelector'
import DatabaseSelector from 'components/ui/DatabaseSelector'
import { useLocalStorageQuery } from 'hooks'
import { IS_PLATFORM, LOCAL_STORAGE_KEYS } from 'lib/constants'
import { detectOS } from 'lib/helpers'
import { useSqlEditorStateSnapshot } from 'state/sql-editor'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  TooltipContent_Shadcn_,
  TooltipTrigger_Shadcn_,
  Tooltip_Shadcn_,
} from 'ui'
import FavoriteButton from './FavoriteButton'
import SavingIndicator from './SavingIndicator'

const ROWS_PER_PAGE_OPTIONS = [
  { value: -1, label: 'No limit' },
  { value: 100, label: '100 rows' },
  { value: 500, label: '500 rows' },
  { value: 1000, label: '1,000 rows' },
]

export type UtilityActionsProps = {
  id: string
  isExecuting?: boolean
  isDisabled?: boolean
  hasSelection: boolean
  prettifyQuery: () => void
  executeQuery: () => void
}

const UtilityActions = ({
  id,
  isExecuting = false,
  isDisabled = false,
  hasSelection,
  prettifyQuery,
  executeQuery,
}: UtilityActionsProps) => {
  const os = detectOS()
  const snap = useSqlEditorStateSnapshot()

  const [intellisenseEnabled, setIntellisenseEnabled] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.SQL_EDITOR_INTELLISENSE,
    true
  )

  return (
    <div className="inline-flex items-center justify-end gap-x-4">
      <div className="flex items-center justify-center gap-x-2">
        {IS_PLATFORM && <SavingIndicator id={id} />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="text"
              className="px-1"
              icon={<Keyboard size={14} className="text-foreground-light" />}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              className="justify-between"
              onClick={() => {
                setIntellisenseEnabled(!intellisenseEnabled)
                toast.success(
                  `Successfully ${intellisenseEnabled ? 'disabled' : 'enabled'} intellisense. ${intellisenseEnabled ? 'Please refresh your browser for changes to take place.' : ''}`
                )
              }}
            >
              Intellisense enabled
              {intellisenseEnabled && <Check className="text-brand" size={16} />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {IS_PLATFORM && <FavoriteButton id={id} />}

        <Tooltip_Shadcn_>
          <TooltipTrigger_Shadcn_ asChild>
            <Button
              type="text"
              onClick={() => prettifyQuery()}
              className="px-1"
              icon={<AlignLeft size="tiny" strokeWidth={2} />}
            />
          </TooltipTrigger_Shadcn_>
          <TooltipContent_Shadcn_ side="bottom">Prettify SQL</TooltipContent_Shadcn_>
        </Tooltip_Shadcn_>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="default" iconRight={<ChevronDown size={14} />}>
            {ROWS_PER_PAGE_OPTIONS.find((opt) => opt.value === snap.limit)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-42">
          <DropdownMenuRadioGroup
            value={snap.limit.toString()}
            onValueChange={(val) => snap.setLimit(Number(val))}
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option.label} value={option.value.toString()}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center justify-between gap-x-2 mr-2">
        <div className="flex items-center">
          <DatabaseSelector variant="connected-on-right" onSelectId={() => snap.resetResult(id)} />
          <RoleImpersonationPopover serviceRoleLabel="postgres" variant="connected-on-both" />
          <Button
            onClick={() => executeQuery()}
            disabled={isDisabled || isExecuting}
            type="primary"
            size="tiny"
            iconRight={
              isExecuting ? (
                <Loader2 className="animate-spin" size={10} strokeWidth={1.5} />
              ) : (
                <div className="flex items-center space-x-1">
                  {os === 'macos' ? (
                    <Command size={10} strokeWidth={1.5} />
                  ) : (
                    <p className="text-xs text-foreground-light">CTRL</p>
                  )}
                  <CornerDownLeft size={10} strokeWidth={1.5} />
                </div>
              )
            }
            className="rounded-l-none"
          >
            {hasSelection ? 'Run selected' : 'Run'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UtilityActions
