export const isThrow = (err) => {
  const throw_ =
    err.toString().indexOf('invalid JUMP') !== -1 ||
    err.toString().indexOf('invalid opcode') !== -1
  if (!throw_) console.log(err)
  return throw_
}
