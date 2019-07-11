module.exports.validateRegisterInput = ({ handle , email, password, confirmPassword}) => {
      const errors = {}

      if (handle.trim() === ''){
            errors.handle = 'Username must not be empty';
      }
      if (email.trim() === ''){
            errors.email = 'Email must not be empty';
      } else {
            const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
            if (!email.match(regex)){
                  errors.email = 'Email must be a valid email address';
            }
      }

      if (password === ''){
            errors.password = 'Password must not be empty';
      } else if (password !== confirmPassword){
            errors.confirmPassword = 'Passwords must match';
      }

      return {
            errors,
            valid: Object.keys(errors).length < 1 
      }
}


module.exports.validateLoginInput = (email, password) => {
      const errors = {}
      if (email.trim() === ''){
            errors.email = 'Email must not be empty';
      }
      if (password.trim() === ''){
            errors.password = 'Password must not be empty';
      }

       return {
            errors,
            valid: Object.keys(errors).length < 1 
      }
}

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};
exports.reduceUserDetails = (data) => {
      let userDetails = {}
      if (isEmpty(data.bio)) userDetails.bio = data.bio
      if(isEmpty(data.website)){
            if(data.website.trim().substring(0, 4) !== 'http'){
                  userDetails.website = `http://${data.website.trim()}`
            } else {
                  userDetails.website = data.website.trim()
            }
      }
      if (isEmpty(data.location)) userDetails.location = data.location

      return userDetails;
}