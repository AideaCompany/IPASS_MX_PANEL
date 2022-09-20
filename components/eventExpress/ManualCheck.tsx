import { denyEventExpressFn, manualCheckUpdateFn } from '@/services/eventExpress'
import { CommonPropsModal } from '@/utils/utils'
import { ExportOutlined, PhoneFilled } from '@ant-design/icons'
import { Button, message, Modal, Tooltip } from 'antd'
import { DocumentNode } from 'graphql'
import moment from 'moment-timezone'
import React, { useState } from 'react'
import client from '../../graphql/config'
import { Translations } from '../../i18n/types'

const ManualCheck = (props: {
  translations: Translations
  mutation: DocumentNode
  theme: string
  record: any
  afterUpdate?: () => void
}): JSX.Element => {
  const { translations, mutation, record, afterUpdate } = props
  const [visible, setVisible] = useState(false)
  const [actualItem, setactualItem] = useState<any>()

  const manualCheckMutation = async (input: { eventExpress: string; type: string; hour: any }) => {
    return await manualCheckUpdateFn({ input })
  }

  const updateItem = (data: any) => {
    let inputData: any = { _id: data._id }
    const hour = moment.tz('America/Guatemala')
    if (data.hourIn) {
      inputData = { ...inputData, hourOut: hour }
    } else {
      inputData = { ...inputData, hourIn: hour }
    }

    client
      .mutate({ mutation: mutation, variables: { input: { ...inputData } } })
      .then(res => {
        message.success(data.hourIn ? 'Check-Out realizado' : 'Check-in realizado')
        handleCancel()
        manualCheckMutation(
          data.hourIn ? { eventExpress: data._id as string, type: 'out', hour } : { eventExpress: data._id as string, type: 'in', hour }
        )
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.error(err)
            message.error('Ha ocurrido un error')
          })
        afterUpdate && afterUpdate()
      })
      .catch(err => {
        console.error(err)
        message.error('Ha ocurrido un error')
      })
  }

  const deny = async () => {
    try {
      await denyEventExpressFn(actualItem?._id as string)
    } catch (error) {
      console.log(error)
    } finally {
      handleCancel()
    }
  }

  const handleCancel = () => {
    setactualItem(null)
    setVisible(false)
  }

  return (
    <>
      <Modal visible={visible} {...CommonPropsModal} width={520} onCancel={handleCancel}>
        <h2>Revisar Entrada</h2>
        <div className="buttonsCheck">
          <Button className="buttonsCheck--item" type="primary" onClick={() => updateItem(actualItem)}>
            {actualItem?.hourIn ? translations.checkOut : translations.checkIn}
          </Button>
          {!actualItem?.hourIn && (
            <Button className="buttonsCheck--item" danger onClick={deny}>
              Rechazar
            </Button>
          )}

          <Button className="buttonsCheck--item" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </Modal>
      {(!record.hourOut || !record.hourIn) && (
        <Tooltip placement="top" title={record.hourIn ? translations.checkOut : translations.checkIn}>
          <a>
            {record.hourIn ? (
              <ExportOutlined
                className="blink"
                style={{ paddingLeft: '5px', fontSize: '18px', color: 'tomato' }}
                onClick={() => {
                  setactualItem(record)
                  setVisible(true)
                }}
              />
            ) : (
              <PhoneFilled
                className="blink"
                style={{ paddingLeft: '5px', fontSize: '18px', color: 'green' }}
                onClick={() => {
                  setactualItem(record)
                  setVisible(true)
                }}
              />
            )}
          </a>
        </Tooltip>
      )}
    </>
  )
}

export default React.memo(ManualCheck)
