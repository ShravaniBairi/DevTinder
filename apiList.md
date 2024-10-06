# DevTinder Backend

## Authentication Router
-POST /signUp
-POST /login
-POST /logout

## Profile Router

-PATCH /profile/edit
-GET /profile/view
-PATCH /profile/password

Status of connection request [ignore, interested, accepted, rejected]

## Connection request ROuter
-POST /request/send/interested/:userId
-POST /request/send/ignore/:userId
-POST /request/review/accepted:requestID
-POST /request/review/rejected:requestID

## User Router

-GET /user/connections
-GET /user/requests/receiced 
-GET /user/feed


