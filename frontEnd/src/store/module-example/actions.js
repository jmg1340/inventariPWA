import Axios from "axios";
const server = "http://localhost:3001";

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
		await context.dispatch('actGetDocs')
  } catch (error) {
    console.log("error a actRemoveDoc")
    console.log( error )
  }
}
  
export async function actActualitzarDoc(context, payload) {
  try {
    await Axios.put(server + "/api_inventari/" + payload.idMongo, payload.registre)
		await context.dispatch('actGetDocs')
  } catch (error) {
    console.log("error a actActualitzarDoc")
    console.log( error )
  }
}
  
export async function actAdd(context, obj) {
	console.log("estic a actAdd")
	console.log(obj)
  try {
		await Axios.post(server + "/api_inventari", obj)
		await context.dispatch('actGetDocs')
  } catch (error) {
    console.log("error a actPost")
    console.log( error )
  }

}
  
