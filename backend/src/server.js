import express from 'express';
const app = express();

const PORT = process.env.PORT || 3001;

app.get("/", (req, res)=>{
  res.send({ hey: "ho", lets: "go!" });
});

app.listen(3001, ()=>{console.log("app running on port 3001")});