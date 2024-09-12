import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { InfoIcon, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useParams } from 'common'
import DiskSpaceBar from 'components/interfaces/DiskManagement/DiskSpaceBar'
import { useProjectContext } from 'components/layouts/ProjectLayout/ProjectContext'
import { FormHeader } from 'components/ui/Forms/FormHeader'
import {
  useDiskAttributesQuery,
  useRemainingDurationForDiskAttributeUpdate,
} from 'data/config/disk-attributes-query'
import { useUpdateDiskAttributesMutation } from 'data/config/disk-attributes-update-mutation'
import { useOrgSubscriptionQuery } from 'data/subscriptions/org-subscription-query'
import { useSelectedOrganization } from 'hooks/misc/useSelectedOrganization'
import { GB } from 'lib/constants'
import {
  Alert_Shadcn_,
  AlertDescription_Shadcn_,
  AlertTitle_Shadcn_,
  Badge,
  Button,
  Card,
  CardContent,
  Form_Shadcn_,
  FormControl_Shadcn_,
  FormField_Shadcn_,
  FormItem_Shadcn_,
  Input_Shadcn_ as Input,
  RadioGroupCard,
  RadioGroupCardItem,
  Separator,
} from 'ui'
import { FormItemLayout } from 'ui-patterns/form/FormItemLayout/FormItemLayout'
import { FormFooterChangeBadge } from '../DataWarehouse/FormFooterChangeBadge'
import BillingChangeBadge from './BillingChangeBadge'
import { DiskCountdownRadial } from './DiskCountdownRadial'
import { DiskType, PLAN_DETAILS } from './DiskManagement.constants'
import {
  calculateDiskSizePrice,
  calculateIOPSPrice,
  calculateThroughputPrice,
} from './DiskManagement.utils'
import { DiskManagementDiskSizeReadReplicas } from './DiskManagementDiskSizeReadReplicas'
import { DiskStorageSchema, DiskStorageSchemaType } from './DiskManagementPanelSchema'
import { DiskManagementPlanUpgradeRequired } from './DiskManagementPlanUpgradeRequired'
import { DiskManagementReviewAndSubmitDialog } from './DiskManagementReviewAndSubmitDialog'
import { useDiskUtilizationQuery } from 'data/config/disk-utilization-query'

