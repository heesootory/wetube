import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from 'bcrypt';
import { trusted } from "mongoose";

export const getJoin = (req, res) => 
    res.render("join", {pageTitle: "Join"});
export const postJoin = async (req, res) => {
    const {name, username, email, password ,password2, location} = req.body;
    const pageTitle= "Join";
    if(password !== password2){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "password confirmation does not match!",
        });
    }
    const exists = await User.exists({$or : [{username:username}, {email}]});
    if(exists){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken",
        });
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", {
            pageTitle,
            errorMessage : error._message
        });
    }
};

export const getLogin = (req, res) => 
    res.render("Login",{pageTitle : "Login"});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle= "Login";
    const user = await User.findOne({username, socialOnly: false});
    if(!user){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage :"An account with this username does not exists.",
        });
    }
    // validation
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage :"Wrong password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    //console.log(user);
    return res.redirect('/');
};

export const startGithubLogin = (req,res) =>{
    //https://github.com/login/oauth/authorize?client_id=3842b073a9d50af141ac&allow_signup=false&scope=user:email read:user
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const Config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(Config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await
        (await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await(
            await fetch(`${apiUrl}/user`,{
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
        //console.log(userData);
        const emailData = await(
            await fetch(`${apiUrl}/user/emails`,{
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        //console.log(emailData);
        if(!emailObj){
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                socialOnly: true,
                password: "",
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    }else{
        return res.redirect("/login");
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const getEdit = (req, res) =>{
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}
export const postEdit = async (req,res)=>{
    //const id = req.session.user.id;
    //const{name, email, username, location} =  req.body;

    const {
        session: {
            user: {id},
        },
        body : {name, email, username, location},
    } = req;
    
    await User.findByIdAndUpdate()
    return res.render("edit-profile");
}

export const see = (req, res) => res.send("See User");










