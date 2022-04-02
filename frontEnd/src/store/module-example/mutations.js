
/* INVENTARI HOSPITAL */

export function mutGetDocs(state, data) {
  state.docs = data;
}



/* INVENTARI ASEPEYO */

export function mutGetDocsAsepeyo(state, data) {
  state.docsAsepeyo = data;
}


/*  DADES EXTERNES */

export function mutGetDocsES(state, data) {
  console.log("Estic a mutGetDocsES")
  console.log("data", data)
  state.docsES = data;
}


export function mutGetDocsTelefons(state, data) {
  console.log("Estic a mutGetDocsTelefons")
  console.log("data", data)
  state.docsTelefons = data;
}


