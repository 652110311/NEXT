import Dexie, { Table } from 'dexie';

// table inteface
export interface Student {
  id?: number;
  name: string;
  rollNumber: number;
  status:string
}

export class DB extends Dexie {
// table name is student 
  students!: Table<Student>; 
  constructor() {
    super('Database');
    this.version(2).stores({
      students: '++id, name, rollNumber, status'  
    });
  }
}

export const db = new DB(); // export the db