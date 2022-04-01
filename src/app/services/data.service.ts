import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore, query, where } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Note {
  id?: string;
  createdAt: Date;
  title: string;
  type: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore : Firestore,
   
  ) { }

  getNotes(): Observable<Note[]> {
    const notesRef = collection(this.firestore, 'Employee');
    return collectionData(notesRef, {idField: 'id'}) as Observable<Note[]>;
  }

  getNoteTypeAnnouncement() : Observable<Note[]> {
    const notesRef = query(collection(this.firestore,'Employee'), where("type", "==", "news"));
    return collectionData(notesRef, {idField: 'id'}) as Observable<Note[]>;
    // const citiesRef = collection(this.firestore, "Employee")
    // const q = query(citiesRef, where("type", "array-contains-any", ["news"]))
    // return collectionData(q, {idField: 'id'}) as Observable<Note[]>;
  }

  getNoteById(id): Observable<Note> {
    const noteDocRef = doc(this.firestore, `Employee/${id}`);
    return docData(noteDocRef, {idField: 'id'}) as Observable<Note>;
  }

  addNote(note : Note) {
    const notesRef= collection(this.firestore, 'Employee');
    return addDoc(notesRef, note);
  }

  deleteNote(note: Note) {
    const noteDocRef = doc(this.firestore, `Employee/${note.id}`);
    return deleteDoc(noteDocRef);
  }

  updateNote(note: Note) {
    const noteDocRef = doc(this.firestore, `Employee/${note.id}`);
    return updateDoc(noteDocRef, {title: note.title, text: note.text});
  }



}
