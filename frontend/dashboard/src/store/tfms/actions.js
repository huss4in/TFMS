export const TYPE = {
  ERROR: "ERROR",
};

export const error = (error) => ({
  type: TYPE.ERROR,
  error,
});
