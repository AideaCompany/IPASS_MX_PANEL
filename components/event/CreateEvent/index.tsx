import { formElementsSuperanfitrion } from '@/components/contact/formelementsSuperAnfitrion'
import RealTimeVerification from '@/components/contact/RealTimeVerification'
import FormFactory from '@/components/crudFunctions/FormFactory'
import client from '@/graphql/config'
import { ThemeContext } from '@/providers/ThemeContext'
import { createContactFn } from '@/services/contact'
import { createEventExpressFn } from '@/services/eventExpress'
import { IContact, IContactExpressForm, IEventExpress, PermissionsPrivilege } from '@/types/types'
import { CommonPropsModal } from '@/utils/utils'
import { ArrowLeftOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, FormInstance, Input, message, Modal, Tooltip } from 'antd'
import { gql } from 'apollo-boost'
import { deleteContact } from 'graphql2/mutation'
import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import { formElementsCreate } from '../formElementsCreate'
import { iProps } from './props.interface'
import Tablecontac from './Tablecontac'

const CreateEventExpressModal: FC<iProps> = ({ translations, contacts, translationsContact, getContacts, locations, actualPermission }) => {
  //#region provider
  const { theme } = useContext(ThemeContext)
  //#endregion provider

  //#region ref
  const formRef = useRef<FormInstance<IContactExpressForm>>(null)
  console.log(formRef)
  const formRefEvent = useRef<FormInstance<IEventExpress>>(null)
  //#endregion ref

  //#region states
  const [visible, setVisible] = useState(true)
  const [registro, setRegistro] = useState<boolean>(false)
  const [visibleVideo, setVisibleVideo] = useState(false)
  const [searchedData, setSearchedData] = useState(contacts)
  const [contactsInvitation, setContactsInvitation] = useState<IContact[]>([])
  const [selectedContact, setSelectedContact] = useState<React.Key[]>([])
  const [eventExpressData, setEventExpressData] = useState<IEventExpress>({} as IEventExpress)
  const [contactVerification, setContactVerification] = useState<string | null>(null)
  const [createContact, setCreateContact] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingEvent, setLoadingEvent] = useState(false)

  //#endregion states

  // console.log(se;e)

  //#region  effect
  useEffect(() => {
    setSearchedData(contacts)
  }, [contacts])

  useEffect(() => {
    if (selectedContact.length > 0) {
      //@ts-ignore
      setContactsInvitation(contacts.filter(e => e._id !== selectedContact[0]).map(e => ({ ...e, name: `${e.name} - ${e.DPI}` })))
      formRefEvent.current?.setFieldsValue({ invitados: [] })
    }
  }, [selectedContact])
  //#endregion effect

  //#region functions
  const handleClose = () => {
    setVisible(false)
    setSearchedData(contacts)
    setSelectedContact([])
    setContactVerification(null)
    setCreateContact(false)
  }

  const onSearch = (value: any) => {
    const text = value.target.value
    text !== '' ? setSearchedData(contacts && contacts.filter(e => e?.DPI?.includes(text?.toLowerCase()))) : setSearchedData(contacts)
  }

  const createEvent = async () => {
    setLoadingEvent(true)
    try {
      const data = formRefEvent.current?.getFieldsValue()
      const event = await createEventExpressFn({ ...(data as IEventExpress), contact: selectedContact[0] })
      if (event) {
        setVisible(false)
        setLoadingEvent(false)
        setCreateContact(false)
        formRefEvent.current?.resetFields()
        getContacts()
        handleClose()
        message.success('Evento express creado con exito')
      }
    } catch (error) {
      message.error('Error al crear el evento express')
      console.log(error)
    } finally {
      setLoadingEvent(false)
    }
  }

  const createCon = async () => {
    setLoading(true)
    try {
      const info = formRef.current?.getFieldsValue() as IContactExpressForm
      const { realTimeVerification, ...dataInfo } = info
      const { firstName1, firstName2, lastName1, lastName2, ...data } = dataInfo

      if (firstName2) {
        data.firstName = firstName1 + ' ' + firstName2
      } else {
        data.firstName = firstName1
      }

      if (lastName2) {
        data.lastName = lastName1 + ' ' + lastName2
      } else {
        data.lastName = lastName1
      }

      if (!data?.indicativo) {
        ;(data as IContact).indicativo = '+502'
      }

      let newContact
      if (realTimeVerification && data.verificationRegistro) {
        newContact = await createContactFn({ ...data, verificationRegistro: false } as IContact)
      } else {
        newContact = await createContactFn(data as IContact)
      }

      setContactVerification(newContact._id)

      await getContacts()

      const infoEvent: any = await formRefEvent.current?.getFieldsValue()
      if (infoEvent.name) {
        setEventExpressData(infoEvent)
      }

      setSelectedContact([newContact._id])
      if (realTimeVerification) {
        setVisibleVideo(true)
      }
      setRegistro(data.verificationRegistro)
      message.success('Contacto creado con exito')
      setCreateContact(false)
    } catch (error: any) {
      if (error['graphQLErrors'][0].message.includes('E11000 duplicate')) {
        message.error({ content: 'Contacto con DNI ya existente', key: 'update' })
      } else {
        message.error('Error al crear el contacto')
      }
    } finally {
      setLoading(false)
    }
  }
  //#endregion functions

  const deleteActualContact = () => {
    client
      .mutate({ mutation: gql(deleteContact), variables: { input: { _id: contactVerification } } })
      .then(res => {
        // message.success(translations.successfullyDeleted)
        getContacts()
      })
      .catch(err => {
        console.error(err)
        // message.error(translations.errorDeleted)
      })
  }

  return (
    <>
      <Modal onCancel={handleClose} {...CommonPropsModal} visible={visible} width={createContact ? 700 : 1300}>
        <div className="container_create_event_express">
          <div className="contact">
            {!createContact ? (
              <>
                <h2>Información de visitante</h2>
                <div className="searchContact">
                  <div className="searchItems">
                    <Input.Search
                      onChange={onSearch}
                      style={{ marginBottom: 10 }}
                      enterButton
                      allowClear
                      placeholder="Buscar DNI de contacto existente"
                    />

                    <Button type="primary" icon={<UserOutlined />} onClick={() => setCreateContact(true)}>
                      Crear Contacto
                    </Button>
                  </div>

                  <Tablecontac
                    actualPermission={actualPermission as PermissionsPrivilege}
                    setSelectedContact={setSelectedContact}
                    selectedContact={selectedContact}
                    data={searchedData}
                    translations={translationsContact}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="formContainer">
                  <h2>Crear contacto</h2>

                  <Form initialValues={{ verificationRegistro: true, realTimeVerification: true }} ref={formRef}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                      <FormFactory translate={translationsContact} theme={theme} formElements={formElementsSuperanfitrion()} isUpdate={false} />
                    </div>
                  </Form>

                  <div style={{ marginTop: '5px' }}>
                    <h2>Añadir a Evento</h2>
                    <p>
                      <i>Si desea añadir el contacto a un evento diligencie los datos del siguiente formulario:</i>
                    </p>
                    <Form initialValues={{ open: true }} ref={formRefEvent}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <FormFactory
                          translate={translations}
                          theme={theme}
                          formElements={formElementsCreate(locations, contactsInvitation)}
                          isUpdate={false}
                        />
                      </div>
                    </Form>
                  </div>
                </div>
              </>
            )}

            <div className="buttonsContact flex">
              {!createContact ? (
                <>
                  <Button icon={<UserOutlined />} shape="round" type="primary" onClick={() => setCreateContact(true)}>
                    Crear Contacto
                  </Button>
                  <Button
                    type="primary"
                    disabled={selectedContact.length === 0}
                    shape="round"
                    style={{ marginLeft: 8 }}
                    onClick={() => setSelectedContact([])}
                  >
                    Desasociar contacto
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    style={{ marginRight: 10 }}
                    icon={<ArrowLeftOutlined />}
                    shape="round"
                    type="primary"
                    onClick={() => setCreateContact(false)}
                  >
                    Regresar
                  </Button>
                  <Button loading={loading} icon={<PlusOutlined />} shape="round" type="primary" onClick={createCon}>
                    Crear Contacto
                  </Button>
                </>
              )}
            </div>
          </div>
          {!createContact && (
            <div className="eventExpress">
              <h2>Información de Evento</h2>
              <div className="formContainer">
                <Form initialValues={{ open: true }} ref={formRefEvent}>
                  <FormFactory
                    translate={translations}
                    theme={theme}
                    formElements={formElementsCreate(locations, contactsInvitation)}
                    isUpdate={false}
                  />
                </Form>
              </div>
              <div className="buttonsContact flex">
                {/* <Button
                  title={selectedContact.length ? 'Debes seleccionar un contacto' : ''}
                  disabled={selectedContact.length === 0}
                  loading={loadingEvent}
                  icon={<PlusOutlined />}
                  shape="round"
                  type="primary"
                  onClick={createEvent}
                >
                  Crear Evento 
                </Button> */}
              </div>
            </div>
          )}
        </div>
      </Modal>
      <Tooltip title={translations.titleModalCreateContact}>
        <Button
          style={{ margin: '5px' }}
          onClick={() => {
            setVisible(true)
            setCreateContact(true)
          }}
          shape="circle"
          icon={<UserOutlined />}
        />
      </Tooltip>
      {/* <Tooltip title={translations.titleModalCreate}>
        <Button style={{ margin: '5px' }} onClick={() => setVisible(true)} shape="circle" icon={<PlusOutlined />} />
      </Tooltip> */}
    </>
  )
}

export default React.memo(CreateEventExpressModal)
