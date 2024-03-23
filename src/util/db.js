import { useReducer, useEffect, useRef } from "react";
import firebase from "./firebase";

const firestore = firebase.firestore();
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export function useUser(uid) {
  return useQuery(uid && firestore.collection("users").doc(uid));
}

export function updateUser(uid, data) {
  return firestore.collection("users").doc(uid).update(data);
}

export function createUser(uid, data) {
  return firestore
    .collection("users")
    .doc(uid)
    .set({ uid, ...data, role: "employee" }, { merge: true });
}

export function useItem(id) {
  return useQuery(id && firestore.collection("items").doc(id));
}

export function updateItem(id, data) {
  return firestore.collection("items").doc(id).update(data);
}

export function createItem(data) {
  return firestore.collection("items").add({
    ...data,
    createdAt: serverTimestamp(),
  });
}

export function deleteItem(id) {
  return firestore.collection("items").doc(id).delete();
}

//*** EMPLOYEE DASHBOARD ***/
export function useInfoByOwner(owner) {
  return useQuery(
    owner && firestore.collection("info").where("owner", "==", owner)
  );
}

// Fetch Info data
export function useInfo(id) {
  return useQuery(id && firestore.collection("info").doc(id));
}

// Update an Info
export function updateInfo(id, data) {
  return firestore.collection("info").doc(id).update(data);
}

// Create a new Info
export function createInfo(data) {
  return firestore.collection("info").add(data);
}

// Delete an Info
export function deleteInfo(id) {
  return firestore.collection("info").doc(id).delete();
}

/**** LEAVE APPLICATION ****/
export function useLeaveApplicationsByOwner(owner) {
  return useQuery(
    firestore.collection("global-leaveApplications").where("owner", "==", owner)
  );
}

export function useLeaveApplications(id) {
  return useQuery(
    id && firestore.collection("global-leaveApplications").doc(id)
  );
}

export function updateLeaveApplication(id, data) {
  return firestore.collection("global-leaveApplications").doc(id).update(data);
}

export function createLeaveApplication(data) {
  data.status = "Pending";
  return firestore.collection("global-leaveApplications").add(data);
}

export function deleteLeaveApplication(id) {
  return firestore.collection("global-leaveApplications").doc(id).delete();
}

//*** HR DASHBOARD ***/
/**** USERS ****/
/* Example query functions (modify to your needs) */

// Fetch all Users by owner (hook)
export function useUsersByOwner(owner) {
  return useQuery(firestore.collection("info"));
}

// Fetch Users data
export function useUsers(id) {
  return useQuery(id && firestore.collection("info").doc(id));
}

// Update an Users
export function updateUsers(id, data) {
  return firestore.collection("info").doc(id).update(data);
}

// Create a new Users
export function createUsers(data) {
  return firestore.collection("info").add(data);
}

// Delete an Users
export function deleteUsers(id) {
  return firestore.collection("info").doc(id).delete();
}

/**** SALARies ****/
/* Example query functions (modify to your needs) */

// Fetch all Salaries by owner (hook)
export function useSalariesByOwner(owner) {
  return useQuery(
    owner && firestore.collection("salaries").where("owner", "==", owner)
  );
}

// Fetch Salaries data
export function useSalaries(id) {
  return useQuery(id && firestore.collection("salaries").doc(id));
}

// Update an Salaries
export function updateSalaries(id, data) {
  return firestore.collection("salaries").doc(id).update(data);
}

// Create a new Salaries
export function createSalaries(data) {
  return firestore.collection("salaries").add(data);
}

// Delete an Salaries
export function deleteSalaries(id) {
  return firestore.collection("salaries").doc(id).delete();
}

/**** LEAVE APPLICATIONS ****/
/* Example query functions (modify to your needs) */

// Fetch all LeaveApplications by owner (hook)
export function useAllLeaveApplicationsByOwner(owner) {
  return useQuery(firestore.collection("global-leaveApplications"));
}

// Fetch AllLeaveApplications data
export function useAllLeaveApplications(id) {
  return useQuery(
    id && firestore.collection("global-leaveApplications").doc(id)
  );
}

// Update an AllLeaveApplications
export function updateAllLeaveApplications(id, data, decision) {
  data.status = decision;
  return firestore.collection("global-leaveApplications").doc(id).update(data);
}

// Create a new AllLeaveApplications
export function createAllLeaveApplications(data) {
  return firestore.collection("global-leaveApplications").add(data);
}

// Delete an AllLeaveApplications
export function deleteAllLeaveApplications(id) {
  return firestore.collection("global-leaveApplications").doc(id).delete();
}

/**** HELPERS ****/

// Reducer for useQuery hook state and actions
const reducer = (state, action) => {
  switch (action.type) {
    case "idle":
      return { status: "idle", data: undefined, error: undefined };
    case "loading":
      return { status: "loading", data: undefined, error: undefined };
    case "success":
      return { status: "success", data: action.payload, error: undefined };
    case "error":
      return { status: "error", data: undefined, error: action.payload };
    default:
      throw new Error("invalid action");
  }
};

function useQuery(query) {
  const initialState = {
    status: query ? "loading" : "idle",
    data: undefined,
    error: undefined,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const queryCached = useMemoCompare(query, (prevQuery) => {
    return prevQuery && query && query.isEqual(prevQuery);
  });

  useEffect(() => {
    if (!queryCached) {
      dispatch({ type: "idle" });
      return;
    }

    dispatch({ type: "loading" });
    return queryCached.onSnapshot(
      (response) => {
        const data = response.docs
          ? getCollectionData(response)
          : getDocData(response);

        dispatch({ type: "success", payload: data });
      },
      (error) => {
        dispatch({ type: "error", payload: error });
      }
    );
  }, [queryCached]);

  return state;
}

// Get doc data and merge doc.id
function getDocData(doc) {
  return doc.exists === true ? { id: doc.id, ...doc.data() } : null;
}

// Get array of doc data from collection
function getCollectionData(collection) {
  return collection.docs.map(getDocData);
}

// Used by useQuery to store Firestore query object reference
function useMemoCompare(next, compare) {
  // Ref for storing previous value
  const previousRef = useRef();
  const previous = previousRef.current;

  // Pass previous and next value to compare function
  // to determine whether to consider them equal.
  const isEqual = compare(previous, next);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = next;
    }
  });

  return isEqual ? previous : next;
}
