"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs"
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import ExpenseListTable from './_components/ExpenseListTable';


function Expense() {
  const{user}=useUser();

  const[budgetList,setBudgetList]=useState([]);

  const [expensesList,setExpensesList]=useState([]);
  
  useEffect(()=>{
    user&&getBudgetList();
  },[user])

  /**used to get budget list */

  const getBudgetList=async()=>{

    const result=await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql `sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql `count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
    .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  }

  const getAllExpenses=async()=>{
    const result=await db.select({
      id:Expenses.id,
      name:Expenses.name,
      amount:Expenses.amount,
      createdAt:Expenses.createdAt
    }).from(Budgets)
    .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(Expenses.id));
    setExpensesList(result);
  }

  return (
   <div className='p-2'>
      
      <div className='grid grid-cols-1 lg:grid-cols-3 mt-4 gap-5'>
        <div className='lg:col-span-2'>
            <ExpenseListTable
            expensesList={expensesList}
            refreshData={()=>getBudgetList()}
            />
        </div>
      </div>
      
   </div>
  )
}

export default Expense

