export const updateApps = /* GraphQL */` 
 mutation updateApps($input: updateAppsInput){
    updateApps(input: $input){
        _id
        name
        url
        clientID
        createdAt
        updatedAt
    }
}
`;
