/**
 * @param {String} string
 * @returns capitalized string
 */
export const capitalize = string => {
  if (string == null || typeof string == "undefined") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * @param {String} component
 * @returns async component
 */
export const asyncComponent = component => {
  return () => import(`@/components/${component}`);
};
