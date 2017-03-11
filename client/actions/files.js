import $ from 'jquery'

// Add a file
export const FILE_LOAD_PENDING = 'FILE_LOAD_PENDING'
export const FILE_LOAD_SUCCESS = 'FILE_LOAD_SUCCESS'
export const FILE_LOAD_ERROR   = 'FILE_LOAD_ERROR'

export const filesLoad = (dispatch, files) => {
  for (const f in files) {
    fileLoad(dispatch, files[f])
  }
}

export const fileLoad = (dispatch, file) => {
  dispatch(fileLoadPending())
  const reader = new FileReader()
  reader.onload = (f) => {
    dispatch(fileLoadSuccess({
      ...file,
      content: f.target.result
    }))
  }
  reader.onerror = (error) => {
    dispatch(fileLoadError({
      ...file,
      error
    }))
  }
  reader.readAsArrayBuffer(file)
}

const fileLoadPending = () => {
  return {
    type: FILE_LOAD_PENDING
  }
}

const fileLoadSuccess = (file) => {
  return {
    type: FILE_LOAD_SUCCESS,
    file
  }
}

const fileLoadError = (file) => {
  return {
    type: FILE_LOAD_ERROR,
    file
  }
}

// Submitting files to IPFS
export const FILE_SUBMIT_PENDING = 'FILE_SUBMIT_PENDING'
export const FILE_SUBMIT_SUCCESS = 'FILE_SUBMIT_SUCCESS'
export const FILE_SUBMIT_ERROR   = 'FILE_SUBMIT_ERROR'

export const fileSubmit = (index) => {
  return (dispatch, getState) => {
    dispatch(fileSubmitPending())
    $.ajax({
      url: process.env.API_ENDPOINT + '/ipfs/upload',
      type: 'POST',
      data: {
        file: getState().files[index].buffer
      },
      cache: false,
      dataType: 'json',
      processData: false, // Don't process the files
      contentType: false
    })
    .then((res) => {
      console.dir(res)
      dispatch(fileSubmitSuccess(index))
    })
    .catch((err) => {
      console.dir(err)
      dispatch(fileSubmitError(err))
    })
  }
}

const fileSubmitPending = () => {
  return {
    type: FILE_SUBMIT_PENDING
  }
}

const fileSubmitSuccess = (index) => {
  return {
    type: FILE_SUBMIT_SUCCESS,
    index
  }
}

const fileSubmitError = (error) => {
  return {
    type: FILE_SUBMIT_ERROR,
    error
  }
}
