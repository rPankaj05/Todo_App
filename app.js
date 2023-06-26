const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


const port = process.env.PORT || 3000;


const static_path = path.join(__dirname, "./public");

// Set up middleware and template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(static_path));


// Connect to MongoDB Atlas
mongoose
  .connect('mongodb+srv://rPankaj05:Pankaj12345@cluster1.h5hfurj.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


// Set up the task schema and model
const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);


// Define routes
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('index', { tasks });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.sendStatus(500);
  }
});

app.post('/add', async (req, res) => {
  const { description } = req.body;
  const newTask = new Task({ description, completed: false });
  try {
    await newTask.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error adding task:', error);
    res.sendStatus(500);
  }
});


app.post('/delete', async (req, res) => {
    const { taskId } = req.body;
    try {
      await Task.findByIdAndDelete(taskId);
      res.redirect('/');
    } catch (error) {
      console.error('Error deleting task:', error);
      res.sendStatus(500);
    }
  });
  

app.post('/status', async (req, res) => {
  const { taskId, completed } = req.body;
  try {
    await Task.findByIdAndUpdate(taskId, { completed: completed==='on'});
    res.redirect('/');
  } catch (error) {
    console.error('Error updating task status:', error);
    res.sendStatus(500);
  }
});

// Start the server
app.listen(port,()=>{
    console.log(`This is the Link http://localhost:${port}`)
});
