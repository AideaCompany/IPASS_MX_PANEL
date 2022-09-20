import { IApps, IGroupWorker, ILocation, iTimeZone, Privilege, User } from '@/types/types'
import { FormFactory } from '@/types/typeTemplate'
import CustomRoles from './CustomRoles'

export const formElementsSuperAdmin = (
  privilege: Privilege[],
  locations: ILocation[],
  timeZone: iTimeZone[],
  group: IGroupWorker[],
  apps: IApps[],
  users: User[],
  inicialData?: boolean
): FormFactory.FormFactoryType[] => {
  return [
    {
      name: 'photo',
      type: 'avatar',
      show: true,
      inicialData
    },
    {
      name: 'name',
      type: 'string',
      required: true
    },
    {
      name: 'name1',
      type: 'string'
    },
    {
      name: 'name2',
      type: 'string'
    },
    {
      name: 'lastname',
      type: 'string',
      required: true
    },
    {
      name: 'lastname1',
      type: 'string'
    },
    {
      name: 'lastname2',
      type: 'string'
    },
    {
      name: 'privilegeID',
      type: 'custom',
      required: true,
      custom: CustomRoles({ privilege, users })
    },
    {
      name: 'email',
      type: 'email',
      required: true
    },
    {
      name: 'verifyLogin',
      type: 'boolean'
    },
    {
      name: 'typeDocument',
      type: 'select',
      data: ['DPI', 'Documento extranjero'],
      required: true
    },
    {
      name: 'document',
      type: 'string',
      required: true
    },
    {
      name: 'phone',
      type: 'phone'
    },
    {
      name: 'codeWorker',
      type: 'string'
    },
    {
      name: 'canAccessToApp',
      type: 'boolean'
    },
    {
      name: 'canAccessToWeb',
      type: 'boolean'
    },
    {
      name: 'code',
      type: 'boolean'
    },
    {
      name: 'canCreateHost',
      type: 'boolean'
    },
    {
      name: 'allEventWithAuth',
      type: 'boolean'
    },
    {
      name: 'canUseAuthenticator',
      type: 'boolean'
    },
    {
      name: 'group',
      type: 'selectMultiple',
      data: group
    },
    {
      name: 'nativeLocation',
      type: 'selectMultiple',
      data: locations
    },
    {
      name: 'timeZone',
      type: 'selectMultiple',
      data: timeZone
    },
    {
      name: 'apps',
      type: 'selectMultiple',
      data: apps
    }
  ]
}
