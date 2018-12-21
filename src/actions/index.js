import Axios from "axios"
import ActionTypes from './action-types';
import { makeid } from "../utils";


export function requestPersons() {
  return {
    type: ActionTypes.REQUEST_PERSONS,
  };
}
export function receivePersons(personsList) {
  return {
    type: ActionTypes.RECEIVE_PERSONS,
    personsList
  };
}
export function receivePersonsFailure(error) {
  return {
    type: ActionTypes.RECEIVE_PERSONS_FAILURE,
    error
  };
}
export function fetchPersons() {
  const sparqlEndpoint = "https://sparql-staging.scta.info/ds/query"
  const query = [
    "SELECT DISTINCT ?person ?personTitle ?personShortId ",
    "WHERE { ",
    "?author a <http://scta.info/resource/person> .",
    "?resource a <http://scta.info/resource/expression> .",
    "?resource <http://scta.info/property/level> '1' .",
    "?resource <http://www.loc.gov/loc.terms/relators/AUT> ?person .",
    "?person <http://scta.info/property/shortId> ?personShortId .",
    "?person <http://purl.org/dc/elements/1.1/title> ?personTitle .",
    "}",
    "ORDER BY ?personTitle"].join('');
  return ((dispatch) => {
    dispatch(requestPersons());
    Axios.get(sparqlEndpoint, { params: { "query": query, "output": "json" } }).then(function (res) {
      dispatch(receivePersons(res.data.results.bindings))
    })
      .catch(error => dispatch(receivePersonsFailure(error))
      );
  });
}

// fetch witnesses

export function requestWitnesses() {
  return {
    type: ActionTypes.REQUEST_WITNESSES,
  };
}
export function receiveWitnesses(witnessesList) {
  return {
    type: ActionTypes.RECEIVE_WITNESSES,
    witnessesList
  };
}
export function receiveWitnessesFailure(error) {
  return {
    type: ActionTypes.RECEIVE_WITNESSES_FAILURE,
    error
  };
}
export function fetchWitnesses() {
  const sparqlEndpoint = "https://sparql-staging.scta.info/ds/query"
  const query = [
    "SELECT DISTINCT ?witness ?witnessTitle ?witnessShortId ",
    "WHERE { ",
    "?witness a <http://scta.info/resource/codex> .",
    // "?witness <http://scta.info/property/shortId> ?witnessShortId .",
    "?witness <http://purl.org/dc/elements/1.1/title> ?witnessTitle .",
    "}",
    "ORDER BY ?witnessTitle"].join('');
  return ((dispatch) => {
    dispatch(requestWitnesses());
    Axios.get(sparqlEndpoint, { params: { "query": query, "output": "json" } }).then(function (res) {
      dispatch(receiveWitnesses(res.data.results.bindings))
    })
      .catch(error => dispatch(receiveWitnessesFailure(error))
      );
  });
}

// EDF actions
export function requestEdfList() {
  return {
    type: ActionTypes.REQUEST_EDFS,
  };
}
export function receiveEdfList(edfList) {
  return {
    type: ActionTypes.RECEIVE_EDFS,
    edfList
  };
}
export function receiveEdfListFailure(error) {
  return {
    type: ActionTypes.RECEIVE_EDFS_FAILURE,
    error
  };
}
export function fetchEdfList() {
  const sparqlEndpoint = "https://sparql-staging.scta.info/ds/query"
  const query = [
    "SELECT DISTINCT ?expression ?expressionTitle ?authorTitle ?expressionShortId ",
    "WHERE { ",
    "?expression a <http://scta.info/resource/expression> .",
    "?expression <http://scta.info/property/level> '1' .",
    "?expression <http://scta.info/property/shortId> ?expressionShortId .",
    "?expression <http://www.loc.gov/loc.terms/relators/AUT> ?author .",
    "?author <http://purl.org/dc/elements/1.1/title> ?authorTitle .",
    "?expression <http://purl.org/dc/elements/1.1/title> ?expressionTitle .",
    "}",
    "ORDER BY ?expressionTitle"].join('');
  return ((dispatch) => {
    dispatch(requestEdfList());
    Axios.get(sparqlEndpoint, { params: { "query": query, "output": "json" } }).then(function (res) {
      dispatch(receiveEdfList(res.data.results.bindings))
    })
      .catch(error => dispatch(receiveEdfListFailure(error))
      );
  });
}

/// EDF Item Fetch Sequence