export function DiskManagementPanelForm() {
  const org = useSelectedOrganization()
  const { project } = useProjectContext()
  const { ref: projectRef } = useParams()

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false)

  const { data, isSuccess } = useDiskAttributesQuery(
    { projectRef },
    {
      refetchInterval,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // @ts-ignore
        const { type, iops, throughput_mbps, size_gb } = data?.attributes ?? { size_gb: 0 }
        const formValues = {
          storageType: type,
          provisionedIOPS: iops,
          throughput: throughput_mbps,
          totalSize: size_gb,
        }

        if (!('requested_modification' in data)) {
          if (refetchInterval !== false) {
            form.reset(formValues)
            setRefetchInterval(false)
            toast.success('Disk configuration changes have been successfully applied!')
          }
        }
      },
    }
  )
  // @ts-ignore [Joshen TODO] check whats happening here
  const { type, iops, throughput_mbps, size_gb } = data?.attributes ?? { size_gb: 0 }
  const isRequestingChanges = data?.requested_modification !== undefined

  const { remainingDuration: initialRemainingTime, isWithinCooldownWindow } =
    useRemainingDurationForDiskAttributeUpdate({
      projectRef,
    })

  const { data: subscription } = useOrgSubscriptionQuery({
    orgSlug: org?.slug,
  })
  const planId = subscription?.plan.id ?? ''
  const isPlanUpgradeRequired =
    subscription?.plan.id === 'pro' && !subscription.usage_billing_enabled

  const { data: diskUtil } = useDiskUtilizationQuery({ projectRef })
  const mainDiskUsed = Math.round(((diskUtil?.metrics.fs_used_bytes ?? 0) / GB) * 100) / 100
  const { includedDiskGB } = PLAN_DETAILS?.[planId as keyof typeof PLAN_DETAILS] ?? {}

  const { mutate: updateDiskConfigurationRQ, isLoading: isUpdatingDiskConfiguration } =
    useUpdateDiskAttributesMutation({
      onSuccess: (_, vars) => {
        toast.success(
          'Successfully requested disk configuration changes! Your changes will be applied shortly'
        )
        const { ref, ...formData } = vars
        setIsDialogOpen(false)
        setRefetchInterval(3000)
        form.reset(formData as DiskStorageSchemaType)
      },
    })

  const defaultValues = {
    storageType: type,
    provisionedIOPS: iops,
    throughput: throughput_mbps,
    totalSize: size_gb,
  }
  const form = useForm<DiskStorageSchemaType>({
    resolver: zodResolver(DiskStorageSchema),
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const { watch, setValue, trigger, control, formState } = form
  const watchedStorageType = watch('storageType')
  const watchedTotalSize = watch('totalSize')
  const watchedIOPS = watch('provisionedIOPS')
  const { dirtyFields } = formState // Destructure dirtyFields from formState
  const isAllocatedStorageDirty = !!dirtyFields.totalSize // Check if 'allocatedStorage' is dirty
  const disableInput = isRequestingChanges || isPlanUpgradeRequired || isWithinCooldownWindow

  const maxIOPS =
    watchedStorageType === 'gp3'
      ? Math.min(500 * watchedTotalSize, 16000)
      : Math.min(1000 * watchedTotalSize, 256000)
  const maxThroughput =
    watchedStorageType === 'gp3' ? Math.min(0.25 * watchedIOPS, 1000) : undefined

  const onSubmit = async (data: DiskStorageSchemaType) => {
    if (projectRef === undefined) return console.error('Project ref is required')
    updateDiskConfigurationRQ({ ref: projectRef, ...data })
  }

  const diskSizePrice = calculateDiskSizePrice({
    planId,
    oldSize: form.formState.defaultValues?.totalSize || 0,
    oldStorageType: form.formState.defaultValues?.storageType as DiskType,
    newSize: form.getValues('totalSize'),
    newStorageType: form.getValues('storageType') as DiskType,
  })

  const iopsPrice = calculateIOPSPrice({
    oldStorageType: form.formState.defaultValues?.storageType as DiskType,
    oldProvisionedIOPS: form.formState.defaultValues?.provisionedIOPS || 0,
    newStorageType: form.getValues('storageType') as DiskType,
    newProvisionedIOPS: form.getValues('provisionedIOPS'),
  })

  const throughputPrice = calculateThroughputPrice({
    storageType: form.getValues('storageType') as DiskType,
    newThroughput: form.getValues('throughput') || 0,
    oldThroughput: form.formState.defaultValues?.throughput || 0,
  })

  useEffect(() => {
    // Initialize field values properly when data has been loaded
    if (isSuccess) form.reset(defaultValues)
  }, [isSuccess])

  // Watch storageType and allocatedStorage to adjust constraints dynamically
  useEffect(() => {
    if (watchedStorageType === 'io2') {
      setValue('throughput', undefined) // Throughput is not configurable for 'io2'
    } else if (watchedStorageType === 'gp3') {
      // Ensure throughput is within the allowed range if it's greater than or equal to 400 GiB
      const currentThroughput = form.getValues('throughput')
      if (!currentThroughput || currentThroughput < 125 || currentThroughput > 1000) {
        setValue('throughput', 125) // Reset to default if undefined or out of bounds
      }
    }
  }, [watchedStorageType, watchedTotalSize, setValue, form])

  useEffect(() => {
    if (initialRemainingTime > 0) setRemainingTime(initialRemainingTime)
  }, [initialRemainingTime])

  useEffect(() => {
    if (remainingTime <= 0) return

    const timer = setInterval(() => {
      setRemainingTime(Math.max(0, remainingTime - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [remainingTime])

  if (planId === 'free') {
    return (
      <div id="disk-management">
        <FormHeader
          title="Disk Management"
          docsUrl="https://supabase.com/docs/guides/platform/database-size#disk-management"
        />
        <Alert_Shadcn_>
          <InfoIcon />
          <AlertTitle_Shadcn_>
            Disk size configuration is not available for projects on the Free Plan
          </AlertTitle_Shadcn_>
          <AlertDescription_Shadcn_>
            <p>
              If you are intending to use more than 500MB of disk space, then you will need to
              upgrade to at least the Pro Plan.
            </p>
            <Button asChild type="default" className="mt-3">
              <Link
                target="_blank"
                rel="noreferrer"
                href={`/org/${org?.slug}/billing?panel=subscriptionPlan`}
              >
                Upgrade plan
              </Link>
            </Button>
          </AlertDescription_Shadcn_>
        </Alert_Shadcn_>
      </div>
    )
  }

  return (
    <div id="disk-management">
      <FormHeader
        title="Disk Management"
        docsUrl="https://supabase.com/docs/guides/platform/database-size#disk-management"
      />
      <Form_Shadcn_ {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="-space-y-px">
            <Card className="bg-surface-100 rounded-b-none">
              <CardContent className="transition-all duration-500 ease-in-out py-10 flex flex-col gap-10 px-8">
                <FormField_Shadcn_
                  name="storageType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItemLayout layout="horizontal" label="Storage type">
                      <FormControl_Shadcn_>
                        <RadioGroupCard
                          className="flex flex-wrap gap-3"
                          {...field}
                          onValueChange={async (e) => {
                            field.onChange(e)
                            // only trigger provisionedIOPS due to other input being hidden
                            await form.trigger('provisionedIOPS')
                          }}
                          defaultValue={field.value}
                          disabled={disableInput}
                        >
                          <FormItem_Shadcn_ asChild>
                            <FormControl_Shadcn_>
                              <RadioGroupCardItem
                                className="grow p-3 px-5"
                                disabled={disableInput}
                                value="gp3"
                                showIndicator={false}
                                // @ts-ignore
                                label={
                                  <div className="flex flex-col gap-1">
                                    <div className="flex gap-3 items-center">
                                      <span className="text-sm">General Purpose SSD</span>{' '}
                                      <div>
                                        <Badge
                                          variant={'outline'}
                                          className="font-mono bg-alternative bg-opacity-100"
                                        >
                                          gp3
                                        </Badge>
                                      </div>
                                    </div>
                                    <p className="text-foreground-light">
                                      gp3 provides a balance between price and performance
                                    </p>
                                  </div>
                                }
                              />
                            </FormControl_Shadcn_>
                          </FormItem_Shadcn_>
                          <FormItem_Shadcn_ asChild>
                            <FormControl_Shadcn_>
                              <RadioGroupCardItem
                                className="grow p-3 px-5"
                                disabled={disableInput}
                                value="io2"
                                showIndicator={false}
                                // @ts-ignore
                                label={
                                  <div className="flex flex-col gap-1">
                                    <div className="flex gap-3 items-center">
                                      <span className="text-sm">Provisioned IOPS SSD</span>{' '}
                                      <div>
                                        <Badge
                                          variant={'outline'}
                                          className="font-mono bg-alternative bg-opacity-100"
                                        >
                                          io2
                                        </Badge>
                                      </div>
                                    </div>
                                    <p className="text-foreground-light">
                                      io2 offers high IOPS for mission-critical applications.
                                    </p>
                                  </div>
                                }
                              />
                            </FormControl_Shadcn_>
                          </FormItem_Shadcn_>
                        </RadioGroupCard>
                      </FormControl_Shadcn_>
                    </FormItemLayout>
                  )}
                />
                <FormField_Shadcn_
                  control={form.control}
                  name="provisionedIOPS"
                  render={({ field }) => (
                    <FormItemLayout
                      layout="horizontal"
                      label="IOPS"
                      description={
                        watchedStorageType === 'io2' ? (
                          <>
                            For <code className="text-xs">io2</code> storage type, IOPS must be{' '}
                            {watchedTotalSize >= 8 ? `between 100 and ${maxIOPS}.` : `at least 100`}
                          </>
                        ) : (
                          <>
                            For <code className="text-xs">gp3</code> storage type, IOPS must be{' '}
                            {watchedTotalSize >= 8
                              ? `between 3,000 and ${maxIOPS.toLocaleString()}.`
                              : `at least 3,000`}
                          </>
                        )
                      }
                      labelOptional="Input/output operations per second. Higher IOPS is suitable for applications requiring high throughput."
                    >
                      <div className="flex gap-3 items-center">
                        <div className="flex -space-x-px">
                          <FormControl_Shadcn_>
                            <Input
                              id="provisionedIOPS"
                              type="number"
                              className="flex-grow font-mono rounded-r-none max-w-32"
                              {...field}
                              disabled={disableInput}
                              onChange={(e) => {
                                setValue('provisionedIOPS', e.target.valueAsNumber, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                              }}
                            />
                          </FormControl_Shadcn_>
                          <div className="border border-strong bg-surface-300 rounded-r-md px-3 flex items-center justify-center">
                            <span className="text-foreground-lighter text-xs font-mono">IOPS</span>
                          </div>
                        </div>
                        <BillingChangeBadge
                          show={
                            (watchedStorageType !== type ||
                              (watchedStorageType === 'gp3' && field.value !== iops)) &&
                            !formState.errors.provisionedIOPS
                          }
                          beforePrice={Number(iopsPrice.oldPrice)}
                          afterPrice={Number(iopsPrice.newPrice)}
                        />
                      </div>
                    </FormItemLayout>
                  )}
                />
                <AnimatePresence initial={false}>
                  {form.getValues('storageType') === 'gp3' && (
                    <motion.div
                      key="throughPutContainer"
                      initial={{ opacity: 0, x: -4, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: -4, height: 0 }}
                      transition={{ duration: 0.1 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <FormField_Shadcn_
                        name="throughput"
                        control={control}
                        render={({ field }) => (
                          <FormItemLayout
                            label="Throughput (MiBps)"
                            layout="horizontal"
                            description={
                              <>
                                For <code className="text-xs">gp3</code> storage type, throughput
                                must be between 125 and {maxThroughput} MiBps
                              </>
                            }
                          >
                            <div className="flex gap-3 items-center">
                              <div className="flex -space-x-px">
                                <FormControl_Shadcn_>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => {
                                      setValue('throughput', e.target.valueAsNumber, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      })
                                    }}
                                    className="flex-grow font-mono rounded-r-none max-w-32"
                                    disabled={disableInput || watchedStorageType === 'io2'}
                                  />
                                </FormControl_Shadcn_>
                                <div className="border border-strong bg-surface-300 rounded-r-md px-3 flex items-center justify-center">
                                  <span className="text-foreground-lighter text-xs font-mono">
                                    MiBps
                                  </span>
                                </div>
                              </div>
                              <BillingChangeBadge
                                show={
                                  formState.isDirty &&
                                  formState.dirtyFields.throughput &&
                                  !formState.errors.throughput
                                }
                                beforePrice={Number(throughputPrice.oldPrice)}
                                afterPrice={Number(throughputPrice.newPrice)}
                              />
                            </div>
                          </FormItemLayout>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <Separator />
              <CardContent className="py-10 px-8">
                <FormField_Shadcn_
                  name="totalSize"
                  control={control}
                  render={({ field }) => (
                    <FormItemLayout label="Disk Size" layout="horizontal">
                      <div className="mt-1 relative flex gap-2 items-center">
                        <div className="flex -space-x-px max-w-48">
                          <FormControl_Shadcn_>
                            <Input
                              type="number"
                              step="1"
                              {...field}
                              disabled={disableInput}
                              className="flex-grow font-mono rounded-r-none"
                              onWheel={(e) => e.currentTarget.blur()}
                              onChange={(e) => {
                                setValue('totalSize', e.target.valueAsNumber, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                })
                                trigger('provisionedIOPS')
                                trigger('throughput')
                              }}
                              min={includedDiskGB}
                            />
                          </FormControl_Shadcn_>
                          <div className="border border-strong bg-surface-300 rounded-r-md px-3 flex items-center justify-center">
                            <span className="text-foreground-lighter text-xs font-mono">GiB</span>
                          </div>
                        </div>
                        <AnimatePresence initial={false}>
                          {isAllocatedStorageDirty && (
                            <motion.div
                              key="reset-disksize"
                              initial={{ opacity: 0, scale: 0.95, x: -2 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95, x: -2 }}
                              transition={{ duration: 0.15 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <Button
                                htmlType="button"
                                type="default"
                                size="small"
                                className="px-2"
                                onClick={() => form.resetField('totalSize')}
                              >
                                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <BillingChangeBadge
                          beforePrice={Number(diskSizePrice.oldPrice)}
                          afterPrice={Number(diskSizePrice.newPrice)}
                          show={
                            formState.isDirty &&
                            formState.dirtyFields.totalSize &&
                            !formState.errors.totalSize &&
                            diskSizePrice.oldPrice !== diskSizePrice.newPrice
                          }
                        />
                        <div className="text-xs text-foreground-light">
                          Your plan includes {includedDiskGB} GB of disk size.
                        </div>
                      </div>
                    </FormItemLayout>
                  )}
                />
                <div className="grid grid-cols-12 gap-3">
                  {/* You can add additional content in the remaining 4 columns if needed */}
                  <div className="col-span-4">
                    {/* Additional content or information can go here */}
                  </div>
                  <div className="col-span-8 space-y-6 mt-6">
                    <DiskSpaceBar
                      showNewBar={form.formState.dirtyFields.totalSize !== undefined}
                      totalSize={size_gb}
                      usedSize={mainDiskUsed}
                      newTotalSize={
                        form.getValues('totalSize') <= size_gb
                          ? size_gb
                          : form.getValues('totalSize')
                      }
                    />
                    <DiskManagementDiskSizeReadReplicas
                      isDirty={form.formState.dirtyFields.totalSize !== undefined}
                      totalSize={size_gb * 1.25}
                      usedSize={mainDiskUsed}
                      newTotalSize={
                        form.getValues('totalSize') <= size_gb
                          ? size_gb * 1.25
                          : form.getValues('totalSize') * 1.25
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {isRequestingChanges ? (
              <Card className="px-2 rounded-none">
                <CardContent className="py-3 flex gap-3 px-3 items-center">
                  <div className="flex flex-col">
                    <p className="text-foreground-lighter text-sm p-0">
                      Disk configuration changes have been requested
                    </p>
                    <p className="text-sm">
                      The requested changes will be applied to your disk shortly
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <DiskCountdownRadial remainingTime={remainingTime} />
            )}

            {isPlanUpgradeRequired && <DiskManagementPlanUpgradeRequired />}

            <Card className="bg-surface-100 rounded-t-none">
              <CardContent className="flex items-center pb-0 py-3 px-8 gap-3 justify-end">
                <FormFooterChangeBadge formState={formState} />
                <div className="flex gap-2">
                  <Button
                    type="default"
                    onClick={() => form.reset()}
                    disabled={!form.formState.isDirty}
                  >
                    Cancel
                  </Button>
                  <DiskManagementReviewAndSubmitDialog
                    onSubmit={onSubmit}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    isWithinCooldown={disableInput}
                    form={form}
                    loading={isUpdatingDiskConfiguration}
                    diskSizePrice={diskSizePrice}
                    iopsPrice={iopsPrice}
                    throughputPrice={throughputPrice}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form_Shadcn_>
    </div>
  )
}
