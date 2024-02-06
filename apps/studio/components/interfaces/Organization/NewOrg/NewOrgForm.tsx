import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { PaymentMethod } from '@stripe/stripe-js'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Button,
  IconEdit2,
  IconExternalLink,
  IconHelpCircle,
  IconInfo,
  Input,
  Listbox,
  Toggle,
} from 'ui'

import { useParams } from 'common'
import SpendCapModal from 'components/interfaces/Billing/SpendCapModal'
import InformationBox from 'components/ui/InformationBox'
import Panel from 'components/ui/Panel'
import { useOrganizationCreateMutation } from 'data/organizations/organization-create-mutation'
import { invalidateOrganizationsQuery } from 'data/organizations/organizations-query'
import { useStore } from 'hooks'
import { BASE_PATH, PRICING_TIER_LABELS_ORG } from 'lib/constants'
import { getURL } from 'lib/helpers'

const ORG_KIND_TYPES = {
  PERSONAL: 'Personal',
  EDUCATIONAL: 'Educational',
  STARTUP: 'Startup',
  AGENCY: 'Agency',
  COMPANY: 'Company',
  UNDISCLOSED: 'N/A',
}
const ORG_KIND_DEFAULT = 'PERSONAL'

const ORG_SIZE_TYPES = {
  '1': '1 - 10',
  '10': '10 - 49',
  '50': '50 - 99',
  '100': '100 - 299',
  '300': 'More than 300',
}
const ORG_SIZE_DEFAULT = '1'

interface NewOrgFormProps {
  onPaymentMethodReset: () => void
}

/**
 * No org selected yet, create a new one
 */
