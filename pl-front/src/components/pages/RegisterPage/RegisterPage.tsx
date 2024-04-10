import { Tabs, TabsProps } from "antd";
import { useEffect } from "react";
import { useListArtists } from "../../../generated/artists/artists";
import { useListAlbums } from "../../../generated/default/default";
import { useListSongs } from "../../../generated/songs/songs";
import AlbumList from "../../parts/AlbumList/AlbumList";
import useAlbumListInfoStore from "../../parts/AlbumList/useAlbumListStore";
import ArtistList from "../../parts/ArtistList/ArtistList";
import useArtistListInfoStore from "../../parts/ArtistList/useArtistListStore";
import SongList from "../../parts/SongList/SongList";
import useSongListInfoStore from "../../parts/SongList/useSongListStore";

const RegisterPage = () => {
  const artistsQuery = useListArtists();
  const songsQuery = useListSongs();
  const albumsQuery = useListAlbums();
  const { setArtistList } = useArtistListInfoStore();
  const { setSongList } = useSongListInfoStore();
  const { setAlbumList } = useAlbumListInfoStore();

  useEffect(() => {
    setArtistList(artistsQuery.data?.data ?? []);
    setSongList(songsQuery.data?.data ?? []);
    setAlbumList(albumsQuery.data?.data ?? []);
  }, [
    albumsQuery.data?.data,
    artistsQuery.data?.data,
    setAlbumList,
    setArtistList,
    setSongList,
    songsQuery.data?.data,
  ]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "アーティスト",
      children: <ArtistList />,
    },
    {
      key: "2",
      label: "楽曲",
      children: <SongList />,
    },
    {
      key: "3",
      label: "アルバム",
      children: <AlbumList />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default RegisterPage;
