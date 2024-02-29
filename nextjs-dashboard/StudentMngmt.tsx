'use client';
import React, { FC, useEffect, useState } from "react";
import { db } from "@/db/db.model";
import { useLiveQuery } from "dexie-react-hooks";
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import OfflineDetector from "./app/ui/offline";
// import { fetchStudents } from "./app/lib/data";
import { createStudents } from "./app/lib/actions";

const StudentMngmt: FC = () => {
  const [students, setStudents] = React.useState({ name: '', rollNumber: '', id: null, status:'' });
  // dexie hook to get live data 
  const studentList = useLiveQuery(() => db.students.toArray());
  // const studentList2 = fetchStudents();
  useEffect(() => {
    if(navigator.onLine){
      console.log('1',studentList);
      // console.log('2',studentList2);
      const filterOffline = studentList?.filter((item)=> item.status == 'offline')
      console.log(filterOffline);
      filterOffline?.forEach(elm => createStudents(elm.name,elm.rollNumber,'online'))
    }
  })

  // add student 
  const addStudent = React.useCallback(async () => {
    if (students?.name && students?.rollNumber) {
      await db.students.add({
        name: students?.name,
        rollNumber: Number(students?.rollNumber),
        status:navigator.onLine?'online':'offline'
      });
      setStudents({ name: '', rollNumber: '', id: null, status:'' });
    }

  }, [students])

  // update student 
  const updateStudent = React.useCallback(async () => {
    if (students?.id && students?.name && students?.rollNumber) {
      await db.students.put({
        id: students?.id,
        name: students?.name,
        rollNumber: Number(students?.rollNumber),
        status:navigator.onLine?'online':'offline'
      });
      setStudents({ name: '', rollNumber: '', id: null,status:'' });
    }
  }, [students])

  // delete student 
  const deleteStudent = React.useCallback(async (id: any) => {
    await db.students.delete(id);
  }, [])

  // Student list Component
  const StudentList = () => {
    return (
      <>
      <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-white-50 p-2 md:pt-0">
        <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
            {
            studentList?.map((i: any, index: number) => {
              return (
                <tr key={index}  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                  <td className="whitespace-nowrap px-3 py-3" ><span>{i.id}</span></td>
                  <td className="whitespace-nowrap px-3 py-3" ><span>{i.name}</span></td>
                  <td className="whitespace-nowrap px-3 py-3" > <span>{i.rollNumber}</span></td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex justify-end gap-3">
                      <button onClick={addStudent}  onClickCapture={() => deleteStudent(i.id)}><TrashIcon className="w-5"/></button>
                      <button onClick={() => setStudents({ ...i })} ><PencilIcon className="w-5"/></button>
                  </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3" > <span>{i.status}</span></td>
                </tr>
              )
            })
          }
            </tbody>
          </table>
        </div>
      </div>
      </div>
      </>
      )
      
  }

  // Add and Update Form Component 
  return (
    <>
    <div className="rounded-md bg-gray-50 p-4 md:p-6" aria-describedby="field-error">
      <div className="mb-4">
        <h2>{students?.id ? 'Update' : 'Add'} Student </h2>
        <div>

          <label htmlFor="Name"  className="mb-2 block text-sm font-medium" >Name</label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input 
              type="text" 
              value={students?.name} 
              onChange={(e) => setStudents({ ...students, name: e.target.value })} 
              placeholder="Name" 
              name="Name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
            </div>
          </div>

          <label htmlFor="roll" className="mb-2 block text-sm font-medium" >Roll Number </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input 
              type="number" 
              value={students?.rollNumber} 
              onChange={(e) => setStudents({ ...students, rollNumber: e.target.value })} 
              placeholder="Roll Number" 
              name="rollNumber"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" 
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
          {
            students?.id ? (
              <Button onClick={updateStudent} >SUBMIT</Button>
            ) : (
              <Button onClick={addStudent} >ADD</Button>
            )
          }
          </div>
        </div>
          <StudentList />
      </div>
    </div>
    </>
  );
}
export default StudentMngmt