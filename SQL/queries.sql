SELECT DISTINCT bands.name AS 'Band Name'
FROM bands
LEFT JOIN albums ON bands.id = albums.band_id
GROUP BY albums.band_id
HAVING COUNT(albums.id) = 0;

USE record_company;
SELECT
	albums.name AS Name,
	SUM(songs.length) AS length
FROM albums
JOIN songs ON albums.id = songs.album_id
GROUP BY songs.album_id
ORDER BY length DESC
LIMIT 1;

SELECT * FROM albums;

SELECT
	albums.name AS album,
    albums.release_year AS year,
    MAX(songs.length) AS length
FROM albums
JOIN songs ON songs.album_id = albums.id
GROUP BY albums.id;

SELECT
	bands.name AS name,
    COUNT(songs.id) AS songs
FROM bands
JOIN albums ON bands.id = albums.band_id
JOIN songs ON albums.id = songs.album_id
GROUP BY bands.id;