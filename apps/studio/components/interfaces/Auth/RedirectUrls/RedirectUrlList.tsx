import { noop } from 'lodash'
import { Checkbox } from 'ui'
import { EmptyListState } from 'components/ui/States'
import ValueContainer from './ValueContainer'
import { Globe } from 'lucide-react'

interface RedirectUrlListProps {
  URI_ALLOW_LIST_ARRAY: string[]
  canUpdate: boolean
  selectedUrls: string[]
  onSelectUrl: (urls: string[]) => void
  onSelectUrlToDelete: (url: string) => void
}

const RedirectUrlList = ({
  URI_ALLOW_LIST_ARRAY,
  selectedUrls,
  onSelectUrl = noop,
}: RedirectUrlListProps) => {
  return (
    <div className="-space-y-px">
      {URI_ALLOW_LIST_ARRAY.length > 0 ? (
        <>
          {URI_ALLOW_LIST_ARRAY.map((url) => {
            const isSelected = selectedUrls.includes(url)
            return (
              <ValueContainer
                key={url}
                isSelected={isSelected}
                onClick={() => {
                  const newSelectedUrls = isSelected
                    ? selectedUrls.filter((selectedUrl) => selectedUrl !== url)
                    : [...selectedUrls, url]
                  onSelectUrl(newSelectedUrls)
                }}
              >
                <div className={`flex items-center gap-4 font-mono group w-full`}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-foreground-lighter">
                      <Globe strokeWidth={2} size={14} />
                    </span>
                  </div>
                  <span className="text-sm flex-grow">{url}</span>
                  <div className="flex-shrink-0">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {
                        onSelectUrl([...selectedUrls, url])
                      }}
                    />
                  </div>
                </div>
              </ValueContainer>
            )
          })}
        </>
      ) : (
        <div
          className={[
            'flex items-center border-overlay bg-studio text-foreground',
            'justify-center gap-2 rounded border px-6 py-8 text-sm',
          ].join(' ')}
        >
          <EmptyListState
            title="No Redirect URLs"
            description="Auth providers may need a URL to redirect back to"
          />
        </div>
      )}
    </div>
  )
}

export default RedirectUrlList
