module.exports = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Pure Node.js HTTP responding - No dependencies needed!');
};
