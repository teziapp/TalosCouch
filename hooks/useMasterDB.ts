import PouchDB from "pouchdb-browser";
import pouchFind from "pouchdb-find";
import { couch_url, dbName } from "../config";
import pouchAuth from "pouchdb-authentication";

PouchDB.plugin(pouchFind);
PouchDB.plugin(pouchAuth);

let localDB:any;
let remoteDB:any;
let remoteUserDB = new PouchDB(`${couch_url}/_users`, {skip_setup: true});
remoteUserDB.logIn('admin', 'admin');
  const setVariables = (props?: any) => {
    
    localDB = localDB || new PouchDB(dbName, {auto_compaction: true});
    remoteDB = remoteDB ||new PouchDB(`${couch_url}/${dbName}`, { skip_setup: true });
    if (!localDB || !remoteDB) throw new Error("cant initialise database");
    
    
    return {localDB, remoteDB};
};
  // Please update the username and password of the couchDB
  // remoteDB.login('admin', 'admin')
  export const useMasterDB = ()=>{
    
    const remoteData = {
      allDocs: async(options: any) => {
          console.log("getting data from remoteDB", {options});
          // setVariables();
          let response = await remoteDB.allDocs(options || {});
          return response;
      },
      get: async(docId: string, options?: any,typeObj?:any,concatDoc?:any) => {
          try {
              // console.log("getting data from remoteDB");
              // setVariables({ignoreUserData: true});
              let response;
              if(typeObj?.type=="attachment" && concatDoc){
                  let attachmentDoc =  await remoteDB.get(docId, options || {});
                  attachmentDoc =  attachmentDoc._attachments;
                  concatDoc._attachments={};
                  Object.values(concatDoc?.products).map((prodObj:any, index:number) => {
                      if (prodObj?.imageFieldName) {
                      if((attachmentDoc[prodObj.imageFieldName] && attachmentDoc[prodObj.imageFieldName].data)){

                          concatDoc._attachments[prodObj.imageFieldName]={data:{}};
                          if(typeObj?.preview){
                              Object.assign(
                                  concatDoc._attachments[prodObj.imageFieldName]?.data,
                                  concatDoc.products[index].imageUrl = URL.createObjectURL(attachmentDoc[prodObj.imageFieldName].data)
                                  );
                          }else{
                              console.log(attachmentDoc[prodObj.imageFieldName]?.data)
                              Object.assign(
                                  concatDoc._attachments[prodObj.imageFieldName]?.data,
                                  concatDoc._attachments[prodObj.imageFieldName].data.preview = URL.createObjectURL(attachmentDoc[prodObj.imageFieldName]?.data)
                              );}
                          }
                      }
                      });
                  response = concatDoc;
                           
              }else{
                  response = await remoteDB.get(docId, options || {});
              }
              //handle document not present error to check in remotedb for deleted documents & documents with attachment
              return response;
          } catch (error) {
              return error;
          }
      },
      
      query: async(queryObj: any, options?: any) => {
          try {
              // console.log("getting data from remoteDB");
              // setVariables();
              //console.log({localDB, remoteDB});
              console.log("remoData.query", queryObj, options);
              let response = await remoteDB.query(queryObj, options);
              console.log({response});
              return response;
          } catch (err) {

              throw err;
          }
      },
     
  }
    return remoteData
  }
