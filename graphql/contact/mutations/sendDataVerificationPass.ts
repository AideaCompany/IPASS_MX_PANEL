export const sendDataVerificationPass = /* GraphQL */ `
  mutation sendDataVerificationPass($input: verifiedDataInput, $ID: String) {
    sendDataVerificationPass(input: $input, ID: $ID) {
      _id
      firstName
      lastName
      email
      phone
      nickname
      host {
        _id
        name
        photo {
          filename
          key
        }
        lastname
        email
        codeWorker
        privilegeID {
          _id
          name
          createdAt
          updatedAt
        }
        active
        country
        token
        admin {
          _id
          name
          lastname
          email
          codeWorker
          active
          country
          token
          verifyLogin
          createdAt
          tokenExpo
          updatedAt
          canCreateHost
          allEventWithAuth
          canAccessToApp
          canAccessToWeb
          document
          typeDocument
          code
          phone
          QR
          canUseAuthenticator
          banFinish
        }
        verifyLogin
        createdAt
        tokenExpo
        updatedAt
        canCreateHost
        allEventWithAuth
        canAccessToApp
        canAccessToWeb
        document
        typeDocument
        code
        phone
        QR
        group {
          _id
          name
          exists
          abbreviation
        }
        nativeLocation {
          _id
          address
          name
          typeCheck
          createdAt
          updatedAt
          state
          abbreviation
          deletedDate
        }
        canUseAuthenticator
        timeZone {
          _id
          name
          start
          end
          days
          abbreviation
          createdAt
          updatedAt
        }
        banFinish
      }
      verified
      typeVerified
      verifiedData {
        photo
        documentA
        documentB
        birthDate
        expirationDate
        sex
        lastName
        firstName
        nationality
        documentNumber
        correctionName
        correctionLastname
        correctionNumber
      }
      verifiedDataPDF {
        photo
        documentA
        documentB
        num1
        type
        name
        expedition
        expiration
        licNum
        num2
      }
      banFinish
      createdAt
      updatedAt
      empresa
      DPI
    }
  }
`