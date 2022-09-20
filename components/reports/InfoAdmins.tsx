import { ILocation, User } from '@/types/types'
import { capitalize, CommonPropsModal } from '@/utils/utils'
import { InfoOutlined } from '@ant-design/icons'
import { Button, Descriptions, Modal, Tooltip } from 'antd'
import { useState } from 'react'

const InfoAdmin = ({ location }: { location: ILocation }) => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Modal onCancel={() => setVisible(false)} visible={visible} {...CommonPropsModal} width={400}>
        <div className="formContainer">
          {location.admins.length > 0 ? (
            <div>
              <h2>Información Administradores</h2>
              {(location.admins as User[]).map(e => {
                return (
                  <Descriptions key={e._id} column={1}>
                    <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Nombre">
                      {capitalize(e.name)} {capitalize(e.lastname)}
                    </Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} label="Email">
                      {e?.email}
                    </Descriptions.Item>
                  </Descriptions>
                )
              })}
            </div>
          ) : (
            <p>No hay administradores asociados</p>
          )}
        </div>
      </Modal>
      <Tooltip title="Información administradores">
        <Button size="small" onClick={() => setVisible(true)} shape="circle" icon={<InfoOutlined />} />
      </Tooltip>
    </>
  )
}

export default InfoAdmin
