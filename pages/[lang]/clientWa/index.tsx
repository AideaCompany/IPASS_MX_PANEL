//react
import React, { useEffect, useState } from 'react'
//Components
import MainLayout from '@/components/layout/Layout'
//types
import { Localization } from '@/i18n/types'
import useAuth from '@/providers/AuthContext'
//Context
import { getLocalizationProps } from '@/providers/LenguageContext'
import { getClientStateFn, loginClientWaFn, qrReloadedFn, updateClientWaStateFn } from '@/services/clientWa'
import { PermissionsPrivilege } from '@/types/types'
import { Button, message, Modal, Tooltip } from 'antd'
//next
import { GetStaticPaths, GetStaticProps } from 'next'
//other
import QrCode from 'qrcode.react'
import { ReloadOutlined } from '@ant-design/icons'

var unsQrWa: any
var unsStateWa: any

const clientWa = (props: { localization: Localization; lang: string }) => {
  //props
  const { localization, lang } = props

  //states
  const [actualPermission, setActualPermission] = useState<PermissionsPrivilege>()
  const [data, setData] = useState({ qr: '', reload: false })
  const [dataSession, setDataSession] = useState<any>({})
  //   const [categories, setCategories] = useState<IVisitorCategory[]>([])
  //   const [loading, setloading] = useState<boolean>(true)
  //providers
  const { permission, user } = useAuth()
  //Effect
  useEffect(() => {
    setActualPermission(permission.permissions?.find(e => e.sectionName === 'clientWa'))
  }, [permission])

  useEffect(() => {
    ;(async () => {
      if (actualPermission) {
        getData()
      }
    })()
  }, [actualPermission])

  useEffect(() => {
    if (actualPermission && user) {
      unsQrWa = qrReloadedFn(data => {
        setData(data)
      })

      unsStateWa = updateClientWaStateFn((newData: boolean) => {
        getData()
      })
    }

    return () => {
      if (unsQrWa && unsQrWa.unsubscribe) {
        unsQrWa.unsubscribe()
      }

      if (unsStateWa && unsStateWa.unsubscribe) {
        unsStateWa.unsubscribe()
      }
    }
  }, [actualPermission, user])

  const getData = async () => {
    try {
      console.log('aqui')
      const resp = await getClientStateFn()
      if (resp.state === 'CONNECTED') {
        setDataSession(resp.info)
        setData({ qr: '', reload: false })
      } else {
        setDataSession(false)
      }
    } catch (error) {
      setDataSession(false)
    }
  }

  const handleLinkWa = async () => {
    Modal.confirm({
      content: 'Se desvinculara la cuenta actual y permitirá autenticar un nuevo dispositivo',
      onOk: async () => {
        message.loading({ content: 'En proceso...', duration: 3.4 })
        await loginClientWaFn()
      }
    })
  }

  return (
    <>
      <MainLayout notShowHeader create={<></>} lang={lang} title={localization?.translations.titleSection}>
        <>
          <div className="dataClientWaContainer">
            <div className="info">
              <h2>Para vincular un dispositivo a WhatsApp:</h2>
              <ol>
                <li>
                  Selecciona <strong>Autenticar usuario</strong>, esto desvinculara la cuenta actual y permitirá autenticar un nuevo dispositivo
                </li>
                <li>Abre WhatsApp en tu teléfono</li>
                <li>
                  Toca <strong>Menú</strong> o <strong>Configuración</strong> y selecciona <strong>Dispositivos vinculados</strong>
                </li>
                <li>Cuando se active la cámara, apunta tu teléfono hacia esta pantalla para escanear el código</li>
              </ol>

              <Button style={{ marginTop: '15px' }} type="primary" shape="round" onClick={handleLinkWa}>
                Autenticar dispositivo
              </Button>
            </div>

            <div className="qrCode">
              <QrCode style={{ opacity: data.qr ? 1 : 0.2 }} value={data.qr} size={300} level={'M'} />
            </div>
          </div>
          <div className="dataStateContainer">
            <div className="header">
              <h2>Estado actual</h2>
              <Tooltip title={localization?.translations.reload}>
                <Button style={{ margin: '5px' }} key={2} shape="circle" icon={<ReloadOutlined />} onClick={getData} />
              </Tooltip>
            </div>

            <div className="dataClientWa">
              {!dataSession ? (
                <h3>No hay dipositivo vinculado</h3>
              ) : (
                <>
                  <p>
                    <strong>Nombre: </strong>
                    {dataSession?.pushname}
                  </p>
                  <p>
                    <strong>Número:</strong> +{dataSession?.me?.user}
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      </MainLayout>
    </>
  )
}

export default React.memo(clientWa)

export const getStaticProps: GetStaticProps = async ctx => {
  const localization = getLocalizationProps(ctx, 'clientWa')
  return {
    props: {
      localization
    }
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['es', 'en'].map(lang => ({ params: { lang } })),
    fallback: false
  }
}
