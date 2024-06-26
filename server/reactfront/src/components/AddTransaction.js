import React, {useState, useContext} from 'react'
import { GlobalContext } from '../context/GlobalState';
import axios from "axios";

export const AddTransaction = ({groupId, currentUser, members}) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      Description: text,
      Amount: +amount,
      Receiver: members,
      Type: 'EQUAL'
    };

    try {
      const res = await axios.post(`/api/transactions/${groupId}`, newTransaction);

    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }

  return (
    <>
      <h3>Add new transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." />
        </div>
        <div className="form-control">
          <label htmlFor="amount"
            >Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount..." />
        </div>
        <button className="btn">Add transaction</button>
      </form>
    </>
  )
}