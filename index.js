const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json())
require('dotenv').config();


const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true}));
const PORT = 4000;
const MONGO_URI="mongodb+srv://deetshithasri:Deetshitha@cluster0.s9demqn.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=Cluster0"

const expenseSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    }

})
const Expense = mongoose.model('Expense',expenseSchema);
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("Connected to mongodb")     
})
.catch((err)=>{
    console.log('mongoDb connection error :',err)
})

app.post('/Expense' ,async(req ,res)=>{
    try {
        const {title , amount} = req.body;
        const expense = new Expense({title , amount})
        await expense.save();
        res.status(201).json(expense)


     } catch (error) {
        console.error('Error saving expense',error)
        res.status(500).json({error: "failed to save"})

         }

})
app.get('/Expense',async(req,res)=>{
    try{
        const expenses=await Expense.find();
        res.json(expenses)
    }catch(error){
        console.error('Error getting expense',error)
        res.status(404).json({error:"Failed to save"})
    }
})
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)

})

app.delete('/expense/:userID' , async(req,res)=>{
    try{
    const {userID}=req.params;
    const deleteExpense = await Expense.findByIdAndDelete(userID)
    if(!deleteExpense){
        return res.statusCode(404).json({error : "not found"});
    }
     res.status(201).json({message:"expense deleted", deleteExpense})
        
    }
    catch(error){  
    res.status(500).json({error:'failed to delete '})
}

})




