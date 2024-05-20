import { Check, Webhook } from 'lucide-react'
import { Badge, Button, Input } from 'ui'
import { Hook } from './hooks.constants'

interface HookCardProps {
  hook: Hook
  canUpdateConfig: boolean
  onToggle: (enabled: boolean) => void
  onSelect: () => void
}

export const HookCard = ({ hook, canUpdateConfig, onToggle, onSelect }: HookCardProps) => {
  return (
    <div className="bg-surface-100 border-default overflow-hidden border shadow px-5 py-4 flex flex-row">
      <div className="px-3 pt-1">
        <Webhook size={24} strokeWidth="0.5" />
      </div>
      <div className="flex flex-col flex-0 overflow-y-auto w-full">
        <span className="text-sm text-foreground">{hook.title}</span>
        <span className="text-sm text-foreground-lighter">{hook.subtitle}</span>
        <div className="text-sm flex flex-row space-x-5 py-4">
          {hook.method.type === 'postgres' ? (
            <div className="flex flex-col w-full space-y-2">
              <div className="flex flex-row items-center">
                <span className="text-foreground-light w-20">type</span>
                <span className="text-foreground">Postgres function</span>
              </div>
              <div className="flex flex-row items-center">
                <span className="text-foreground-light w-20">schema</span>
                <Input
                  title={hook.method.schema}
                  copy
                  readOnly
                  disabled
                  className="input-mono [&>div>div>div>input]:text-xs [&>div>div>div>input]:opacity-100 flex-1"
                  value={hook.method.schema}
                  onCopy={() => {}}
                />
              </div>
              <div className="flex flex-row items-center">
                <span className="text-foreground-light w-20">function</span>
                <Input
                  title={hook.method.functionName}
                  copy
                  readOnly
                  disabled
                  className="input-mono [&>div>div>div>input]:text-xs [&>div>div>div>input]:opacity-100 flex-1"
                  value={hook.method.functionName}
                  onCopy={() => {}}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-2">
              <div className="flex flex-row items-center">
                <span className="text-foreground-light w-20">type</span>
                <span className="text-foreground">HTTPS endpoint</span>
              </div>
              <div className="flex flex-row items-center">
                <span className="text-foreground-light w-20">endpoint</span>
                <Input
                  title={hook.method.url}
                  copy
                  readOnly
                  disabled
                  className="input-mono [&>div>div>div>input]:text-xs [&>div>div>div>input]:opacity-100 flex-1"
                  value={hook.method.url}
                  onCopy={() => {}}
                />
              </div>
              <div className="flex flex-row items-center">
                <span className="text-foreground-light w-20">secret</span>
                <Input
                  copy
                  title={hook.method.secret}
                  reveal={true}
                  readOnly
                  disabled
                  className="input-mono [&>div>div>div>input]:text-xs [&>div>div>div>input]:opacity-100 flex-1"
                  value={hook.method.secret}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Button type="default" disabled={!canUpdateConfig} onClick={() => onSelect()}>
            Configure hook
          </Button>
        </div>
      </div>
      <div className="p-4 flex-1">
        {hook.enabled ? (
          <Badge className="space-x-1" size="large" variant="brand">
            <div className="h-3.5 w-3.5 bg-brand rounded-full flex justify-center items-center">
              <Check className="h-2 w-2 text-background-overlay " strokeWidth={6} />
            </div>
            <span>Enabled</span>
          </Badge>
        ) : (
          <Badge variant="warning" size="large">
            <span>Disabled</span>
          </Badge>
        )}
      </div>
    </div>
  )
}
