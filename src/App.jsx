import React, { useEffect, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";

const App = () => {
  const api = "https://68219e67259dad2655afd652.mockapi.io/finProject";
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [name, setName] = useState("");
  const [image, setimage] = useState("");
  const [info, setinfo] = useState("");
  const [status, setstatus] = useState("");
  
  const addUser = () => {
    setAddModal(true)
  }

  const addClose = () => {
    setAddModal(false);
  }

  const addUsers = async () => {  
    try {
      await axios.post(api, {
        courseName: name,
        image: image,
        aboutCourse: info,
        status: status === "true" ? true : status === "false" ? false : status, // Приводим статус к логическому
      });
      get();
      setAddModal(false);
    } catch (error) {
      console.error(error);
    }
  
    setName("");
    setimage("");
    setinfo("");
    setstatus("all");
  };


  useEffect(() => {
    get();
  }, []);

  //   get
  const get = async () => {
    try {
      const { data } = await axios.get(api);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  //   Filt & Search
  const filteredData = data.filter((element) => {
    return (
      (search === "" ||
        element.courseName?.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === "" || element.status.toString() === filterStatus)
    );
  });



  async function heandleRemove(id) {
    try {
      await axios.delete(`${api}/${id}`);
      get()
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div>
      <div className="w-[100%] h-[70px] bg-[#0095ff] text-white flex justify-evenly items-center fixed z-[100] outline-none">
        <div className="flex gap-[10px] items-center">
          <SchoolIcon sx={{ width: "50px", height: "100px" }} />
          <h1 className="text-[28px] font-[700]">Quest</h1>
        </div>
      </div>

      <div className="w-[80%] h-[50px] flex justify-evenly items-center m-auto pt-[150px] mb-[50px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-[250px] h-[35px] pl-[10px] rounded-[5px] outline-none border-[1px] border-[#c6c6c6]"
          placeholder="Search..."
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-[200px] h-[35px] pl-[10px] rounded-[5px] outline-none border-[1px] border-[#c6c6c6]"
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button  onClick={() => addUser()} className="w-[150px] h-[35px] text-white bg-[#0095ff] rounded-[5px] outline-none font-[700] active:bg-[#0095ffa5]">Add New Quest</button>
      </div>

      <div className="w-[85%] m-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map((element) => (
          <Card
            key={element.id}
            className="flex flex-col justify-between"
            sx={{
              maxWidth: 345,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              className="w-[100%] h-[250px]"
              image={element.image}
              alt={element.courseName}
            />

            <CardContent
              className="flex flex-col justify-between gap-[10px] flex-grow"
              sx={{ flexGrow: 1 }}
            >
              <Typography gutterBottom variant="h6" component="div">
                {element.courseName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {element.aboutCourse}
              </Typography>

              <div className="flex justify-between items-center mt-auto">
                <p
                  className={
                    element.status
                      ? "text-green-900 w-[100px] text-center h-[30px] flex justify-center items-center bg-[#00ff0049] rounded-[5px]"
                      : "text-red-700 w-[100px] text-center h-[30px] flex justify-center items-center bg-[#ff000049] rounded-[5px]"
                  }
                >
                  {element.status ? "Active" : "Inactive"}
                </p>
                <Button
                onClick={() => heandleRemove(element.id)}
                  className="h-[30px]"
                  variant="contained"
                >
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addModal ? ( <div className="absolute top-0 left-0  w-[100%] bg-black/50 h-[100vh]">
          <div className="h-[350px] w-[300px] rounded-lg m-auto mt-[15%] flex flex-col items-center bg-white p-[20px] justify-evenly">
            <TextField
            size="small"
              type="text"
              placeholder="Enter course name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
            size="small"
              type="text"
              placeholder="Enter course image..."
              value={image}
              onChange={(e) => setimage(e.target.value)}
            />
            <TextField
            size="small"
              type="text"
              placeholder="Enter course info..."
              value={info}
              onChange={(e) => setinfo(e.target.value)}
            />
            <FormControl>
              <Select
                sx={{width:"210px"}}
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                onChange={(e) => setstatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inctive</MenuItem>
              </Select>
            </FormControl>
              <div className="w-[150px] flex justify-between items-center">
              <Button onClick={() => addUsers()}>Save</Button>
              <Button color="error" onClick={() => addClose()}>Cencel</Button>
              </div>
          </div>
        </div>) : null}

    </div>
  );
};

export default App;
