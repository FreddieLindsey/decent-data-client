import accounts from '../infra/testrpc/accounts.json'

export const isThrow = (err) => {
  return err.toString().indexOf('invalid JUMP') !== -1
}

export const findAccount = (name) => {
  for (const i in accounts)
    if (accounts[i].name === name)
      return accounts[i]
  console.log(`No account found with name ${name}`)
}
