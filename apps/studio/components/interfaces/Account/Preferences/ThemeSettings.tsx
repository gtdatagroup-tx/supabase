import { useTheme } from '@mildtomato/next-themes'
import Panel from 'components/ui/Panel'
import { BASE_PATH } from 'lib/constants'
import SVG from 'react-inlinesvg'
import {
  Label_Shadcn_,
  RadioGroup_Shadcn_,
  RadioGroupLargeItem_Shadcn_,
  singleThemes,
  Theme,
} from 'ui'

const ThemeSettings = () => {
  const { theme, setTheme } = useTheme()

  function SingleThemeSelection() {
    return (
      <form>
        <RadioGroup_Shadcn_
          name="theme"
          onValueChange={setTheme}
          aria-label="Choose a theme"
          defaultValue={theme}
          value={theme}
          className="flex flex-wrap gap-3"
        >
          {singleThemes.map((theme: Theme) => (
            <RadioGroupLargeItem_Shadcn_ key={theme.value} value={theme.value} label={theme.name}>
              <SVG src={`${BASE_PATH}/img/themes/${theme.value}.svg`} />
            </RadioGroupLargeItem_Shadcn_>
          ))}
        </RadioGroup_Shadcn_>
      </form>
    )
  }

  return (
    <Panel title={<h5 key="panel-title">Appearance</h5>}>
      <Panel.Content className="grid grid-cols-12">
        <div className="col-span-4 flex flex-col gap-5">
          <Label_Shadcn_ htmlFor="theme" className="text-light">
            Theme mode
          </Label_Shadcn_>
          <p className="text-sm text-foreground-light max-w-[220px]">
            Choose how Supabase looks to you. Select a single theme, or sync with your system.
          </p>
        </div>

        <div className="col-span-8 flex flex-col gap-4">
          <p className="text-sm text-light">Supabase will use your selected theme</p>
          <SingleThemeSelection />
        </div>
      </Panel.Content>
    </Panel>
  )
}

export default ThemeSettings
