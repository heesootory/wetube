import multer from "multer";
export const localsMiddleware = (req, res, next) =>{
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
}


// 사용자가 로그인되어 있지 않다면, 홈으로 리다이렉트.
export const protectordMiddleware = (req, res, next) =>{
    if(req.session.loggedIn){
        return next();
    }else{
        req.flash("error", "Log in first!");
        return res.redirect("/login");
    }
}

// 비로그인자만 접근 가능한 미들웨어. 로그인 되어있다면, 홈으로 리다이렉트.
export const publicOnlyMiddleware = (req, res, next) =>{
    if(!req.session.loggedIn){
        return next();
    }else{
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
}

export const avatarUpload = multer({ dest: "uploads/avatars/", limits:{
    fileSize: 3000000,
} });
export const videoUpload = multer({ dest: "uploads/videos/", limits:{
    fileSize: 1000000000,
}})




