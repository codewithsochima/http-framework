const framework = require("./framework");
const app = framework();

app.use(framework.json());

app.get("/items", (req, res) => {
  res.end("Here are the items");
});
app.post("/items", (req, res) => {
  res.end("Item created");
});
app.put("/items", (req, res) => {
  res.end("Item updated");
});
app.delete("/items", (req, res) => {
  res.end("Item deleted");
});

app.listen(3000);

