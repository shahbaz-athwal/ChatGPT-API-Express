const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const OpenAI = require('openai');
const messages = []
const mySecret = process.env['SECRET_KEY']

const openai = new OpenAI({
  apiKey: mySecret, // defaults to process.env["OPENAI_API_KEY"]
});

async function main(input) {
  messages.push({ role: 'user', content: input })
  console.log(messages)
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-3.5-turbo',
  });

  // console.log(completion.choices);
  return completion.choices[0]?.message?.content 
}


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

// Render Html File
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/api', async function (req, res, next) {
  console.log(req.body)
  const mes = await main(req.body.input)
  res.json({success: true, message: mes})
})


app.listen(port, () => {
  console.log("Running...")
  // Code.....
})