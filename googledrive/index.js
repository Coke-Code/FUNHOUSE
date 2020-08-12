const fs = require('fs')
const axios = require('axios')
axios.get('https://www.googleapis.com/drive/v3/files/1T30VrU-48h8xEiE-ElLU_O9sGbLPLRHD?key=AIzaSyAk3ce0jj33je6LlqPkzq4dde6q0cZJx-A&alt=media',{
  headers:{'Authorization':'ya29.a0AfH6SMBZgX_YxvB1vu7JtdYMq_xjOWZQYYMp0k0nmsrcalPDQUq9pK-Mxnqu_vRqwlH-Zj-Y2aK1Xa1IHDpJZBeQ-8WPhEt3pKcycVXxSn1MD_Ef5h8AxvMijKhlgM2ewIjwHhLEQWUdo3ze5gpXiX6dz6XuxiLZDdlT'}
},
{responseType: "stream"})
  .then(function (resp) {
    (resp) => {
      const writer = fs.createWriteStream("./t2.pdf")
      resp.data.pipe(writer)
      writer.on("finish", () => {
        console.log("finish")
      })
      writer.on("error", () => {
        console.log("error")
      })
    }
  })
  .catch(function (error) {
    console.log(error);
  });