const NewOrgForm = ({ onPaymentMethodReset }: NewOrgFormProps) => {
  const queryClient = useQueryClient()
  const { ui } = useStore()
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const { plan, name, kind, size, spend_cap } = useParams()

  const [orgName, setOrgName] = useState(name || '')
  const [orgKind, setOrgKind] = useState(
    kind && Object.keys(ORG_KIND_TYPES).includes(kind) ? kind : ORG_KIND_DEFAULT
  )
  const [orgSize, setOrgSize] = useState(size || ORG_SIZE_DEFAULT)
  // [Joshen] Separate loading state here as there's 2 async processes
  const [newOrgLoading, setNewOrgLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()

  // URL param support for passing plan
  const [dbPricingTierKey, setDbPricingTierKey] = useState(
    plan && ['free', 'team', 'pro'].includes(plan) ? plan.toUpperCase() : 'FREE'
  )

  const [showSpendCapHelperModal, setShowSpendCapHelperModal] = useState(false)
  const [isSpendCapEnabled, setIsSpendCapEnabled] = useState(spend_cap ? Boolean(spend_cap) : true)

  useEffect(() => {
    const query: Record<string, string> = {}
    query.plan = dbPricingTierKey.toLowerCase()
    if (orgName) query.name = orgName
    if (orgKind) query.kind = orgKind
    if (orgSize) query.size = orgSize
    if (isSpendCapEnabled) query.spend_cap = isSpendCapEnabled.toString()

    router.push({ query })
  }, [dbPricingTierKey, orgName, orgKind, orgSize, isSpendCapEnabled])

  const { mutateAsync: createOrganization } = useOrganizationCreateMutation({
    onSuccess: async (org: any) => {
      await invalidateOrganizationsQuery(queryClient)
      router.push(`/new/${org.slug}`)
    },
  })

  function validateOrgName(name: any) {
    const value = name ? name.trim() : ''
    return value.length >= 1
  }

  function onOrgNameChange(e: any) {
    setOrgName(e.target.value)
  }

  function onOrgKindChange(value: any) {
    setOrgKind(value)
  }

  function onOrgSizeChange(value: any) {
    setOrgSize(value)
  }

  function onDbPricingPlanChange(value: string) {
    setDbPricingTierKey(value)
  }

  async function createOrg(paymentMethodId?: string) {
    const dbTier = dbPricingTierKey === 'PRO' && !isSpendCapEnabled ? 'PAYG' : dbPricingTierKey
    try {
      await createOrganization({
        name: orgName,
        kind: orgKind,
        tier: ('tier_' + dbTier.toLowerCase()) as
          | 'tier_payg'
          | 'tier_pro'
          | 'tier_free'
          | 'tier_team'
          | 'tier_enterprise',
        ...(orgKind == 'COMPANY' ? { size: orgSize } : {}),
        payment_method: paymentMethodId,
      })
    } catch (error) {
      resetPaymentMethod()
      setNewOrgLoading(false)
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const isOrgNameValid = validateOrgName(orgName)
    if (!isOrgNameValid) {
      return ui.setNotification({ category: 'error', message: 'Organization name is empty' })
    }

    if (!stripe || !elements) {
      return console.error('Stripe.js has not loaded')
    }
    setNewOrgLoading(true)

    if (dbPricingTierKey === 'FREE') {
      await createOrg()
    } else if (!paymentMethod) {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${getURL()}/new`,
          expand: ['payment_method'],
        },
      })

      if (error || !setupIntent.payment_method) {
        ui.setNotification({
          category: 'error',
          message: error?.message ?? ' Failed to save card details',
        })
        setNewOrgLoading(false)
        return
      }

      const paymentMethodFromSetup = setupIntent.payment_method as PaymentMethod

      setPaymentMethod(paymentMethodFromSetup)
      await createOrg(paymentMethodFromSetup.id)
    } else {
      await createOrg(paymentMethod.id)
    }
  }

  const resetPaymentMethod = () => {
    setPaymentMethod(undefined)
    return onPaymentMethodReset()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Panel
          hideHeaderStyling
          title={
            <div key="panel-title">
              <h4>Create a new organization</h4>
            </div>
          }
          footer={
            <div key="panel-footer" className="flex w-full items-center justify-between">
              <Button type="default" onClick={() => router.push('/projects')}>
                Cancel
              </Button>
              <div className="flex items-center space-x-3">
                <p className="text-xs text-foreground-lighter">
                  You can rename your organization later
                </p>
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={newOrgLoading}
                  disabled={newOrgLoading}
                >
                  Create organization
                </Button>
              </div>
            </div>
          }
        >
          <Panel.Content className="pt-0">
            <p className="text-sm">This is your organization within Supabase.</p>
            <p className="text-sm text-foreground-light">
              For example, you can use the name of your company or department.
            </p>
          </Panel.Content>
          <Panel.Content className="Form section-block--body has-inputs-centered">
            <Input
              autoFocus
              label="Name"
              type="text"
              layout="horizontal"
              placeholder="Organization name"
              descriptionText="What's the name of your company or team?"
              value={orgName}
              onChange={onOrgNameChange}
            />
          </Panel.Content>
          <Panel.Content className="Form section-block--body has-inputs-centered">
            <Listbox
              label="Type of organization"
              layout="horizontal"
              value={orgKind}
              onChange={onOrgKindChange}
              descriptionText="What would best describe your organization?"
            >
              {Object.entries(ORG_KIND_TYPES).map(([k, v]) => {
                return (
                  <Listbox.Option key={k} label={v} value={k}>
                    {v}
                  </Listbox.Option>
                )
              })}
            </Listbox>
          </Panel.Content>

          {orgKind == 'COMPANY' ? (
            <Panel.Content className="Form section-block--body has-inputs-centered">
              <Listbox
                label="Company size"
                layout="horizontal"
                value={orgSize}
                onChange={onOrgSizeChange}
                descriptionText="How many people are in your company?"
              >
                {Object.entries(ORG_SIZE_TYPES).map(([k, v]) => {
                  return (
                    <Listbox.Option key={k} label={v} value={k}>
                      {v}
                    </Listbox.Option>
                  )
                })}
              </Listbox>
            </Panel.Content>
          ) : (
            <></>
          )}

          <Panel.Content>
            <Listbox
              label="Pricing Plan"
              layout="horizontal"
              value={dbPricingTierKey}
              // @ts-ignore
              onChange={onDbPricingPlanChange}
              // @ts-ignore
              descriptionText={
                <>
                  Select a plan that suits your needs.&nbsp;
                  <a
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                    href="https://supabase.com/pricing"
                  >
                    More details
                  </a>
                </>
              }
            >
              {Object.entries(PRICING_TIER_LABELS_ORG).map(([k, v]) => {
                return (
                  <Listbox.Option key={k} label={v} value={k}>
                    {v}
                  </Listbox.Option>
                )
              })}
            </Listbox>
          </Panel.Content>

          {dbPricingTierKey === 'PRO' && (
            <>
              <Panel.Content className="border-b border-panel-border-interior-light dark:border-panel-border-interior-dark">
                <Toggle
                  id="spend-cap"
                  layout="horizontal"
                  label={
                    <div className="flex space-x-4">
                      <span>Spend Cap</span>
                      <IconHelpCircle
                        size={16}
                        strokeWidth={1.5}
                        className="transition opacity-50 cursor-pointer hover:opacity-100"
                        onClick={() => setShowSpendCapHelperModal(true)}
                      />
                    </div>
                  }
                  checked={isSpendCapEnabled}
                  onChange={() => setIsSpendCapEnabled(!isSpendCapEnabled)}
                  descriptionText={
                    <div>
                      <p>
                        By default, Pro plan organizations have a spend cap to control costs. When
                        enabled, usage is limited to the plan's quota, with restrictions when limits
                        are exceeded. To scale beyond Pro limits without restrictions, disable the
                        spend cap and pay for over-usage beyond the quota.
                      </p>
                    </div>
                  }
                />
              </Panel.Content>

              <SpendCapModal
                visible={showSpendCapHelperModal}
                onHide={() => setShowSpendCapHelperModal(false)}
              />
            </>
          )}

          {dbPricingTierKey !== 'FREE' && (
            <Panel.Content>
              {paymentMethod?.card !== undefined ? (
                <div key={paymentMethod.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <img
                      alt="Card"
                      src={`${BASE_PATH}/img/payment-methods/${paymentMethod.card.brand
                        .replace(' ', '-')
                        .toLowerCase()}.png`}
                      width="32"
                    />
                    <Input
                      readOnly
                      className="w-64"
                      size="small"
                      value={`•••• •••• •••• ${paymentMethod.card.last4}`}
                    />
                    <p className="text-sm tabular-nums">
                      Expires: {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}
                    </p>
                  </div>
                  <div>
                    <Button
                      type="outline"
                      icon={<IconEdit2 />}
                      onClick={() => resetPaymentMethod()}
                      disabled={newOrgLoading}
                      className="hover:border-gray-500"
                    />
                  </div>
                </div>
              ) : (
                <PaymentElement />
              )}
            </Panel.Content>
          )}
        </Panel>
      </form>
    </>
  )
}

export default NewOrgForm
