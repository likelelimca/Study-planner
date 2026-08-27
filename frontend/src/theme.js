// Design tokens — "study desk" direction: index cards, planner tabs, a highlighter accent.
export const colors = {
  ink: "#1B2A4A",       // headings, nav, primary actions
  paper: "#FBF8F2",     // page background
  highlighter: "#F4C94D", // signature accent — used sparingly, like a highlighter stroke
  forest: "#2F6B4F",    // completed / success
  clay: "#C1543C",      // high priority / alerts
  line: "#E4DDD0",      // hairline borders
  inkSoft: "#5B6B8C",   // muted secondary text
};

export const priorityColor = {
  high: colors.clay,
  medium: colors.highlighter,
  low: colors.forest,
};
