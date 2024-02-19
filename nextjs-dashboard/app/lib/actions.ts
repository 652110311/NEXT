'use server';
import { z } from 'zod'; //a TypeScript-first validation library
import { sql } from '@vercel/postgres'; // allow use SQL query
import { revalidatePath } from 'next/cache'; //clear cache and trigger a new request when has updating data
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
  });

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formdata: FormData) {
    const { customerId, amount,  status } = CreateInvoice.parse({
        customerId: formdata.get('customerId'),
        amount: formdata.get('amount'),
        status: formdata.get('status')
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]; //format "YYYY-MM-DD"

    await sql `
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('dashboard/invoices');// path will be revalidated, and fresh data will be fetched from the server.
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) { //Extracting the data from formData.
    const { customerId, amount, status } = UpdateInvoice.parse({ //Validating the types with Zod.
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100; //Converting the amount to cents.
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `; //Passing the variables to your SQL query.
   
    revalidatePath('/dashboard/invoices'); //  clear the client cache and make a new server request.
    redirect('/dashboard/invoices'); // to redirect the user to the invoice's page.
  }

  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }