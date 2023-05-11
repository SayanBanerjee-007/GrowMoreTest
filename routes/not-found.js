// All Required Modules & Packages ========================================
const router = require("express").Router();

// All Routes =============================================================
// Root Routes --------------
router.route("/").get((req, res) => {
  res.render("not-found.ejs", { layout: false });
});

module.exports = router;
