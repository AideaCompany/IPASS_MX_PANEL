import { ColumnFilterItem } from 'antd/lib/table/interface'
import { FC } from 'react'

export type ColumnFactoryType = {
  name: string
  search?: boolean
  sort?: boolean
  sortDate?: boolean
  filter?: ColumnFilterItem[]
  customRender?: (render: any, index?: number) => JSX.Element | string
  customFilter?: string
  filteredValue?: any
  fixed?: 'left' | 'right' | false
  width?: any
  ellipsis?: boolean
}

export type basicTable = {
  _id: string
  key?: string
  createdAt?: Date
  updatedAt?: Date
  operation?: operation
}
export type operation = 'create' | 'update' | 'delete'
/**
 *  Type para form factory
 */
export namespace FormFactory {
  /**
   *  Type para form factory
   * @param FormFactoryType
   * @param typeForm Tipo de item
   */
  export interface FormFactoryType {
    /**
     * @param name Nombre del item, colocar el mismo para errores y para label
     * @param type Tipo de item
     * @param visible Para mostrar o no un label
     * @param required Saber si el form es requerido
     * @param adicionalProps Agrega props adicionales para modificar los props por default de cada componente
     * @param fullWidth 100% de ancho
     * @param data Cuando type es de tipo select o selectMultiple es obligatorio para mostrar las opciones
     * @param actualFormRef Para tablas, es la referencia actual del formulario
     * @param FormItems Para tablas, es el formulario para la tabla
     * @param columnsItem Para tablas, son las columnas para la tabla
     * @param inicialData Para tablas, en caso de que sea un update, para colocar los datos anteriores
     * @param formListElements Para formularios dinamicos, espeficia elementos que seran agregados dinamicamente
     */
    name: string
    type: typeForm
    visible?: boolean
    required?: boolean
    adicionalProps?: any
    fullWidth?: boolean
    // Para selector
    data?: any[]
    //para Table
    actualFormRef?: FormInstance<any> | null | undefined
    FormItems?: (update: boolean, key?: string) => JSX.Element
    columnsItem?: ColumnFactoryType[]
    inicialData?: any
    //Para dynamic
    formListElements?: FormFactoryType[]
    //mostrar
    show?: boolean

    custom?: JSX.Element | FC | any
  }
  export type typeForm =
    | 'string'
    | 'number'
    | 'date'
    | 'phone'
    | 'boolean'
    | 'email'
    | 'select'
    | 'textArea'
    | 'dynamic'
    | 'avatar'
    | 'table'
    | 'upload'
    | 'selectMultiple'
    | 'dateRange'
    | 'hour'
    | 'dateNoTime'
    | 'custom'
}

export type fileType = {
  _id: string
  filename: string
  key: string
}
