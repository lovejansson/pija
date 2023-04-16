export const isValidNumericParam = (val: any) => {
    return (
      (val && typeof val === "string" && isNumeric(val)) ||
      typeof val === "number"
    );
  };
  export const isValidStringParam = (val: any) => {
    return val && typeof val === "string";
  };
  export const isNumeric = (val: string) => {
    // matches a string that has 1 or more digits and also starts and ends with a digit
    const re = new RegExp("^\\d+$");
    const res = re.exec(val);
    return res ? true : false;
  };
  