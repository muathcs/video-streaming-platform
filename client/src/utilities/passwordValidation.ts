type passwordValidationType = {
    required:string, 
    minLength: {
        value:number, 
        message:string
    },
    pattern:{
        value:RegExp, 
        message:string
    }

}

export const passwordValidation:passwordValidationType = {
    required: "Password is required",
    minLength: {
      value: 10,
      message: `Password must be at least 10} characters`,
    },
    pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{10,}$/,
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    },
  };

  