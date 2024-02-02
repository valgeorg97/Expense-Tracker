const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const amount = document.getElementById('amount');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const reset = document.getElementById('reset-btn')


const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') != null ? localStorageTransactions: [];

//Add transaction

const addTransaction = (e) =>{
  e.preventDefault();
  if(text.value.trim() === '' || amount.value.trim() === ''){
    alert('Amount or text not added.')
  } else{
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    }
      transactions.push(transaction);  
      addTransactionDOM(transaction);
      updateValues();
      updateLocalStorage();
      text.value = '';
      amount.value = '';
}
}

//Generate ID
const generateID = () =>{
  return Math.floor(Math.random() * 1000000);;
}

//Add transaction to DOM list

const addTransactionDOM = (transaction) => {
  //Get sign
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  //Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(transaction.amount)} 
  </span> <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item)
}

//Update the balance, income and expense

const updateValues = () => {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((amount, sum) => {
    sum += amount
    return sum;
  }, 0).toFixed(2);

  let income = amounts
    .filter(item => item > 0)
    .reduce((num, totalIncome) => {
      totalIncome += num;
      return totalIncome;
    }, 0)
    .toFixed(2);

  const expense = (amounts
  .filter(item => item < 0)
  .reduce((num,totalExpense) =>{
    totalExpense += num;
    return totalExpense;
  },0) * -1)
  .toFixed(2);

  balance.innerText = `$${total}`;
  money_minus.innerText = `$${expense}`;
  money_plus.innerText = `$${income}`;
}

//deleteTransaction
const deleteTransaction = (id) =>{
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

//Update local storage transaction 

const updateLocalStorage = () =>{
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

//Reset tracker

const resetTracker = () => {
  transactions = []; 
  updateLocalStorage(); 
  list.innerHTML = ''; 
  updateValues(); 
}

//init app
let init = () => {
  list.innerHTML = ''

  transactions.forEach(addTransactionDOM);
  updateValues();
}
init();

form.addEventListener('submit', addTransaction);
reset.addEventListener('click', resetTracker);