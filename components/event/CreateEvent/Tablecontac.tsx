import TableDatas from '@/components/TableDatas'
import { Translations } from '@/i18n/types'
import { IContact, PermissionsPrivilege } from '@/types/types'
import { TableRowSelection } from 'antd/lib/table/interface'
import React from 'react'
import columns from './ColumnsContact'

const Tablecontac = ({
  data,
  translations,
  selectedContact,
  setSelectedContact,
  actualPermission
}: {
  data: IContact[]
  translations: Translations
  selectedContact: React.Key[]
  setSelectedContact: React.Dispatch<React.SetStateAction<React.Key[]>>
  actualPermission: PermissionsPrivilege
}) => {
  //#region functions
  const rowSelection: TableRowSelection<IContact> = {
    onChange: async (selectedRows: React.Key[]) => {
      setSelectedContact(selectedRows)
    },
    selectedRowKeys: selectedContact,
    type: 'radio',
    columnTitle: 'Seleccionar',
    columnWidth: 100
  }

  //#endregion functions
  return (
    <TableDatas
      aditionalProps={{ rowSelection }}
      pagination={false}
      scroll={{ y: '40vh' }}
      columns={columns({ translations, actualPermission })}
      data={data}
    />
  )
}

export default React.memo(Tablecontac)
