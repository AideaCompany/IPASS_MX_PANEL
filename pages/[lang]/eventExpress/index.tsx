//react
//Components
import columns from '@/components/eventExpress/columns'
import CreateEventExpressModal from '@/components/eventExpress/CreateEventExpress'
import MainLayout from '@/components/layout/Layout'
import TableDatas from '@/components/TableDatas'
//types
import { Localization } from '@/i18n/types'
import useAuth from '@/providers/AuthContext'
//Context
import { getLocalizationProps } from '@/providers/LenguageContext'
import { getClientStateFn, updateClientWaStateFn } from '@/services/clientWa'
import { getAllContactUser, subscribeContactUser } from '@/services/contact'
import { listEventExpressFn, subListEventExpressFn } from '@/services/eventExpress'
import { getAllLocationActive } from '@/services/locations'
import { IContact, IEventExpress, ILocation, PermissionsPrivilege } from '@/types/types'
import { perNames } from '@/utils/utils'
import { Alert, Button, Input } from 'antd'
import { capitalize } from 'fogg-utils'
// import moment from 'moment-timezone'
//next
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface actualItem extends IEventExpress {}
var unsContact: any
var unsEveExpress: any
var unsStateWa: any

const EventExpress = (props: { localization: Localization; lang: string; localizationContact: Localization }) => {
  //props
  const { localization, lang, localizationContact } = props
  //states
  const [actualPermission, setActualPermission] = useState<PermissionsPrivilege>()
  const [data, setData] = useState<actualItem[]>([])
  const [filteredData, setFilteredData] = useState<actualItem[]>([])
  const [dataWa, setDataWa] = useState<any>(null)
  // const [allData, setAllData] = useState<actualItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [locations, setLocations] = useState<ILocation[]>([])
  const [contacts, setContacts] = useState<IContact[]>([])

  //providers
  const { permission, user } = useAuth()
  //Effect
  useEffect(() => {
    setActualPermission(permission.permissions?.find(e => e.sectionName === 'eventExpress'))
  }, [permission])

  useEffect(() => {
    if (actualPermission && user) {
      getStateWa()
      unsContact = subscribeContactUser(
        (newData: boolean) => {
          getData(false)
        },
        perNames.includes(permission.name as string) ? null : (user._id as string)
      )
      unsEveExpress = subListEventExpressFn((newData: boolean) => {
        getData(false)
      })

      unsStateWa = updateClientWaStateFn((newData: boolean) => {
        getStateWa()
      })
    }

    return () => {
      if (unsContact && unsContact.unsubscribe) {
        unsContact.unsubscribe()
      }
      if (unsEveExpress && unsEveExpress.unsubscribe) {
        unsEveExpress.unsubscribe()
      }
      if (unsStateWa && unsStateWa.unsubscribe) {
        unsStateWa.unsubscribe()
      }
    }
  }, [actualPermission, user])

  const getData = async (toLoading?: boolean) => {
    setLoading(true)
    const eventsExpress = await listEventExpressFn()
    await getContacts()
    await getStateWa()
    // const today = moment.tz('America/Guatemala')
    setLocations(await getAllLocationActive())
    setData(eventsExpress)
    setFilteredData(eventsExpress.filter((e: actualItem) => (!e.hourIn || !e.hourOut) && (e.state === 'waiting' || e.state === 'enable')))
    // const eventsToday = eventsExpress && eventsExpress.filter((e: IEventExpress) => today.isSame(e.createdAt, 'day'))
    // setAllData(eventsToday)
    setLoading(false)
  }

  const getContacts = async () => {
    const contactsData = await getAllContactUser()
    setContacts(contactsData.map(e => ({ ...e, name: `${capitalize(e.firstName)} ${capitalize(e.lastName)}` })))
  }

  const getStateWa = async () => {
    try {
      const resp = await getClientStateFn()
      if (resp.state === 'CONNECTED') {
        setDataWa(resp)
      } else {
        setDataWa(null)
      }
    } catch (error) {
      setDataWa(null)
    }
  }

  const onSearch = (value: any) => {
    const text = value.target.value
    text !== ''
      ? setFilteredData(
          data && data.filter(e => e?.contact?.firstName?.includes(text?.toLowerCase()) || e?.contact?.lastName?.includes(text?.toLowerCase()))
        )
      : setFilteredData(data.filter((e: actualItem) => (!e.hourIn || !e.hourOut) && (e.state === 'waiting' || e.state === 'enable')))
  }

  const createButton = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="buttonsFilter">
        <Button
          shape="round"
          onClick={() =>
            setFilteredData(data.filter((e: actualItem) => (!e.hourIn || !e.hourOut) && (e.state === 'waiting' || e.state === 'enable')))
          }
        >
          En curso
        </Button>
        <Button shape="round" onClick={() => setFilteredData(data.filter((e: actualItem) => e.hourIn && e.hourOut))}>
          Finalizados
        </Button>
        <Button shape="round" onClick={() => setFilteredData(data.filter((e: actualItem) => e.state === 'deny'))}>
          Rechazados
        </Button>
      </div>
      {actualPermission?.create && (
        <CreateEventExpressModal
          actualPermission={actualPermission as PermissionsPrivilege}
          getContacts={getContacts}
          translationsContact={localizationContact.translations}
          contacts={contacts}
          translations={localization.translations}
          locations={locations}
        />
      )}
    </div>
  )

  return (
    <>
      <MainLayout create={createButton} getData={getData} lang={lang} title={localization?.translations.titleSection + ' HOY'}>
        <>
          <Input.Search
            onChange={onSearch}
            style={{ marginBottom: 10 }}
            enterButton
            allowClear
            placeholder="Buscar nombre de visitante"
          ></Input.Search>
          <TableDatas
            columns={columns({
              translations: localization.translations,
              actualPermission: actualPermission as PermissionsPrivilege,
              permision: permission,
              lang: lang,
              locations: locations,
              after: () => {},
              contacts
            })}
            data={filteredData}
            loading={loading}
            pagination={{
              pageSize: 10,
              size: 'default',
              total: data.length
            }}
          />
          {!dataWa && (
            <Alert
              style={{ marginTop: '10px' }}
              message="Es necesario configurar el cliente de WhatsApp"
              type="warning"
              action={
                <Link href={{ pathname: '/[lang]/clientWa', query: { lang } }}>
                  <Button>Ir a configurar</Button>
                </Link>
              }
            />
          )}
        </>
      </MainLayout>
    </>
  )
}

export default React.memo(EventExpress)

export const getStaticProps: GetStaticProps = async ctx => {
  const localization = getLocalizationProps(ctx, 'eventExpress')
  const localizationContact = getLocalizationProps(ctx, 'contact')
  return {
    props: {
      localization,
      localizationContact
    }
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['es', 'en'].map(lang => ({ params: { lang } })),
    fallback: false
  }
}
