import Axios from "axios";

const server = "http://localhost:3000";

export async function actGetDocs(context) {
  
  try {
    const result = await Axios.get(server + "/api_inventari")
    const data = result.data;
    context.commit( "mutGetDocs", data);

  } catch (error) {
    console.log("error a actGetDocs")
    console.log( error )
  }

}
  
export async function actRemoveDoc(context, id) {
  
  try {
    await Axios.delete(server + "/api_inventari/" + id)


  } catch (error) {
    console.log("error a actRemoveDoc")
    console.log( error )
  }

}
  
export async function actAdd(context, obj) {
  
  try {
		await Axios.post(server + "/api_inventari/")
		
  } catch (error) {
    console.log("error a actPost")
    console.log( error )
  }

}
  
