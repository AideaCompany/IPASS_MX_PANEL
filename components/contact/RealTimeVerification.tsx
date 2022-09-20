import { Translations } from '@/i18n/types'
import { verifyContactID } from '@/services/contact'
import { createEventExpressFn } from '@/services/eventExpress'
import { IEventExpress, ReadedMRZ, ReadedPDF } from '@/types/types'
import { CommonPropsModal, getImageFormUrl } from '@/utils/utils'
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Card, Image, message, Modal, Select, Spin } from 'antd'
import { sendAllData, verifyMRZ, verifyPASS, verifyPDF, verifyPhoto } from 'helpers/verification'
import ImageNext from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import ConfigureCamera from './ConfigureCamera/ConfigureCamera'
import SelectMethod from './StepsVerification/SelectMethod'

const { Meta } = Card

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const RealTimeVerification = ({
  translations,
  visible,
  setVisible,
  actualContact,
  registro,
  reloadData,
  deleteContact,
  eventExpress
}: {
  translations: Translations
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  actualContact: string
  registro: boolean
  reloadData: () => void
  deleteContact: () => void
  eventExpress: IEventExpress
}) => {
  const [deviceId, setDeviceId] = useState<string>('')
  const [devices, setDevices] = useState([])

  const [camera, setCamera] = useState<{ ladoA: string; ladoB: string } | null>(null)

  const [visibleConfig, setVisibleConfig] = useState<boolean>(false)

  const [loading, setLoading] = useState(false)
  const [finalImages, setFinalImages] = useState<{ photo: string | null; documentA: string | null; documentB: string | null }>({
    photo: null,
    documentA: null,
    documentB: null
  })
  const [showCapture, setShowCapture] = useState(false)
  const [snap, setSnap] = useState<string | null>(null)
  const [readedData, setreadedData] = useState<ReadedMRZ | ReadedPDF | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<'DPI' | 'License' | 'PASS' | null>(null)
  const [actualState, setactualState] = useState({ name: 'photo', title: 'Acerca tu cara y toma una foto', photo: '/photo.png', step: 'Paso 1' })

  const [data, setData] = useState<any>({ photo: null, documentA: null, documentB: null })

  const webCamRef = useRef(null)

  const handleDevices = (mediaDevices: any) => {
    setDevices(mediaDevices.filter(({ kind }: { kind: string }) => kind === 'videoinput'))
  }

  const updateDevices = () => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  }

  const handleCamera = (id: string) => {
    setDeviceId(id)
  }

  const checkConfig = () => {
    const deviceIdList = devices.map(({ deviceId }: { deviceId: string }) => deviceId)
    const config = JSON.parse(localStorage.getItem('cameraConfig') || '{}')
    const isConfigAvailable = deviceIdList.includes(config?.ladoA) && deviceIdList.includes(config?.ladoB)
    if (isConfigAvailable) {
      setCamera({ ladoA: config.ladoA, ladoB: config.ladoB })
      setDeviceId(config.ladoA)
    } else {
      setCamera({ ladoA: deviceIdList[0], ladoB: deviceIdList[0] })
    }
  }

  useEffect(() => {
    updateDevices()
    checkConfig()
  }, [])

  const reinit = async () => {
    await updateDevices()
    checkConfig()
    setSnap(null)
    setSelectedMethod(null)
    setactualState({ name: 'photo', title: 'Acerca tu cara y toma una foto', photo: '/photo.png', step: 'Paso 1' })
    setData({})
    setreadedData(null)
    setVisible(false)
  }

  const handleCancel = async () => {
    try {
      Modal.confirm({
        centered: true,
        title: 'Cancelar',
        content: '¿Estás seguro de cancelar la verificación?',
        width: 500,
        okText: 'No, quiero continuar ',
        cancelText: 'Si, quiero cancelar la verificación',
        cancelButtonProps: { danger: true },
        onOk: () => {},
        onCancel: async () => {
          await deleteContact()
          reinit()
        }
      })
    } catch (error) {
      message.error({ key: 'error', content: 'Error al verificar' })
    }
  }

  const capture = useCallback(() => {
    //@ts-ignore
    const webImage = webCamRef?.current?.getScreenshot()
    setSnap(webImage)
    setShowCapture(true)
  }, [webCamRef])

  const verify = async (verification: boolean) => {
    message.loading({ key: 'info', content: 'Verificando', duration: 0 })
    if (actualState.name === 'photo') {
      getImageFormUrl(snap as string, async (data: any) => {
        if (registro || !verification) {
          setFinalImages((prevData: any) => ({ ...prevData, photo: snap }))
          setData((prevData: any) => ({ ...prevData, photo: data }))
          if (selectedMethod === 'PASS') {
            setDeviceId(camera?.ladoB as string)
            setactualState({
              name: 'documentB',
              title: 'Sube la foto de tu pasaporte',
              photo: '/passport.png',
              step: 'Paso 2'
            })
          } else {
            setDeviceId(camera?.ladoB as string)
            setactualState({
              name: 'documentA',
              title: selectedMethod === 'DPI' ? 'DPI lado A' : 'Licencia lado A',
              photo: '/documentA.png',
              step: 'Paso 2'
            })
          }
          message.info({ key: 'info', content: 'Hemos verificado la foto con éxito' })
        } else {
          if (await verifyPhoto(data)) {
            setFinalImages((prevData: any) => ({ ...prevData, photo: snap }))
            setData((prevData: any) => ({ ...prevData, photo: data }))
            if (selectedMethod === 'PASS') {
              setDeviceId(camera?.ladoB as string)
              setactualState({
                name: 'documentB',
                title: 'Sube la foto de tu pasaporte',
                photo: '/passport.png',
                step: 'Paso 2'
              })
            } else {
              setDeviceId(camera?.ladoB as string)
              setactualState({
                name: 'documentA',
                title: selectedMethod === 'DPI' ? 'DPI lado A' : 'Licencia lado A',
                photo: '/documentA.png',
                step: 'Paso 2'
              })
            }
            // setshowHint(false)
            message.info({ key: 'info', content: 'Hemos verificado la foto con éxito' })
          } else {
            // setshowHint(true)
            // getHint()
            message.info({ key: 'info', content: 'No hemos podido verificar la foto' })
          }
        }
        setShowCapture(false)
      })
      setShowCapture(false)
    } else if (actualState.name === 'documentA') {
      getImageFormUrl(snap as string, async (data: any) => {
        if (registro || !verification) {
          setFinalImages((prevData: any) => ({ ...prevData, documentA: snap }))
          setData((prevData: any) => ({ ...prevData, documentA: data }))
          message.info({ key: 'info', content: 'Hemos encontrado el lado A de tu documento' })
          setactualState({
            name: 'documentB',
            title: selectedMethod === 'DPI' ? 'DPI lado B' : 'Licencia lado B',
            photo: '/documentB.png',
            step: 'Paso 3'
          })
        } else {
          if (await verifyPhoto(data)) {
            setFinalImages((prevData: any) => ({ ...prevData, documentA: snap }))
            setData((prevData: any) => ({ ...prevData, documentA: data }))
            message.info({ key: 'info', content: 'Hemos encontrado el lado A de tu documento' })
            // setshowHint(false)
            // getHint()

            setactualState({
              name: 'documentB',
              title: selectedMethod === 'DPI' ? 'DPI lado B' : 'Licencia lado B',
              photo: '/documentB.png',
              step: 'Paso 3'
            })
          } else {
            // setshowHint(true)
            // getHint()
            message.info({ key: 'info', content: 'No hemos podido encontrar el lado A de tu documento ' })
          }
        }
      })
      setShowCapture(false)
    } else if (actualState.name === 'documentB') {
      getImageFormUrl(snap as string, async (data: any) => {
        if (selectedMethod === 'DPI') {
          if (registro || !verification) {
            setFinalImages((prevData: any) => ({ ...prevData, documentB: snap }))
            setData((prevData: any) => ({ ...prevData, documentB: data }))
            message.info({ key: 'info', content: 'Hemos encontrado el lado B de tu documento ' })
            setactualState({ name: 'all', title: '', photo: '', step: 'Revisar imágenes' })
          } else {
            const readedData = await verifyMRZ(data)
            if (readedData.documentNumber !== '') {
              setFinalImages((prevData: any) => ({ ...prevData, documentB: snap }))
              setData((prevData: any) => ({ ...prevData, documentB: data }))
              setreadedData(readedData)
              // setshowHint(false)
              message.info({ key: 'info', content: 'Hemos encontrado el lado B de tu documento ' })
              setactualState({ name: 'all', title: '', photo: '', step: 'Revisar imágenes' })
            } else {
              // setshowHint(true)
              message.info({ key: 'info', content: 'No hemos podido encontrar el lado B de tu documento ' })
            }
          }
        } else if (selectedMethod === 'License') {
          if (registro || !verification) {
            setFinalImages((prevData: any) => ({ ...prevData, documentB: snap }))
            setData((prevData: any) => ({ ...prevData, documentB: data }))
            message.info({ key: 'info', content: 'Hemos encontrado el lado B de tu licencia ' })
            setactualState({ name: 'all', title: '', photo: '', step: 'Revisar imágenes' })
          } else {
            const readedData = await verifyPDF(data)
            if (readedData.licNum !== '') {
              setFinalImages((prevData: any) => ({ ...prevData, documentB: snap }))
              setData((prevData: any) => ({ ...prevData, documentB: data }))
              setreadedData(readedData)
              // setshowHint(false)
              message.info({ key: 'info', content: 'Hemos encontrado el lado B de tu licencia ' })
              setactualState({ name: 'all', title: '', photo: '', step: 'Revisar imágenes' })
            } else {
              // setshowHint(true)
              message.info({ key: 'info', content: 'No hemos podido encontrar el lado B de tu licencia ' })
            }
          }
        } else {
          if (registro || !verification) {
            setFinalImages((prevData: any) => ({ ...prevData, documentB: snap }))
            setData((prevData: any) => ({ ...prevData, documentB: data }))
            message.info({ key: 'info', content: 'Hemos encontrado tu pasaporte' })
            setactualState({ name: 'all', title: '', photo: '', step: 'Revisar imágenes' })
          } else {
            const readedData = await verifyPASS(data)
            if (readedData.documentNumber !== '') {
              setFinalImages((prevData: any) => ({ ...prevData, documentB: snap }))
              setData((prevData: any) => ({ ...prevData, documentB: data }))
              setreadedData(readedData)
              // setshowHint(false)
              message.info({ key: 'info', content: 'Hemos encontrado tu pasaporte' })
              setactualState({ name: 'all', title: '', photo: '', step: 'Revisar imágenes' })
            } else {
              // setshowHint(true)
              message.info({ key: 'info', content: 'No hemos podido encontrar tu pasaporte ' })
            }
          }
        }
      })
      setShowCapture(false)
    } else if (actualState.name === 'all') {
      setLoading(true)
      await sendAllData(data, selectedMethod, actualContact, readedData)
      if (registro || !verification) {
        await verifyContactID(actualContact)
      }

      if (Object.keys(eventExpress).length) {
        await createEventExpressFn({ ...(eventExpress as IEventExpress), contact: actualContact })
      }
      await reloadData()
      message.info({ key: 'info', content: 'Verificado' })
      reinit()
      setLoading(false)
    }
  }

  return (
    <>
      <ConfigureCamera
        devices={devices}
        visibleConfig={visibleConfig}
        setVisibleConfig={setVisibleConfig}
        setCamera={setCamera}
        setDeviceId={setDeviceId}
      />
      <Modal visible={visible} onCancel={handleCancel} {...CommonPropsModal} width={800}>
        {selectedMethod ? (
          <div className="modalCamera">
            <div className="title">
              {actualState.step !== '' && <h1>{actualState.step}</h1>}
              <div className="info_container">
                <div className="info_container-element">
                  <p>{actualState.title}</p>
                  {actualState.name !== 'all' && (
                    <div className="select_container">
                      <Select onChange={handleCamera} value={deviceId ? deviceId : ''} style={{ width: 300 }}>
                        {devices.map(({ deviceId, label }) => (
                          <Select.Option key={deviceId} value={deviceId}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>

                <div className="image">{actualState.photo !== '' && <img src={actualState.photo} />}</div>
              </div>
            </div>

            {actualState.name === 'all' && (
              <Spin spinning={loading} indicator={antIcon}>
                <div className="elementsContainer">
                  <Card hoverable className="cardElement" cover={<Image src={finalImages.photo as string} />}>
                    <Meta title="Foto" />
                  </Card>

                  {selectedMethod !== 'PASS' && (
                    <Card hoverable className="cardElement" cover={<Image src={finalImages.documentA as string} />}>
                      <Meta title="Lado A Documento" />
                    </Card>
                  )}

                  <Card hoverable className="cardElement" cover={<Image src={finalImages.documentB as string} />}>
                    <Meta title={selectedMethod === 'PASS' ? 'Pasaporte' : 'Lado B Documento'} />
                  </Card>
                </div>
              </Spin>
            )}

            {actualState.name === 'all' ? (
              <Button type="primary" onClick={() => verify(false)} shape="round" style={{ marginTop: 20, width: '100%' }}>
                Confirmar
              </Button>
            ) : (
              <div className="camera">
                {showCapture && snap ? (
                  <ImageNext src={snap} width={640} height={480} />
                ) : (
                  <div className="camera_container">
                    <Webcam
                      // className="cameraOptions"
                      className="cameraImage"
                      ref={webCamRef}
                      audio={false}
                      minScreenshotHeight={1280}
                      minScreenshotWidth={720}
                      screenshotQuality={1}
                      videoConstraints={{ deviceId }}
                      screenshotFormat="image/png"
                    />
                  </div>
                )}

                <div className="buttons">
                  {showCapture && snap ? (
                    <>
                      <Button type="primary" onClick={() => verify(true)} shape="round">
                        Confirmar
                      </Button>
                      <Button danger onClick={() => setShowCapture(false)} shape="round">
                        Volver a intentar
                      </Button>
                      {!registro && (
                        <Button onClick={() => verify(false)} shape="round">
                          Continuar sin verificación
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button type="primary" onClick={capture} shape="round">
                      Captura
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <SelectMethod
            checkConfig={checkConfig}
            updateDevices={updateDevices}
            translations={translations}
            selectMethod={setSelectedMethod}
            setVisibleConfig={setVisibleConfig}
          />
        )}
      </Modal>
    </>
  )
}

export default React.memo(RealTimeVerification)
