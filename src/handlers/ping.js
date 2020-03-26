module.exports.handler = async (event) => {
  const message = 'pong'

  return {
    statusCode: 200,
    body: JSON.stringify({ message }, null, 2),
  }
}
