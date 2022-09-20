//types
import DeleteWithUser from '../../crudFunctions/delete'
import { Translations } from '@/i18n/types'
import { IEvent, IEventExpress, ILocation, PermissionsPrivilege, Privilege } from '@/types/types'
import { getTime } from '@/utils/utils'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/lib/table'
import { capitalize } from 'lodash'
import gql from 'graphql-tag'
//component
import ColumnFactory from '../../crudFunctions/columnFactory'
import EventInfo from '../EventInfo'
import { deleteEventExpress } from '@/graphql/eventExpress/mutations/deleteEventExpress'
import { useContext } from 'react'
import { ThemeContext } from '@/providers/ThemeContext'

const columns = (props: {
  translations: Translations
  permision: Privilege
  actualPermission: PermissionsPrivilege
  lang: string
  beforeShowUpdate?: (param: any) => any
  after: () => void
}): ColumnType<IEvent>[] => {
  const { translations, actualPermission } = props
  const { theme } = useContext(ThemeContext)

  const operations = (record: IEventExpress) => (
    <>
      <EventInfo event={record} />
      <DeleteWithUser
        actualPermission={actualPermission}
        translations={translations}
        mutation={gql(deleteEventExpress)}
        theme={theme}
        record={record}
        // afterDelete={after}
      />
    </>
  )

  return ColumnFactory({
    columns: [
      {
        name: 'name',
        fixed: 'left',
        width: 120,
        search: true,
        ellipsis: true
      },
      {
        name: 'start',
        customRender: (render: IEventExpress) => (render.start ? <>{getTime(render.start)}</> : <span>-</span>),
        width: 120
      },
      {
        name: 'end',
        customRender: (render: IEventExpress, index?: number) => {
          return render.end ? getTime(render.end) : <span>-</span>
        },
        width: 120
      },

      {
        name: 'authorizedBy',
        ellipsis: true,
        width: 120,
        customRender: (render: IEventExpress) =>
          render.authorizedBy ? `${capitalize(render.authorizedBy.name)} ${capitalize(render.authorizedBy.lastname)}` : <span>-</span>
      },
      {
        name: 'state',
        customRender: (render: IEventExpress) => {
          if (render.state === 'waiting') {
            return <ClockCircleOutlined className="iconEventExpressWaiting " />
          } else if (render.state === 'enable') {
            return <CheckCircleOutlined className="iconEventExpressEnable" />
          } else {
            return <CloseCircleOutlined className="iconEventExpressDeny" />
          }
        },
        width: 100
      },
      {
        name: 'hourIn',
        customRender: (render: IEventExpress) => (render.hourIn ? <>{getTime(render.hourIn)}</> : <span>-</span>),
        ellipsis: true,
        width: 150
      },
      {
        name: 'hourOut',
        customRender: (render: IEventExpress) => (render.hourOut ? <>{getTime(render.hourOut)}</> : <span>-</span>),
        ellipsis: true,
        width: 150
      },
      {
        name: 'location',
        ellipsis: true,
        width: 120,
        customRender: (render: IEventExpress) => <>{`${(render?.location as ILocation)?.name}`}</>
      }
    ],
    translate: translations,
    operations: operations,
    nonShowOperation: false
  })
}

export default columns
