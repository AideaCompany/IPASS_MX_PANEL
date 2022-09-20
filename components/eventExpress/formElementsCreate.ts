import { IContact, ILocation } from '@/types/types'
import { FormFactory } from '@/types/typeTemplate'

export const formElementsCreate = (locations?: ILocation[], contacts?: IContact[]): FormFactory.FormFactoryType[] => [
  {
    name: 'name',
    type: 'select',
    data: ['Reunión', 'Cita', 'Otro'],
    required: true,
    fullWidth: true
  },
  {
    name: 'location',
    type: 'select',
    data: locations,
    required: true,
    fullWidth: true
  },
  {
    name: 'motivo',
    type: 'textArea',
    required: true,
    adicionalProps: { maxLength: 100 },
    fullWidth: true
  },

  {
    name: 'invitados',
    type: 'selectMultiple',
    data: contacts,
    fullWidth: true
  },
  {
    name: 'open',
    type: 'boolean',
    fullWidth: true
  }
]
