# Version 1.2.0

## Changes

-Added POST method in the albums route
-Added POST tests for album route

## Issues

-In the last test for POST in albums.test.js, its failing because on line 29 in routes/albums , the bands is recieving an empty array for some reason. But the route is working perfectly fine when i manually test it.