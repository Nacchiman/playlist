PRAGMA foreign_keys = true;

drop table if exists "userAlbums" ;
drop table if exists "albumSongs" ;
drop table if exists "albums" ;
drop table if exists "songs" ;
drop table if exists "artists" ;
drop table if exists "users" ;

-- Artist

create table "artists" (
  "id" TEXT not null
  , "name" TEXT not null
  , "description" TEXT
  , constraint "artists_PKC" primary key ("id")
) ;

-- Song

create table "songs" (
  "id" TEXT not null
  , "name" TEXT not null
  , "description" TEXT
  , "artistId" TEXT not null
  , foreign key (`artistId`) references `artists`(`id`)

  , constraint "songs_PKC" primary key ("id")
) ;


-- Album

create table "albums" (
  "id" TEXT not null
  , "name" TEXT not null
  , "description" TEXT
  , constraint "albums_PKC" primary key ("id")
) ;



-- AlbumSong

create table "albumSongs" (
  "id" TEXT not null
  , "albumId" TEXT not null
  , "songId" TEXT not null
  , foreign key (`albumId`) references `albums`(`id`)
  , foreign key (`songId`) references `songs`(`id`)
  , constraint "albumSongs_PKC" primary key ("id")
) ;

-- USER

create table "users" (
  "id" TEXT not null
  , "nickname" TEXT UNIQUE not null
  , "password" TEXT not null
  , "adminFlag" INTEGER
  , constraint "users_PKC" primary key ("id")
) ;


-- UserAlbum

create table "userAlbums" (
  "id" TEXT not null
  , "albumId" TEXT not null
  , "userId" TEXT not null
  , foreign key (`albumId`) references `albums`(`id`)
  , foreign key (`userId`) references `users`(`id`)
  , constraint "userAlbums_PKC" primary key ("id")
) ;

