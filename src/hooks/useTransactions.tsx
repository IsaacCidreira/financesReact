import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface Transaction{
  id: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt' >

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transactions: TransactionInput) => Promise<void>;
}

interface TransactionProviderProps{
  children: ReactNode;
}
const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionProvider({children}: TransactionProviderProps){
  const [transactions, setTransactions] = useState<Transaction[]>([])
  useEffect(()=>{
    api.get('transactions').then(response => setTransactions(response.data.transactions))
  },[])

  async function createTransaction(transactionInput: TransactionInput){

   const response =  await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date()
   })
   const {transaction} = response.data

      setTransactions([
        ...transactions,
        transaction
      ])
  }
  return(
    <TransactionsContext.Provider value={{transactions , createTransaction}}>
        {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions(){
  const context = useContext(TransactionsContext)
  return context
}