import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const db=new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "rajeev@07",
  port: 5432,
});
db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
async function addItems(){
  let items=[];
  const result=await db.query("SELECT * FROM items");
  result.rows.forEach(element => {
    items.push(element);
  });
  return items;
}
/*let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];*/

app.get("/", async(req, res) => {
  const items=await addItems();
  try{
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (title) VALUES($1)",[item]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const updatedItem=req.body.updatedItemTitle;
  try{
    await db.query("UPDATE items SET title=$1 WHERE id=$2",[updatedItem,req.body.updatedItemId]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  const deletedItem=req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id=$1",[req.body.deleteItemId]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
