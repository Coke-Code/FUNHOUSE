const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

async function downloadImage () {  
  const url = 'https://www.googleapis.com/drive/v3/files/1T30VrU-48h8xEiE-ElLU_O9sGbLPLRHD?key=AIzaSyAk3ce0jj33je6LlqPkzq4dde6q0cZJx-A&alt=media'
  const path = Path.resolve(__dirname, 'output', 'test.ppt')
  const writer = Fs.createWriteStream(path)

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
    headers:{
        'Authorization':'Bearer ya29.a0AfH6SMDL-wKnlQ5Ab3co3VYSuE9puRBqHya-i1OAHgAnNKpenGBncnyGqL1PqlLBLIrmxybzobPH7D2nV8K93x4q3l_hQZpuP4pnBnH9EjNwALuxvfSl64OofOa017dlf8AQRFFUssQCghndOXEoqQYZ7T_pcyhjF-DL'
    }
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

downloadImage().catch((err)=>{
    console.log(err)
})