import { CommonPropsModal } from '@/utils/utils'
import { Button, Modal, Steps } from 'antd'
import React, { useState } from 'react'
import Webcam from 'react-webcam'

const ConfigureCamera = ({
  devices,
  visibleConfig,
  setVisibleConfig,
  setCamera,
  setDeviceId
}: {
  devices: any
  visibleConfig: boolean
  setVisibleConfig: React.Dispatch<React.SetStateAction<boolean>>
  setCamera: React.Dispatch<React.SetStateAction<any>>
  setDeviceId: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [selectedCamera, setSelectedCamera] = useState<null | string>(null)
  const [step, setStep] = useState(0)

  const [data, setData] = useState<any>(null)

  const HandleChangeCurrent = () => {
    if (step === 0) {
      setData({ ladoA: selectedCamera as string })
      setSelectedCamera(null)
      setStep(step => step + 1)
    } else {
      setData({ ...data, ladoB: selectedCamera as string })
      setCamera({ ...data, ladoB: selectedCamera as string })
      setDeviceId(data?.ladoA)
      localStorage.setItem('cameraConfig', JSON.stringify({ ...data, ladoB: selectedCamera as string }))
      reinit()
    }
  }

  const reinit = () => {
    setVisibleConfig(false)
    setSelectedCamera(null)
    setStep(0)
    setData({})
  }

  return (
    <Modal visible={visibleConfig} {...CommonPropsModal} width={1200} onCancel={reinit}>
      <div className="modalConfigContainer">
        <h2>Configuración</h2>
        <Steps current={step} size="small" className="stepsConfig">
          <Steps.Step title="Selecciona la cámara A"></Steps.Step>
          <Steps.Step title="Selecciona la cámara B"></Steps.Step>
        </Steps>

        <div className="deviceContainer">
          {devices.map((device: any, key: any) => (
            <div>
              <div className={'devices'} onClick={() => setSelectedCamera(device?.deviceId)}>
                <h3>{device.label || `Device ${key + 1}`}</h3>
                <Webcam audio={false} className="devices--video" videoConstraints={{ deviceId: device.deviceId }} />
              </div>
              <div className={device?.deviceId === selectedCamera ? 'devices--selected' : 'devices--notSelected'}></div>
            </div>
          ))}
        </div>
        <div className="buttons">
          {step === 0 && (
            <Button type="primary" onClick={HandleChangeCurrent}>
              Seleccionar
            </Button>
          )}
          {step === 1 && (
            <>
              <Button onClick={() => setStep(step - 1)}>Atras</Button>
              <Button type="primary" onClick={HandleChangeCurrent}>
                Confirmar
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ConfigureCamera
