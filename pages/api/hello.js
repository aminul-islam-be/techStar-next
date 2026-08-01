export default function handler(req, res) {
  res.status(200).json({ 
    message: 'TechStar API is running!',
    status: 'success'
  })
}
