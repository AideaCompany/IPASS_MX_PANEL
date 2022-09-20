//types
import ShowVerificationModal from '@/components/contact/showVerificationModal'
import ColumnFactory from '@/components/crudFunctions/columnFactory'
import { deleteContact } from '@/graphql/contact/mutations/deleteContact'
import { Translations } from '@/i18n/types'
import { ThemeContext } from '@/providers/ThemeContext'
import { IContact, ILocation, PermissionsPrivilege } from '@/types/types'
import { ColumnType } from 'antd/lib/table'
import gql from 'graphql-tag'
import moment from 'moment-timezone'
import React, { useContext } from 'react'
import DeleteItem from '../../crudFunctions/delete'

const columns = (props: { translations: Translations; actualPermission: PermissionsPrivilege }): ColumnType<ILocation>[] => {
  const { translations, actualPermission } = props
  const { theme } = useContext(ThemeContext)

  const operations = (record: IContact) => (
    <>
      {(record.verifiedData !== null || record.verifiedDataPDF !== null) && <ShowVerificationModal translations={translations} record={record} />}
      {
        //@ts-ignore
        <DeleteItem
          afterDelete={() => {}}
          actualPermission={actualPermission as any}
          translations={translations}
          mutation={gql(deleteContact)}
          theme={theme}
          record={record}
        />
      }
    </>
  )
  return ColumnFactory({
    columns: [
      {
        name: 'firstName'
      },
      {
        name: 'lastName'
      },
      {
        name: 'DPI'
      },
      {
        name: 'createdAt',
        customRender: (record: IContact) => moment.tz(record.createdAt, 'America/Guatemala').format('YYYY-MM-DD, hh:mm:ss a') || 'No date',
        sortDate: true
      }
    ],
    translate: translations,
    operations: operations,
    nonShowOperation: !actualPermission?.update && !actualPermission?.delete && true
  })
}

export default columns
