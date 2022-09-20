import { Translations } from '@/i18n/types'
import { ThemeContext } from '@/providers/ThemeContext'
import { IApps, IGroupWorker, ILocation, iTimeZone, Privilege, User } from '@/types/types'
import { useContext } from 'react'
import FormFactory from '../crudFunctions/FormFactory'
import { formElements } from './formElements'
import { formElementsSuperAdmin } from './formElementsSuperAdmin'
import { formElementsAdmin } from './formElementsAdmin'
const FormItems = (props: {
  permission: Privilege
  translations: Translations
  isUpdate?: boolean
  privileges: Privilege[]
  locations: ILocation[]
  timeZone: iTimeZone[]
  group: IGroupWorker[]
  apps: IApps[]
  users: User[]
  inicialData?: boolean
}): JSX.Element => {
  const { translations, isUpdate, apps, privileges, permission, locations, group, timeZone, users, inicialData } = props
  const updating = isUpdate ? true : false
  const { theme } = useContext(ThemeContext)
  const formItemFromPrivilege = () => {
    switch (permission.name) {
      case 'Super_admin':
        return formElementsSuperAdmin(privileges, locations, timeZone, group, apps, users, inicialData)
      case 'admin':
        return formElementsAdmin(privileges, locations, timeZone, group, inicialData)
      default:
        return formElements(privileges, apps, locations, timeZone, inicialData)
    }
  }

  return (
    <div className="formContainer">
      <FormFactory translate={translations} isUpdate={updating} theme={theme} formElements={formItemFromPrivilege()} />
    </div>
  )
}
export default FormItems