// EDF actions
export function requestEdfItems(expressionShortId) {
  return {
    type: ActionTypes.REQUEST_EDF_ITEMS,
  };
}
export function receiveEdfItems(expressionShortId, edfItems) {
  return {
    type: ActionTypes.RECEIVE_EDF_ITEMS,
    expressionShortId,
    edfItems
  };
}
export function receiveEdfItemsFailure(expressionShortId, error) {
  return {
    type: ActionTypes.RECEIVE_EDFS_ITEMS_FAILURE,
    expressionShortId,
    error
  };
}
export function fetchEdfItems(expressionShortId) {
  const sparqlEndpoint = "https://sparql-staging.scta.info/ds/query"
  const query = [
    "SELECT DISTINCT ?item ?itemTitle ?questionTitle ",
    "WHERE { ",
    "<http://scta.info/resource/" + expressionShortId + "> a <http://scta.info/resource/expression> .",
    "?item <http://scta.info/property/isPartOfTopLevelExpression> <http://scta.info/resource/" + expressionShortId + "> .",
    "?item <http://purl.org/dc/elements/1.1/title> ?itemTitle .",
    "OPTIONAL",
    "{",
    "?item <http://scta.info/property/questionTitle> ?questionTitle .",
    "}",
    "?item <http://scta.info/property/totalOrderNumber> ?order .",
    "}",
    "ORDER BY ?order"].join('');
  return ((dispatch) => {
    dispatch(requestEdfItems(expressionShortId));
    Axios.get(sparqlEndpoint, { params: { "query": query, "output": "json" } }).then(function (res) {
      console.log("response", res)
      dispatch(receiveEdfItems(expressionShortId, res.data.results.bindings))
    })
      .catch(error => dispatch(receiveEdfItemsFailure(expressionShortId, error))
      );
  });
}


export function changeDataCreationView(dataCreationView) {
  if (!dataCreationView) {
    dataCreationView = "edfCreation"
  }

  return {
    type: ActionTypes.CHANGE_DATA_CREATION_VIEW,
    dataCreationView
  }
}


export function createAndAttachWitness(title, description) {
  const id = "cod-" + makeid();
  return ((dispatch) => {
    dispatch(createWitness(id, title, description))
    dispatch(attachWitness(id, title, description))
  });
}

export function createWitness(id, title, description) {

  return {
    type: ActionTypes.CREATE_WITNESS,
    title,
    description,
    id
  }
}

export function attachWitness(id, title, description) {
  // Assigns witness to an EDF
  return {
    type: ActionTypes.ATTACH_WITNESS,
    title,
    description,
    id
  }
}

export function updateWitness(id, title, description) {
  return {
    type: ActionTypes.UPDATE_WITNESS,
    title,
    description,
    id
  }
}

export function changeFocusedWitness(id) {
  return {
    type: ActionTypes.CHANGE_FOCUSED_WITNESS,
    id: id
  }
}


export function createAndAssignEdf(info) {
  const id = makeid();
  info.id = id;
  return ((dispatch) => {
    dispatch(createEdf(info))
    dispatch(assignEdf(info))
  });
}
export function assignEdf(info) {
  return {
    type: ActionTypes.ASSIGN_EDF,
    id: info.id,
    title: info.title,
    authorTitle: info.authorTitle,
    description: info.description
  }
}
export function createEdf(info) {
  return {
    type: ActionTypes.CREATE_EDF,
    id: info.id,
    title: info.title,
    authorTitle: info.authorTitle,
    description: info.description
  }
}
export function updateEdf(info) {
  return {
    type: ActionTypes.UPDATE_EDF,
    id: info.id,
    title: info.title,
    authorTitle: info.authorTitle,
    description: info.description
  }
}
export function clearEdfInfo(info) {
  return {
    type: ActionTypes.CLEAR_EDF_INFO,
  }
}

// person actions

export function createAndAssignPerson(info) {
  const id = "P" + makeid();
  info.id = id;
  return ((dispatch) => {
    dispatch(createPerson(info))
    dispatch(assignPerson(info))
  });
}
export function assignPerson(info) {
  return {
    type: ActionTypes.ASSIGN_PERSON,
    id: info.id,
    title: info.title,
    description: info.description
  }
}
export function createPerson(info) {
  return {
    type: ActionTypes.CREATE_PERSON,
    id: info.id,
    title: info.title,
    description: info.description
  }
}
export function updatePerson(info) {
  return {
    type: ActionTypes.UPDATE_PERSON,
    id: info.id,
    title: info.title,
    description: info.description
  }
}
export function clearPersonInfo() {
  return {
    type: ActionTypes.CLEAR_PERSON_INFO,
  }
}

// TODO: need to break this up into, create, update, assign
// export function assignPerson(title, description) {
//   return {
//     type: ActionTypes.ASSIGN_PERSON,
//     title,
//     description
//   }
// }
