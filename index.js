const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json());

mongoose.connect('mongodb+srv://abdulbasith12382:muthaseerB!1@cluster0.coujdgq.mongodb.net/galleries')

const UserSchema = new mongoose.Schema({
    name: String,
    size: Number,
    id: Number,
    color: String,
})  

const FashionData = mongoose.model("dresses", UserSchema);



app.get('/', (req, res) => {
    return res.json({ status:200, message: "Server running at " + process.env.PORT })
})

app.get("/dresses", (req, res) => {
  FashionData.find({}).then(function(dresses) {
        res.json(dresses);
    }).catch(function(err) {
        console.log(err);
    })
})



app.post("/dresses", async (req,res) => {
    console.log("Inside Post Function");

    const dresses = new FashionData({
        name:req.body.name,
        size:req.body.size,
        id:req.body.id,
        color:req.body.color
    });

    await dresses.save();
    res.send("posted");
})


app.put("/updateDresses/:id", async (req, res) => {
    
    const updateId = req.params.id;
    const updateName = req.body.name;
    const updateSize = req.body.size;
    const updateColor = req.body.color;

    try {
        const updateDresses = await FashionData.findOneAndUpdate(
            { id: updateId },
            { $set: { name: updateName, size: updateSize, color: updateColor } },
            { new: true }
        );

        if (updateDresses) {
            res.json(updateDresses);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});




app.delete("/deleteDresses/:id", async (req, res) => {
    const deleteId = req.params.id;

    try {
        const deleteDresses = await FashionData.findOneAndDelete({ id: deleteId });

        if (deleteDresses) {
            res.json(deleteDresses);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});



app.listen(3000, () => {
    console.log("server runs on 3000")
})