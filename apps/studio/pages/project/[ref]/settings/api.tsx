import ServiceList from 'components/interfaces/Settings/API/ServiceList'
import { SettingsLayout } from 'components/layouts'
import {
  ScaffoldColumn,
  ScaffoldContainer,
  ScaffoldHeader,
  ScaffoldSection,
  ScaffoldTitle,
} from 'components/layouts/Scaffold'
import type { NextPageWithLayout } from 'types'

const ApiSettings: NextPageWithLayout = () => {
  return (
    <>
      <ScaffoldContainer id="billing-page-top">
        <ScaffoldHeader>
          <ScaffoldTitle>API Services</ScaffoldTitle>
        </ScaffoldHeader>
      </ScaffoldContainer>
      <ScaffoldContainer>
        <ServiceList />
      </ScaffoldContainer>
    </>
  )
}

ApiSettings.getLayout = (page) => <SettingsLayout title="API Settings">{page}</SettingsLayout>
export default ApiSettings
