const withTM = require("next-transpile-modules")([
  "recharts",
  "d3-shape",
  "d3-path",
  "d3-scale",
  "d3-array",
  "internmap",
  "d3-interpolate",
  "d3-color",
  "d3-format",
  "d3-time",
  "d3-time-format",
  "random-seedable",
]);

module.exports = withTM({ webpack5: false });
