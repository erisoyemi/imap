import "./App.css";
import { Button, Form } from "antd";
import Editor from "./components/Editor";
import Upload from "./components/Uploader";

function App() {
  // const onSubmit = (event) => {
  //   event.preventDefault();

  //   setContent("");
  // };

  return (
    <>
      <div className="App">
        <Editor />
        <Upload />
      </div>
      <Form>
        <div style={{ textAlign: "center", margin: "2rem" }}>
          <Button size="large" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
}

export default App;
