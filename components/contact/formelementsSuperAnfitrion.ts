import { FormFactory } from '@/types/typeTemplate'

export const formElementsSuperanfitrion = (): FormFactory.FormFactoryType[] => [
  {
    name: 'DPI',
    type: 'string',
    required: true,
    fullWidth: true
    // adicionalProps:{ma}
  },
  // {
  //   name: 'firstName',
  //   type: 'string',
  //   required: true
  // },
  // {
  //   name: 'lastName',
  //   type: 'string',
  //   required: true
  // },
  {
    name: 'firstName1',
    type: 'string',
    required: true,
    fullWidth: true
  },
  {
    name: 'firstName2',
    type: 'string',
    fullWidth: true
  },
  {
    name: 'lastName1',
    type: 'string',
    required: true,
    fullWidth: true
  },
  {
    name: 'lastName2',
    type: 'string',
    fullWidth: true
  },
  // {
  //   name: 'email',
  //   type: 'email',
  //   required: true
  // },
  // {
  //   name: 'phone',
  //   type: 'phone',
  //   required: true
  // },
  {
    name: 'verificationRegistro',
    type: 'boolean',
    fullWidth: true
  },
  {
    name: 'realTimeVerification',
    type: 'boolean',
    fullWidth: true
  }
]
