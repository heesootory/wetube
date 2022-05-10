export const trending = (req, res) => res.render("home", {pageTitle: "Home", potato : "video"});
export const see = (req, res) =>  res.render("watch", {pageTitle: "Watch", potato : "video"});
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit", potato : "video"});
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload the video");
export const deleteVideo = (req, res) => res.send("Delete Video");