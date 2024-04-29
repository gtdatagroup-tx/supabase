import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { Button, Form, Input, Listbox, Modal } from 'ui'

import { DATETIME_FORMAT } from 'lib/constants'
import { useStorageStore } from 'localStores/storageExplorer/StorageExplorerStore'
import { useCallback } from 'react'
import { URL_EXPIRY_DURATION } from '../Storage.constants'
import { fetchFileUrl } from './useFetchFileUrlQuery'

export interface CustomExpiryModalProps {
  onCopyUrl: (name: string, url: string) => void
}

const unitMap = {
  days: 3600 * 24,
  weeks: 3600 * 24 * 7,
  months: 3600 * 24 * 30,
  years: 3600 * 24 * 365,
}

const CustomExpiryModal = ({ onCopyUrl }: CustomExpiryModalProps) => {
  const {
    projectRef,
    selectedFileCustomExpiry,
    selectedBucket,
    setSelectedFileCustomExpiry,
    getPathAlongOpenedFolders,
  } = useStorageStore()

  const visible = selectedFileCustomExpiry !== undefined
  const onClose = () => setSelectedFileCustomExpiry(undefined)

  const getFileUrl = useCallback(
    (expiresIn?: URL_EXPIRY_DURATION) => {
      const pathToFile = getPathAlongOpenedFolders(false)
      const formattedPathToFile = [pathToFile, selectedFileCustomExpiry?.name].join('/')

      return fetchFileUrl(
        formattedPathToFile,
        projectRef,
        selectedBucket.id,
        selectedBucket.public,
        expiresIn
      )
    },
    [selectedFileCustomExpiry?.name, projectRef, selectedBucket.id, selectedBucket.public]
  )

  return (
    <Modal
      hideFooter
      size="small"
      header="Custom expiry for signed URL"
      visible={visible}
      alignFooter="right"
      confirmText="Get URL"
      onCancel={() => onClose()}
    >
      <Form
        validateOnBlur
        initialValues={{ expiresIn: '', units: 'days' }}
        onSubmit={async (values: any, { setSubmitting }: any) => {
          setSubmitting(true)
          onCopyUrl(
            selectedFileCustomExpiry!.name,
            await getFileUrl(
              values.expiresIn * unitMap[values.units as 'days' | 'weeks' | 'months' | 'years']
            )
          )
          setSubmitting(false)
          onClose()
        }}
        validate={(values: any) => {
          const errors: any = {}
          if (values.expiresIn !== '' && values.expiresIn <= 0) {
            errors.expiresIn = 'Expiry duration cannot be less than 0'
          }
          return errors
        }}
      >
        {({ values, isSubmitting }: { values: any; isSubmitting: boolean }) => (
          <>
            <div className="pt-4 pb-2">
              <Modal.Content>
                <p className="text-sm text-foreground-light mb-2">
                  Enter the duration for which the URL will be valid for:
                </p>
                <div className="flex items-center space-x-2">
                  <Input disabled={isSubmitting} type="number" id="expiresIn" className="w-full" />
                  <Listbox id="units" className="w-[150px]">
                    <Listbox.Option id="days" label="days" value="days">
                      days
                    </Listbox.Option>
                    <Listbox.Option id="weeks" label="weeks" value="weeks">
                      weeks
                    </Listbox.Option>
                    <Listbox.Option id="months" label="months" value="months">
                      months
                    </Listbox.Option>
                    <Listbox.Option id="years" label="years" value="years">
                      years
                    </Listbox.Option>
                  </Listbox>
                </div>
                {values.expiresIn !== '' && (
                  <p className="text-sm text-foreground-light mt-2">
                    URL will expire on{' '}
                    {dayjs().add(values.expiresIn, values.units).format(DATETIME_FORMAT)}
                  </p>
                )}
              </Modal.Content>
            </div>
            <Modal.Separator />
            <Modal.Content>
              <div className="flex items-center justify-end space-x-2 pt-1 pb-3">
                <Button type="default" onClick={() => onClose()}>
                  Cancel
                </Button>
                <Button
                  disabled={values.expiresIn === '' || isSubmitting}
                  loading={isSubmitting}
                  htmlType="submit"
                  type="primary"
                >
                  Get signed URL
                </Button>
              </div>
            </Modal.Content>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default observer(CustomExpiryModal)
