
export const isRequired = (value) => {
    return value.trim() !== "";
  };
  
  export const isText = (value) => {
    return /^[a-zA-Z\s]*$/.test(value);
  };
  
  export const validate = (value, rules) => {
    for (let rule of rules) {
      if (!rule.check(value)) {
        return rule.message;
      }
    }
    return "";
  };
  