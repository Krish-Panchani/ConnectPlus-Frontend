import axios from "axios";
import React, { useEffect, useState } from "react";
import Nav from "../navbar/navbar";
import './homepage.css'
import PostBox from "./createpost"
import { Navigate, useNavigate } from "react-router-dom";
import Post from "./post";
import BaseUrl from "../BaseUrl";
const photo: string = require("./images/photo.svg").default;
const video: string = require("./images/video.svg").default;
const line: string = require("./images/line.svg").default;
const right: string = require("./images/rightarrow.svg").default;
const item: string = require("./images/item.svg").default;
const link: string = "https://linkedin-backend.azurewebsites.net/";

const Home = () => {
  const Navhandler = useNavigate();
  var accesstoken = localStorage.getItem("accesstoken");
  const user = sessionStorage.getItem("username") || "";
  const [coverImgae, setCover] = useState("");
  const [postClick,setPostClick] = useState(true);
  const config = {
    headers: {
      Authorization: `Bearer ${accesstoken}`,
    },
  };

  const [posts, setPost] = useState([]);

  BaseUrl.get("/profile/mainpage/?username=" + user, config)
    .then((res) => {
      console.log(res);
      setCover(res.data.background_image);
    })
    .catch((err) => {
      if (err.response.status == 404) Navhandler("/profile");
      if (err.response.status == 401) Navhandler("/login");
      console.log(err);
    });
    useEffect(()=>{BaseUrl.get("/post/feed/", config)
    .then((res) => {
      console.log(res);
      setPost(res.data);
    })
    .catch((err) => {
      console.log(err);
    });},[])
  const avatar = sessionStorage.getItem("avatar") || "";
  const name = sessionStorage.getItem("name") || "";
  const headline = sessionStorage.getItem("headLine") || "";
  return (
    <div>
        { postClick ? <PostBox setPostClick={()=>setPostClick(!postClick)} />: <div></div>}
      <Nav />
      <div id="search_post">
        <input placeholder="Start Post" />
        <img src={photo} /> Photo <img src={line} />
        <img src={video} /> Video <img src={line} />
        <div onClick={()=>setPostClick(!postClick) } >Create Post</div>
      </div>
      <div id="shortprofile">
        <img id="shortcover" src={coverImgae} alt="" />
        <img id="shortava" src={avatar} alt="avatar" />
        <p>
          {name} <img src={right} />
        </p>
        {headline}
        <br />
        <img style={{ marginRight: "1vw" }} src={item} />
        <p style={{ display: "inline-block" }}>My Items</p>
      </div>
      <div
        style={{
          width: "45vw",
          position: "absolute",
          marginLeft: "20vw",
          marginTop: "11.4vw",
        }}
      >
        {posts.map((box: any) => {
          return <Post box={box} key={box.id} />;
        })}
      </div>
    </div>
  );
};

export default Home;
