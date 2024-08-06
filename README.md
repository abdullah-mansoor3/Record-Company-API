# Version 1.3.0

## Changes

-Added PUT method in the albums route
-Added PUT tests for album route

## Issues

-In the last test for POST in albums.test.js, its failing because on line 29 in routes/albums , the bands is recieving an empty array for some reason. But the route is working perfectly fine when i manually test it.

-Similar issue with albums put method plus second last test also not working.