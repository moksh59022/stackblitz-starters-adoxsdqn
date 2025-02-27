require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MenuItem = require('./models/menuItem');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    const newItem = new MenuItem({ name, description, price });
    await newItem.save();

    res.status(201).json({ message: "Menu item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/menu/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id, 
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully", item: deletedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));