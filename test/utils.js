export const isThrow = (err) => {
  return err.toString().indexOf('invalid JUMP') !== -1
}
