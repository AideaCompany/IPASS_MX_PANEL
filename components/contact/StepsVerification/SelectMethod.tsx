import { Button, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { ToolOutlined } from '@ant-design/icons'
import { Translations } from '@/i18n/types'

const SelectMethod = ({
  translations,
  selectMethod,
  setVisibleConfig,
  updateDevices,
  checkConfig
}: {
  translations: Translations
  selectMethod: React.Dispatch<React.SetStateAction<'DPI' | 'License' | 'PASS' | null>>
  setVisibleConfig: React.Dispatch<React.SetStateAction<boolean>>
  updateDevices: () => void
  checkConfig: () => void
}) => {
  useEffect(() => {
    updateDevices()
    checkConfig()
  }, [])

  return (
    <div className="selectMethod">
      <div className="header">
        <h2>{translations.welcomeVerification}</h2>
        <h2>Selecciona un método</h2>
      </div>
      <div className="buttons">
        <Button type="primary" onClick={() => selectMethod('DPI')} shape="round">
          DNI
        </Button>
        <Button type="primary" onClick={() => selectMethod('License')} shape="round">
          Licencia de conducción
        </Button>
        <Button type="primary" onClick={() => selectMethod('PASS')} shape="round">
          Pasaporte
        </Button>
      </div>
      <Tooltip title="Configurar Cámaras" placement="bottom">
        <Button
          onClick={() => {
            updateDevices()
            setVisibleConfig(true)
          }}
          className="buttonConfig"
          shape={'circle'}
          icon={<ToolOutlined />}
        />
      </Tooltip>
    </div>
  )
}

export default React.memo(SelectMethod)
