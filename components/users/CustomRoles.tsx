import { Privilege, User } from '@/types/types'
import { Form, Select } from 'antd'
import React from 'react'

const CustomRoles = ({ privilege, users }: { privilege: Privilege[]; users: User[] }) => {
  return (
    <>
      <Form.Item noStyle name="privilegeID" rules={[{ required: true, message: 'Por favor, Inserta un rol' }]}>
        <Select
          placeholder="Rol"
          allowClear
          showSearch
          filterOption={(input: any, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {privilege.map(c => {
            return (
              <Select.Option key={c._id} value={c._id}>
                {c.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => {
          return prevValues.privilegeID !== currentValues.privilegeID
        }}
      >
        {({ getFieldValue }) =>
          getFieldValue('privilegeID') === '62a122dd250731f7e6055664' ? (
            <div style={{ marginTop: '20px' }}>
              <h3>Administrador asociado</h3>
              <Form.Item noStyle name="admin" rules={[{ required: true, message: 'Por favor, Asigna un administrador al host' }]}>
                <Select
                  placeholder="Asocia un administrador"
                  allowClear
                  showSearch
                  filterOption={(input: any, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {users
                    .filter((e: User) => e.privilegeID._id === '623cf3c647ec1da0c19400f5')
                    .map(c => {
                      return (
                        <>
                          <Select.Option key={c._id} value={c._id}>
                            {`${c.name} ${c.lastname} - ${c.nativeLocation?.map(e => e.name).join(',')}`}
                          </Select.Option>
                        </>
                      )
                    })}
                </Select>
              </Form.Item>
            </div>
          ) : null
        }
      </Form.Item>
    </>
  )
}

export default CustomRoles
