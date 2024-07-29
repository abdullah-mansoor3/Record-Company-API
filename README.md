# Version 1

## Overview

This version contains one route: `/bands`.

## Routes

- **GET /bands**: Retrieves a list of all bands.
- **GET /bands/:id**: Retrieves a specific band by its ID.
- **POST /bands**: Creates a new band.
- **PUT /bands/:id**: Updates an existing band.
- **DELETE /bands/:id**: Deletes a band by its ID.

## Error Handling

The application includes error handling middleware to manage errors that may occur during requests. 

## SQL Schema and Queries

All SQL schema and queries can be found in the [SQL folder](./SQL/).

## Testing

The application has been integration tested. Note that there is an issue with the `GET` test suite: it passes the first time but fails on subsequent runs due to database cleanup problems. Several attempts to fix this issue using transactions, dropping and recreating the database, and deleting tables have not been successful so far. This issue remains unresolved for now, and it is hoped that it will be addressed in future improvements.

## SQL Data Source

The SQL data used for this project was taken from the following repository: [WebDevSimplified/Learn-SQL](https://github.com/WebDevSimplified/Learn-SQL).
