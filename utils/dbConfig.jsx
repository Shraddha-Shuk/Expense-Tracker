import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

const sql = neon('postgresql://expenses-tracker_owner:5kN4BqEjDzZX@ep-cold-scene-a597l5xt.us-east-2.aws.neon.tech/Expense-tracker?sslmode=require');
export const db = drizzle(sql,{schema});