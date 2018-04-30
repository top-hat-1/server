# Routes

## api/users

post - send user object.   
    name: string, required
    email: string required

get - returns all users

get by id - /api/users/:id
    returns user by id.  Populates the users following array with user's name/s they are following.

put by id = /api/users/:id
    requires the req body _id to equal the id in the route.  Send the whole user object with put. Route checks _id on user with param id.

delete by id = /api/users/:id
    requires a token

post - /api/users/:id/following 
    add to a users following array a person they are following. Send the user object of the person they want to follow.  The route takes the id of the req.body and adds to user.

    :id in param is the user being added to. The user being sent is the user to add.

## api/projects

post   /api/projects
    will need a token. currently ensure auth is commented out.

get /api/projects
    returns all projects

## api/auth

post  /api/auth/signup
    name, email, password
    if user exists throws 400
    returns 
            {
                token: sign(user),
                _id: user._id,
                name: user.name,
                email: email
            }

post /api/auth/signin
    needs and checks email password
    finds user and returns:
        { 
            token: sign(user),
            name: user.name,
            email: user.email,
            _id: user.id,
            hobbies: user.hobbies,
            photo: user.photo,
            following: user.following
        }

get /api/auth/verify
    requires token, if token exists returns { verified: true }