//react
//Components
import columns from '@/components/eventExpress/FinishedEvents/columns'
import TableDatas from '@/components/TableDatas'
//types
import { Localization } from '@/i18n/types'
import useAuth from '@/providers/AuthContext'
//Context
import { IEventExpress, PermissionsPrivilege } from '@/types/types'
import { Collapse } from 'antd'
//next
import React from 'react'

const FinishedEvents = (props: {
  localization: Localization
  lang: string
  allData: IEventExpress[]
  loading: boolean
  actualPermission: PermissionsPrivilege
}) => {
  //props
  const { localization, lang, allData, loading, actualPermission } = props

  //providers
  const { permission } = useAuth()

  return (
    <Collapse className="collapseEvents" ghost>
      <Collapse.Panel header="Ver todos los Eventos Express" key="1" className="collapseEvents--panel">
        <TableDatas
          columns={columns({
            translations: localization.translations,
            actualPermission: actualPermission as PermissionsPrivilege,
            permision: permission,
            lang: lang,
            after: () => {}
          })}
          data={allData}
          loading={loading}
          pagination={{
            pageSize: 10,
            size: 'default',
            total: allData.length
          }}
        />
      </Collapse.Panel>
    </Collapse>
  )
}

export default React.memo(FinishedEvents)
