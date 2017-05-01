// Change the path of a loaded file
export const FILE_CHANGE_PATH = 'FILE_CHANGE_PATH'

export const fileChangePath = (oldPath, newPath) => ({
  type: FILE_CHANGE_PATH,
  oldPath,
  newPath
})
