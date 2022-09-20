import { loginClientWa } from '@/graphql/clientWa/mutations/loginClientWa'
import { getClientState } from '@/graphql/clientWa/queries/getClientState'
import { qrReloaded } from '@/graphql/clientWa/suscriptions/qrReloaded'
import { subGetState } from '@/graphql/clientWa/suscriptions/subGetState'
import client from '@/graphql/config'
import gql from 'graphql-tag'

export const getClientStateFn = async () => {
  client.cache.reset()
  return await (
    await client.query({ query: gql(getClientState) })
  ).data.getClientState
}

export const loginClientWaFn = async () => {
  return await (
    await client.mutate({ mutation: gql(loginClientWa) })
  ).data.loginClientWa
}

export const qrReloadedFn = async (after: (data: any) => void) => {
  return client.subscribe({ query: gql(qrReloaded) }).subscribe({
    next: ({ data }) => {
      after(data.qrReloaded)
    },
    error(err) {
      console.log('err', err)
    }
  })
}

export const updateClientWaStateFn = async (after: (data: boolean) => void) => {
  return client.subscribe({ query: gql(subGetState) }).subscribe({
    next: ({ data }) => {
      after(data.subGetState)
    },
    error(err) {
      console.log('err', err)
    }
  })
}
