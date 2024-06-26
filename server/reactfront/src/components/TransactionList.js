
import React, { useContext } from 'react';
import { Transaction } from './Transaction';

import { GlobalContext } from '../context/GlobalState';

export const TransactionList = () => {
  const { transactions } = useContext(GlobalContext);

  return (
      <>
          <h3>Transactions</h3>
          <ul className="list">
              {transactions.map((transaction, index) => (
                  <li key={index} className="transaction-item">
                      {transaction.Description} - ${transaction.Amount}
                  </li>
              ))}
          </ul>
      </>
  );
};