import {
  sendDataVerificationPassFn,
  sendVerification,
  sendVerificationPDF,
  serVerificationMRZ,
  serVerificationPass,
  serVerificationPDF,
  serVerificationPhoto
} from '@/services/contact'
import { ReadedMRZ, ReadedPDF } from '@/types/types'

export const sendAllData = async (data: any, selectedMethod: string | null, actualContact: string, readedData: ReadedMRZ | ReadedPDF | null) => {
  let data1 = { photo: null, documentA: null, documentB: null }
  data1.photo = data.photo
  data1.documentA = data.documentA
  data1.documentB = data.documentB

  let toSend = { ...data1, ...readedData }
  if (selectedMethod === 'DPI') {
    await sendVerification(toSend, actualContact)
  } else if (selectedMethod === 'License') {
    await sendVerificationPDF(toSend, actualContact)
  } else {
    await sendDataVerificationPassFn(toSend, actualContact)
  }
}

export const verifyPhoto = async (photo: any): Promise<boolean> => {
  const result = await serVerificationPhoto({ photo })
  return result
}

export const verifyMRZ = async (photo: any): Promise<ReadedMRZ> => {
  return new Promise((resolve, reject) => {
    serVerificationMRZ({ photo })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        console.error(err)
        resolve({ documentNumber: '' })
      })
  })
}

export const verifyPASS = async (photo: any): Promise<ReadedMRZ> => {
  return new Promise((resolve, reject) => {
    serVerificationPass({ photo })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        console.error(err)
        resolve({ documentNumber: '' })
      })
  })
}

export const verifyPDF = async (photo: any): Promise<ReadedPDF> => {
  return new Promise((resolve, reject) => {
    serVerificationPDF({ photo })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        console.error(err)
        resolve({ licNum: '' })
      })
  })
}
