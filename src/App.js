import React, {useState, useEffect} from 'react';
import {TextField, Button} from '@mui/material';
import Task from './Task';
import './App.css';

import { TaskContractAddress } from './config';
import {ethers} from 'ethers';
const {abi} = require("./abi/TaskContract.json");

/*const abi = [
  "function addTask(string taskText, bool isDeleted)",
  "function deleteTask(uint taskId, bool isDeleted)",
  "function getMyTasks() view returns (Task[] )"
]*/


function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async ()=>{
    try {
      const {ethereum} = window;
      if (!ethereum){
        console.log("Metamask not detected");
      } 

      let chainId = await ethereum.request({method:'eth_chainId'});
      console.log("Connected to chain:"+chainId);

      const goerliChainId = "0x5";

      if (chainId != goerliChainId) {
        alert("You are not connected to Goerli network");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({method:'eth_requestAccounts'});
      console.log("Found account:", accounts[0]);
      setCurrentAccount(accounts[0]);


    } catch(error) {
      console.log("Error connecting to metamask", error);
    }
  }

  const addTask = async(e)=>{
    let task = {
    'taskText':input,
    'isDeleted':false
    };
    try {

      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress, abi, signer);
        TaskContract.addTask(task.taskText, task.isDeleted).then(response =>{
          setTasks([...tasks, task]);
        }).catch(err=>{
          console.log("Ethereum ocurred while adding a new task");

        });
      }else{
        console.log("Ethereum object doesnot exist");
      }
    } catch(error) {
      console.log("Error submitting the task");
    }
    setInput("");
  }

  const deleteTask = key => async()=>{
    try {
      const {ethereum} = window;
      if (ethereum){
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress, abi, signer);

        let deleteTaskTx = await TaskContract.deleteTask(key, true);
        let allTask = await TaskContract.getMyTasks();
        setTasks(allTask);

      } else {
        console.log("Ethereum object not exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  const getAllTask = async()=>{
    try {
      const {ethereum} = window;
      if (ethereum){
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress, abi, signer);

        let allTask = await TaskContract.getMyTasks();
        //window.todasTareas = allTask;
        console.log("Listado de tareas: ", allTask);
        setTasks(allTask);
      } else {
        console.log("Ethereum object not exist");
      }

    } catch(error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllTask();
    connectWallet();
  },[]);

  return (
    <div>
      {currentAccount == '' ? (
        <center><button className='button' onClick={connectWallet}>Connect Wallet</button></center>
      ): correctNetwork ? (
        <div className='App'>
          <h2>Task Management App</h2>
          <form>
            <TextField id="outlined-basic" label='Make Todo' variant="outlined" 
                style={{margin:'0px 5px'}} 
                size="small" 
                value={input} 
                onChange={e=>setInput(e.target.value)}>
            </TextField>
            <Button variant="contained" color="primary" onClick={addTask}>Add Task</Button>
          </form>
          <ul>
            {tasks.map(item=>
               <Task key={item.id} taskText={item.taskText} onClick={deleteTask(item.id)}></Task>
              )}
          </ul>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
          <div>Please connect to Goerli Testnet and reload the screen</div>
        </div>
      )}
    </div>
  );

}

export default App;
