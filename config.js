/**
 * This module exports functions to interact with Firestore.
 * - createQuery: creates a Firestore query based on a category.
 * - addBookmark: adds a new bookmark to Firestore.
 * - filterBookmarks: filters bookmarks based on a query and calls a callback function.
 * - getRealtimeUpdates: subscribes to real-time updates on Firestore.
 * - deleteBookmark: deletes a bookmark from Firestore.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  addDoc,
  collection,
  onSnapshot,
  getFirestore,
  serverTimestamp,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZcluonB5HOYCHEE_JosV29FbzoKOoG0M",
  authDomain: "keeper-2bcf2.firebaseapp.com",
  projectId: "keeper-2bcf2",
  storageBucket: "keeper-2bcf2.appspot.com",
  messagingSenderId: "801077996221",
  appId: "1:801077996221:web:92f33fe5a16522fc1d25d4",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const collectionRef = collection(db, "bookmarks");

export const createQuery = (category) =>
  query(
    collectionRef,
    category && where("category", "==", category),
    orderBy("createdAt", "desc")
  );

// Add bookmark

/**
 * Adds a new bookmark to Firestore.
 * @param {Object} bookmark - The bookmark to add.
 * @param {string} bookmark.title - The bookmark's title.
 * @param {string} bookmark.link - The bookmark's link.
 * @param {string} bookmark.category - The bookmark's category.
 */
export const addBookmark = async ({ title, link, category }) => {
  try {
    await addDoc(collectionRef, {
      title,
      link,
      category,
      createdAt: serverTimestamp(),
    });
    console.log("Document added");
  } catch (error) {
    console.log(error);
  }
};

// Filter bookmarks

/**
 * Filters bookmarks based on a query and calls a callback function.
 * @param {Object} ref - The Firestore query.
 * @param {Function} cb - The callback function to call with the filtered bookmarks.
 */
export const filterBookmarks = async (ref, cb) => {
  try {
    const response = await getDocs(ref);

    const documents = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    cb(documents);
  } catch (error) {
    console.log(error);
  }
};

// Get realtime updates

/**
 * Subscribes to real-time updates on Firestore.
 * @param {Function} cb - The callback function to call with the updated bookmarks.
 * @param {Object} colQuery - The Firestore query to subscribe to.
 */
export const getRealtimeUpdates = (cb, colQuery) => {
  try {
    onSnapshot(colQuery, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      cb(documents);

      // console.log(documents);
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete bookmark

/**
 * Deletes a bookmark from Firestore.
 * @param {string} id - The ID of the bookmark to delete.
 */
export const deleteBookmark = async (id) => {
  try {
    await deleteDoc(doc(db, "bookmarks", id));
    console.log("Document deleted");
  } catch (error) {
    console.log(error);
  }
};
