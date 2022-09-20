export const listUser = /* GraphQL */ `
  query listUser($page: Int, $limit: Int, $filters: Any) {
    listUser(page: $page, limit: $limit, filters: $filters) {
      docs {
        _id
        name
        photo {
          filename
          key
        }
        name1
        name2
        lastname1
        lastname2
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
        apps {
          _id
          name
          url
          abbreviation
          clientID
          createdAt
          updatedAt
        }
      }
      totalDocs
      limit
      page
      totalPages
      pagingCounter
      hasPrevPage
      hasNextPage
      offset
      prevPage
      nextPage
    }
  }
`
